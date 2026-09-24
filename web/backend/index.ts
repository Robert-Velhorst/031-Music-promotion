import {
    db,
    error,
    json,
    requireAuth,
    router,
    type RouterContext,
    type RouterMiddleware,
} from '@appdeploy/sdk';

type RecordKind = 'releases' | 'campaigns' | 'leads' | 'actions' | 'royalties';
type JsonRecord = Record<string, unknown> & { id?: string; ownerId?: string };
type ProfileRecord = Record<string, unknown> & { territories: string[]; languages: string[] };

const recordKinds = new Set<RecordKind>(['releases', 'campaigns', 'leads', 'actions', 'royalties']);
const pageSize = 100;
const recordByteLimit = 200 * 1024;
const pageKinds = ['profiles', 'releases', 'campaigns', 'leads', 'actions', 'royalties'] as const;

function isObject(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function text(value: unknown, maximum: number, optional = false): value is string {
    return typeof value === 'string' && value.length <= maximum && (optional || value.trim().length > 0);
}

function stringList(value: unknown, maximumItems: number, maximumLength: number): value is string[] {
    return Array.isArray(value)
        && value.length <= maximumItems
        && value.every((item) => text(item, maximumLength))
        && new Set(value).size === value.length;
}

function isoDate(value: unknown, optional = false): value is string {
    if (optional && value === '') return true;
    if (!text(value, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function secureUrl(value: unknown, optional = false): value is string {
    if (optional && value === '') return true;
    if (!text(value, 500) || value !== value.trim() || /[\u0000-\u0020]/.test(value)) return false;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
    } catch {
        return false;
    }
}

function tableFor(kind: string, userId: string): string | null {
    if ((kind !== 'profiles' && !recordKinds.has(kind as RecordKind)) || !/^[A-Za-z0-9_-]{1,160}$/.test(userId)) return null;
    return `note_${kind}_${userId}`;
}

function userIdFrom(ctx: RouterContext): string {
    return ctx.user!.userId;
}

function asKind(value: string): RecordKind | null {
    return recordKinds.has(value as RecordKind) ? value as RecordKind : null;
}

function failure(operation: string, cause: unknown) {
    const name = cause instanceof Error ? cause.name : 'unknown';
    console.error('NOTE request failed', { operation, name });
    if (name === 'AppDatabaseQuotaExceeded') return error('rate_limited_try_later', 429);
    return error('service_unavailable', 503);
}

function safeHandler(operation: string, action: (ctx: RouterContext) => Promise<ReturnType<typeof json> | ReturnType<typeof error>>) {
    return async (ctx: RouterContext) => {
        try {
            return await action(ctx);
        } catch (cause) {
            return failure(operation, cause);
        }
    };
}

async function listOwn(table: string, ownerId: string, nextToken?: string) {
    const result = await db.list<JsonRecord>(table, { limit: pageSize, ...(nextToken ? { nextToken } : {}) });
    return {
        items: result.items.filter((item) => item.ownerId === ownerId),
        nextToken: result.nextToken,
    };
}

async function ownById(table: string, id: string, ownerId: string): Promise<JsonRecord | null> {
    if (!/^[A-Za-z0-9_-]{1,160}$/.test(id)) return null;
    const [record] = await db.get<JsonRecord>(table, [id]);
    return record?.ownerId === ownerId ? { ...record, id } : null;
}

function validateProfile(value: unknown): value is ProfileRecord {
    if (!isObject(value)) return false;
    return text(value.artistName, 100)
        && text(value.genre, 80)
        && text(value.bio ?? '', 1200, true)
        && typeof value.homeTerritory === 'string'
        && /^[A-Z]{2}$/.test(value.homeTerritory)
        && stringList(value.languages, 20, 60)
        && value.languages.length > 0
        && Array.isArray(value.territories)
        && value.territories.length > 0
        && value.territories.length <= 50
        && value.territories.every((item) => typeof item === 'string' && /^[A-Z]{2}$/.test(item))
        && new Set(value.territories).size === value.territories.length
        && secureUrl(value.website ?? '', true)
        && text(value.distributor ?? '', 120, true)
        && text(value.publisher ?? '', 120, true)
        && text(value.pro ?? '', 120, true)
        && text(value.neighbouringRights ?? '', 120, true)
        && text(value.prohibitedContexts ?? '', 1000, true)
        && text(value.contactPreferences ?? '', 500, true);
}

function validRoyaltyShape(value: unknown): value is Record<string, unknown> {
    return isObject(value)
        && text(value.releaseId, 160)
        && ['Master royalties', 'Composition/performance', 'Neighbouring rights', 'Sync/licence', 'Direct-to-fan', 'Live', 'Other'].includes(String(value.category))
        && text(value.source, 120)
        && text(value.reportingPeriod, 30)
        && isoDate(value.statementDate)
        && /^[A-Z]{3}$/.test(String(value.currency))
        && typeof value.amount === 'number'
        && Number.isFinite(value.amount)
        && value.amount >= -100000000
        && value.amount <= 100000000
        && text(value.statementReference ?? '', 120, true)
        && text(value.sourceCategory ?? '', 120, true)
        && (value.lineNumber === undefined || (typeof value.lineNumber === 'number' && Number.isInteger(value.lineNumber) && value.lineNumber > 0))
        && ['Artist-entered', 'Imported artist statement'].includes(String(value.provenance));
}

async function recordIsValid(kind: RecordKind, value: unknown, ownerId: string): Promise<boolean> {
    if (!isObject(value)) return false;
    if (kind === 'releases') {
        const valid = text(value.title, 120)
            && text(value.version ?? '', 80, true)
            && ['Single', 'EP', 'Album', 'Other'].includes(String(value.releaseType))
            && text(value.genre, 100)
            && text(value.language, 60)
            && isoDate(value.releaseDate)
            && stringList(value.territories, 50, 2)
            && value.territories.length > 0
            && value.territories.every((code) => /^[A-Z]{2}$/.test(code))
            && text(value.isrc ?? '', 12, true)
            && text(value.iswc ?? '', 30, true)
            && text(value.upc ?? '', 14, true)
            && text(value.contributors ?? '', 1500, true)
            && text(value.ownershipNote ?? '', 1000, true)
            && text(value.sampleClearance ?? '', 500, true)
            && text(value.permittedUses ?? '', 1000, true)
            && secureUrl(value.publicLink ?? '', true)
            && typeof value.artistAuthorityConfirmed === 'boolean'
            && text(value.rightsEvidenceNote ?? '', 1000, true);
        if (!valid || !stringList(value.territories, 50, 2)) return false;
        const profiles = await listOwn(tableFor('profiles', ownerId)!, ownerId);
        const permitted = profiles.items[0]?.territories;
        const profileLanguages = profiles.items[0]?.languages;
        return Array.isArray(permitted) && value.territories.every((territory) => permitted.includes(territory))
            && Array.isArray(profileLanguages) && profileLanguages.includes(value.language);
    }
    if (kind === 'campaigns') {
        if (!text(value.title, 120) || !text(value.releaseId, 160) || !text(value.objective, 300)) return false;
        if (!['Draft', 'Ready', 'Active', 'Paused', 'Completed'].includes(String(value.status ?? 'Draft'))) return false;
        if (!isoDate(value.startDate) || !isoDate(value.endDate) || String(value.endDate) < String(value.startDate)) return false;
        if (!stringList(value.channels, 12, 40) || !value.channels.length || value.channels.some((channel) => !['Editorial', 'Radio', 'Press', 'Podcast', 'Creator', 'Sync', 'Community', 'Direct-to-fan', 'Other'].includes(channel))) return false;
        if (!stringList(value.territories, 50, 2) || !value.territories.length || !stringList(value.languages, 20, 60) || !value.languages.length) return false;
        if (!value.territories.every((code) => /^[A-Z]{2}$/.test(code))) return false;
        if (!text(value.exclusions, 1200)) return false;
        if (!text(value.pitchDraft ?? '', 1500, true) || typeof (value.pitchApproved ?? false) !== 'boolean') return false;
        if (String(value.pitchDraft ?? '').trim() && value.pitchApproved !== true) return false;
        if (typeof value.budgetCap !== 'number' || !Number.isFinite(value.budgetCap) || value.budgetCap < 0 || value.budgetCap > 1000000) return false;
        if (!/^[A-Z]{3}$/.test(String(value.budgetCurrency))) return false;
        const target = value.actionTarget;
        if (target !== null && target !== undefined && (typeof target !== 'number' || !Number.isInteger(target) || target < 0 || target > 10000)) return false;
        const release = await ownById(tableFor('releases', ownerId)!, String(value.releaseId), ownerId);
        if (!release || !isObject(release) || release.archived === true) return false;
        if (value.status === 'Active' && release.artistAuthorityConfirmed !== true) return false;
        const releaseTerritories = release.territories;
        if (!Array.isArray(releaseTerritories)) return false;
        const profile = await listOwn(tableFor('profiles', ownerId)!, ownerId);
        const permitted = isObject(profile.items[0]) ? profile.items[0].territories : [];
        const profileLanguages = isObject(profile.items[0]) ? profile.items[0].languages : [];
        return Array.isArray(permitted) && value.territories.every((territory) => permitted.includes(territory))
            && value.territories.every((territory) => releaseTerritories.includes(territory))
            && Array.isArray(profileLanguages) && value.languages.every((language) => profileLanguages.includes(language));
    }
    if (kind === 'leads') {
        return text(value.name, 140)
            && ['Editorial', 'Radio', 'Press', 'Podcast', 'Creator', 'Sync', 'Community', 'Direct-to-fan', 'Other'].includes(String(value.channel))
            && secureUrl(value.publicUrl)
            && text(value.territory ?? '', 2, true)
            && (value.territory === '' || /^[A-Z]{2}$/.test(String(value.territory)))
            && text(value.fitReason, 1000)
            && text(value.requirements ?? '', 1000, true)
            && text(value.contactRoute ?? '', 120, true)
            && text(value.feeDisclosure ?? '', 500, true)
            && typeof value.contactReviewed === 'boolean'
            && typeof value.suppressed === 'boolean';
    }
    if (kind === 'actions') {
        if (!text(value.campaignId, 160) || !text(value.leadId, 160)) return false;
        if (!['Researched', 'Prepared', 'Sent by artist', 'Response', 'Accepted', 'Published', 'Declined', 'Follow-up', 'Other'].includes(String(value.eventType))) return false;
        if (!isoDate(value.occurredOn) || !text(value.notes ?? '', 1200, true) || !text(value.evidenceUrl ?? '', 500, true)) return false;
        if (value.evidenceUrl && !secureUrl(value.evidenceUrl)) return false;
        const campaign = await ownById(tableFor('campaigns', ownerId)!, String(value.campaignId), ownerId);
        const lead = await ownById(tableFor('leads', ownerId)!, String(value.leadId), ownerId);
        if (!campaign || !lead || lead.suppressed === true) return false;
        return true;
    }
    if (kind === 'royalties') {
        return validRoyaltyShape(value)
            && (await ownById(tableFor('releases', ownerId)!, String(value.releaseId), ownerId)) !== null;
    }
    return false;
}

function safeRecord(value: Record<string, unknown>, ownerId: string, kind: string) {
    const clean = { ...value };
    delete clean.id;
    delete clean.ownerId;
    delete clean.kind;
    const record: Record<string, unknown> = {
        ...clean,
        kind,
        ownerId,
        updatedAt: new Date().toISOString(),
    };
    if (!record.createdAt) record.createdAt = record.updatedAt;
    return new TextEncoder().encode(JSON.stringify(record)).length <= recordByteLimit ? record : null;
}

async function saveRecord(kind: RecordKind, data: Record<string, unknown>, ownerId: string) {
    const table = tableFor(kind, ownerId)!;
    const record = safeRecord(data, ownerId, kind);
    if (!record) return error('record_too_large', 413);
    const [id] = await db.add(table, [record]);
    if (!id) return error('record_not_saved', 503);
    return json({ ...record, id }, 201);
}

const routes: Record<string, RouterMiddleware[]> = {
    'GET /api/_healthcheck': [async () => json({ status: 'ok', product: 'NOTE', service: 'promotion' })],

    'GET /api/workspace': [
        requireAuth(),
        safeHandler('workspace_read', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const kinds = pageKinds;
            const pages = await Promise.all(kinds.map((kind) => listOwn(tableFor(kind, ownerId)!, ownerId)));
            const [profiles, releases, campaigns, leads, actions, royalties] = pages;
            return json({
                profile: profiles.items[0] ?? null,
                releases: releases.items,
                campaigns: campaigns.items,
                leads: leads.items,
                actions: actions.items,
                royalties: royalties.items,
                pages: Object.fromEntries(kinds.map((kind, index) => [kind, pages[index].nextToken ?? null])),
            });
        }),
    ],

    'POST /api/profile': [
        requireAuth(),
        safeHandler('profile_write', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const input = ctx.body;
            if (!validateProfile(input)) return error('invalid_profile', 422);
            const table = tableFor('profiles', ownerId)!;
            const existing = await listOwn(table, ownerId);
            const record = safeRecord(input, ownerId, 'profile');
            if (!record) return error('record_too_large', 413);
            const profileRecord = { ...record, kind: 'profile' };
            if (existing.items[0]) {
                const releases = await listOwn(tableFor('releases', ownerId)!, ownerId);
                const campaigns = await listOwn(tableFor('campaigns', ownerId)!, ownerId);
                const savedTerritories = Array.isArray(existing.items[0].territories) ? existing.items[0].territories : [];
                const savedLanguages = Array.isArray(existing.items[0].languages) ? existing.items[0].languages : [];
                if (releases.items.some((release) => Array.isArray(release.territories) && release.territories.some((territory) => !input.territories.includes(territory)))) return error('profile_cannot_remove_territories_in_use', 409);
                if (campaigns.items.some((campaign) => Array.isArray(campaign.languages) && campaign.languages.some((language) => !input.languages.includes(language)))) return error('profile_cannot_remove_languages_in_use', 409);
                if ((releases.nextToken && savedTerritories.some((territory) => !input.territories.includes(territory)))
                    || (campaigns.nextToken && savedLanguages.some((language) => !input.languages.includes(language)))) {
                    return error('profile_scope_change_requires_review', 409);
                }
                const [saved] = await db.update(table, [{ id: existing.items[0].id!, record: profileRecord }]);
                if (!saved) return error('profile_not_saved', 503);
                return json({ ...profileRecord, id: existing.items[0].id });
            }
            const [id] = await db.add(table, [profileRecord]);
            if (!id) return error('profile_not_saved', 503);
            return json({ ...profileRecord, id }, 201);
        }),
    ],

    'POST /api/records/:kind': [
        requireAuth(),
        safeHandler('record_create', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const kind = asKind(ctx.params.kind);
            if (!kind || !isObject(ctx.body)) return error('invalid_record_type', 404);
            const input = kind === 'campaigns' ? { ...ctx.body, status: 'Draft' } : ctx.body;
            if (kind === 'royalties' && input.provenance !== 'Artist-entered') return error('invalid_record', 422);
            if (!(await recordIsValid(kind, input, ownerId))) return error('invalid_record', 422);
            return saveRecord(kind, input, ownerId);
        }),
    ],

    'POST /api/royalties/import': [
        requireAuth(),
        safeHandler('royalty_import', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            if (!isObject(ctx.body)) return error('invalid_statement_import', 422);
            const statementReference = ctx.body.statementReference;
            const rows = ctx.body.rows;
            if (!text(statementReference, 120) || !Array.isArray(rows) || rows.length < 1 || rows.length > 100) return error('invalid_statement_import', 422);
            const releaseIdsToCheck = new Set<string>();
            for (const value of rows) {
                if (!validRoyaltyShape(value) || typeof value.releaseId !== 'string') return error('invalid_statement_line', 422);
                releaseIdsToCheck.add(value.releaseId);
            }
            const releaseIds = Array.from(releaseIdsToCheck);
            const releaseRecords = await db.get<JsonRecord>(tableFor('releases', ownerId)!, releaseIds);
            const validReleaseIds = new Set(releaseRecords.flatMap((release, index) => release?.ownerId === ownerId ? [releaseIds[index]] : []));
            const existing = await listOwn(tableFor('royalties', ownerId)!, ownerId);
            const existingKeys = new Set(existing.items.map((row) => row.importKey).filter((key): key is string => typeof key === 'string'));
            const writes: Record<string, unknown>[] = [];
            let skipped = 0;
            for (const value of rows) {
                if (!validRoyaltyShape(value) || typeof value.releaseId !== 'string' || !validReleaseIds.has(value.releaseId)) return error('invalid_statement_line', 422);
                const lineNumber = typeof value.lineNumber === 'number' && Number.isInteger(value.lineNumber) && value.lineNumber > 0 ? value.lineNumber : null;
                if (lineNumber === null) return error('statement_line_number_required', 422);
                const importKey = `${statementReference}|${lineNumber}|${value.releaseId}|${value.amount}|${value.currency}|${value.category}|${value.source}`;
                if (existingKeys.has(importKey)) { skipped += 1; continue; }
                existingKeys.add(importKey);
                const record = safeRecord({ ...value, statementReference, importKey, provenance: 'Imported artist statement' }, ownerId, 'royalties');
                if (!record) return error('statement_line_too_large', 413);
                writes.push(record);
            }
            if (!writes.length) return json({ imported: 0, skipped, duplicateOnly: true });
            const ids = await db.add(tableFor('royalties', ownerId)!, writes);
            const imported = ids.filter((id) => typeof id === 'string').length;
            const failed = ids.filter((id) => id === null).length;
            return imported ? json({ imported, skipped, failed, duplicateOnly: false }, 201) : error('statement_lines_not_imported', 503);
        }),
    ],

    'GET /api/records/:kind': [
        requireAuth(),
        safeHandler('record_page', async (ctx) => {
            const kind = asKind(ctx.params.kind);
            if (!kind) return error('invalid_record_type', 404);
            const ownerId = userIdFrom(ctx);
            const nextToken = text(ctx.query.nextToken ?? '', 3000, true) ? ctx.query.nextToken : undefined;
            return json(await listOwn(tableFor(kind, ownerId)!, ownerId, nextToken));
        }),
    ],

    'PUT /api/records/:kind/:id': [
        requireAuth(),
        safeHandler('record_update', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const kind = asKind(ctx.params.kind);
            if (!kind || !isObject(ctx.body)) return error('invalid_record_type', 404);
            const table = tableFor(kind, ownerId)!;
            const existing = await ownById(table, ctx.params.id, ownerId);
            if (!existing) return error('record_not_found', 404);
            const next: Record<string, unknown> = { ...existing, ...ctx.body, id: existing.id, ownerId, kind, createdAt: existing.createdAt };
            if (kind === 'campaigns') next.status = existing.status ?? 'Draft';
            if (kind === 'leads' && existing.suppressed === true) next.suppressed = true;
            if (kind === 'releases' && existing.archived === true) next.archived = true;
            if (kind === 'royalties') {
                next.provenance = existing.provenance;
                next.sourceCategory = existing.sourceCategory;
                next.importKey = existing.importKey;
                next.lineNumber = existing.lineNumber;
            }
            if (kind === 'releases' && existing.artistAuthorityConfirmed === true && next.artistAuthorityConfirmed !== true) {
                const campaigns = await listOwn(tableFor('campaigns', ownerId)!, ownerId);
                if (campaigns.items.some((campaign) => campaign.releaseId === existing.id && campaign.status === 'Active') || campaigns.nextToken) {
                    return error('campaign_authority_in_use_review_required', 409);
                }
            }
            if (!(await recordIsValid(kind, next, ownerId))) return error('invalid_record', 422);
            const record = safeRecord(next, ownerId, kind);
            if (!record) return error('record_too_large', 413);
            const [saved] = await db.update(table, [{ id: existing.id!, record }]);
            if (!saved) return error('record_not_saved', 503);
            return json({ ...record, id: existing.id });
        }),
    ],

    'DELETE /api/records/:kind/:id': [
        requireAuth(),
        safeHandler('record_delete', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const kind = asKind(ctx.params.kind);
            if (!kind) return error('invalid_record_type', 404);
            const table = tableFor(kind, ownerId)!;
            const existing = await ownById(table, ctx.params.id, ownerId);
            if (!existing) return error('record_not_found', 404);
            if (kind === 'releases') return error('release_archive_instead', 409);
            if (kind === 'leads') return error('lead_suppress_instead', 409);
            if (kind === 'campaigns') return error('campaign_history_is_preserved', 409);
            const [deleted] = await db.delete(table, [existing.id!]);
            return deleted ? json({ deleted: true }) : error('record_not_deleted', 503);
        }),
    ],

    'POST /api/campaigns/:id/transition': [
        requireAuth(),
        safeHandler('campaign_transition', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            if (!isObject(ctx.body) || !['Ready', 'Active', 'Paused', 'Completed'].includes(String(ctx.body.status))) return error('invalid_campaign_status', 422);
            const table = tableFor('campaigns', ownerId)!;
            const campaign = await ownById(table, ctx.params.id, ownerId);
            if (!campaign) return error('campaign_not_found', 404);
            const currentStatus = String(campaign.status ?? 'Draft');
            const allowedTransitions: Record<string, string[]> = {
                Draft: ['Ready', 'Completed'],
                Ready: ['Draft', 'Active', 'Completed'],
                Active: ['Paused', 'Completed'],
                Paused: ['Active', 'Completed'],
                Completed: [],
            };
            if (!allowedTransitions[currentStatus]?.includes(String(ctx.body.status))) return error('invalid_campaign_transition', 409);
            if (ctx.body.status === 'Active') {
                const release = await ownById(tableFor('releases', ownerId)!, String(campaign.releaseId), ownerId);
                const profilePage = await listOwn(tableFor('profiles', ownerId)!, ownerId);
                const profile = profilePage.items[0];
                if (!release || release.artistAuthorityConfirmed !== true) return error('artist_authority_confirmation_required', 409);
                if (release.archived === true) return error('archived_release_cannot_be_promoted', 409);
                if (!profile || !campaign.startDate || !campaign.endDate || !campaign.exclusions) return error('complete_campaign_boundaries_before_activation', 409);
                if (!Array.isArray(campaign.channels) || !campaign.channels.length || !Array.isArray(campaign.territories) || !campaign.territories.length) return error('choose_campaign_channels_and_territories', 409);
                if (!Array.isArray(campaign.languages) || !campaign.languages.length || String(campaign.startDate) > String(campaign.endDate)) return error('complete_campaign_boundaries_before_activation', 409);
                const profileTerritories = Array.isArray(profile.territories) ? profile.territories : [];
                const releaseTerritories = Array.isArray(release.territories) ? release.territories : [];
                if (campaign.territories.some((territory) => !profileTerritories.includes(territory) || !releaseTerritories.includes(territory))) return error('campaign_territory_outside_release_permission', 409);
            }
            const record = { ...campaign, status: ctx.body.status, updatedAt: new Date().toISOString() };
            const [saved] = await db.update(table, [{ id: campaign.id!, record }]);
            if (!saved) return error('campaign_not_saved', 503);
            return json({ ...record, id: campaign.id, externalActionsEnabled: false });
        }),
    ],

    'POST /api/releases/:id/archive': [
        requireAuth(),
        safeHandler('release_archive', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const table = tableFor('releases', ownerId)!;
            const release = await ownById(table, ctx.params.id, ownerId);
            if (!release) return error('release_not_found', 404);
            if (release.archived === true) return json({ ...release, alreadyArchived: true });
            const record = { ...release, archived: true, updatedAt: new Date().toISOString() };
            const [saved] = await db.update(table, [{ id: release.id!, record }]);
            if (!saved) return error('release_not_archived', 503);
            return json({ ...record, id: release.id });
        }),
    ],

    'POST /api/leads/:id/suppress': [
        requireAuth(),
        safeHandler('lead_suppress', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            if (!isObject(ctx.body) || !text(ctx.body.reason, 500)) return error('suppression_reason_required', 422);
            const table = tableFor('leads', ownerId)!;
            const lead = await ownById(table, ctx.params.id, ownerId);
            if (!lead) return error('lead_not_found', 404);
            const record = { ...lead, suppressed: true, suppressionReason: ctx.body.reason, suppressedAt: new Date().toISOString() };
            const [saved] = await db.update(table, [{ id: lead.id!, record }]);
            if (!saved) return error('suppression_not_saved', 503);
            return json({ ...record, id: lead.id });
        }),
    ],

    'GET /api/data/export': [
        requireAuth(),
        safeHandler('data_export', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            const kinds = pageKinds;
            const pages = await Promise.all(kinds.map((kind) => listOwn(tableFor(kind, ownerId)!, ownerId)));
            return json({
                product: 'NOTE Promotion',
                exportedAt: new Date().toISOString(),
                data: Object.fromEntries(kinds.map((kind, index) => [kind, pages[index].items])),
                pages: Object.fromEntries(kinds.map((kind, index) => [kind, pages[index].nextToken ?? null])),
            });
        }),
    ],

    'DELETE /api/account/data/:kind': [
        requireAuth(),
        safeHandler('account_data_delete', async (ctx) => {
            const ownerId = userIdFrom(ctx);
            if (!isObject(ctx.body) || ctx.body.confirmation !== 'DELETE MY NOTE DATA') return error('explicit_confirmation_required', 422);
            const kind = ctx.params.kind === 'profiles' ? 'profiles' : asKind(ctx.params.kind);
            if (!kind) return error('invalid_record_type', 404);
            const table = tableFor(kind, ownerId)!;
            const page = await listOwn(table, ownerId);
            const ids = page.items.map((item) => item.id).filter((id): id is string => typeof id === 'string');
            if (ids.length && !(await db.delete(table, ids)).every(Boolean)) return error('data_deletion_incomplete_retry_this_section', 503);
            const remaining = await listOwn(table, ownerId);
            return json({ deletedCount: ids.length, moreRecords: remaining.items.length > 0 || Boolean(remaining.nextToken), authAccountRemains: true });
        }),
    ],
};

export const handler = router(routes);
