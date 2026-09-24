import { ApiError } from './client';
import type { PageKind, RecordKind, Workspace } from './types';

export type Section = 'Overview' | 'Song Passport' | 'Campaigns' | 'Opportunities' | 'Activity log' | 'Earnings' | 'Settings';
export type EditorKind = 'profile' | RecordKind;
export type EditorState = { kind: EditorKind; id?: string; value: Record<string, unknown> };

export const kindLabels: Record<PageKind, string> = {
    profiles: 'artist profile', releases: 'release', campaigns: 'campaign', leads: 'opportunity', actions: 'activity record', royalties: 'income record',
};

export const activityOutcomeLabels: Record<string, string> = {
    Researched: 'Research', Prepared: 'Prepared', 'Sent by artist': 'Artist sent', Response: 'Response',
    Accepted: 'Accepted', Published: 'Published', Declined: 'Declined', 'Follow-up': 'Follow-up', Other: 'Other',
};

export function blankWorkspace(): Workspace {
    return {
        profile: null, releases: [], campaigns: [], leads: [], actions: [], royalties: [],
        pages: { profiles: null, releases: null, campaigns: null, leads: null, actions: null, royalties: null },
    };
}

export function friendlyError(error: unknown): string {
    if (!(error instanceof ApiError)) return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    const messages: Record<string, string> = {
        invalid_profile: 'Check the required artist profile fields and try again.',
        invalid_record: 'Some details need attention. Review the form and try again.',
        invalid_statement_import: 'This statement could not be imported. Check the statement reference and file.',
        invalid_statement_line: 'A row has a missing or invalid amount, date, currency, or release.',
        statement_line_number_required: 'The statement is missing a row number. Reopen the original CSV and try again.',
        artist_authority_confirmation_required: 'Confirm you have authority to promote this release before activating its campaign.',
        campaign_authority_in_use_review_required: 'This release is referenced by an active campaign, or NOTE could not check every campaign. Pause or complete its campaigns before changing authority.',
        complete_campaign_boundaries_before_activation: 'Add campaign dates and exclusions before activation.',
        choose_campaign_channels_and_territories: 'Choose at least one channel and territory.',
        campaign_territory_outside_release_permission: 'This campaign goes beyond the release territories you confirmed.',
        profile_cannot_remove_territories_in_use: 'A saved release uses one of those territories. Update that release first.',
        profile_cannot_remove_languages_in_use: 'A saved campaign uses one of those languages. Update that campaign first.',
        profile_scope_change_requires_review: 'This workspace has more records than NOTE checked. Load and review the affected records before reducing profile scopes.',
        release_archive_instead: 'Archive releases to preserve promotion history.',
        lead_suppress_instead: 'Suppress opportunities to preserve contact history.',
        invalid_campaign_transition: 'That campaign status change is not allowed. Refresh and try again.',
        archived_release_cannot_be_promoted: 'An archived release cannot be activated in a campaign.',
        service_unavailable: 'NOTE could not save that change. Your existing records are still safe. Try again shortly.',
        rate_limited_try_later: 'The workspace is busy. Wait a moment and try again.',
        record_not_found: 'That record has changed or is no longer available. Refresh and try again.',
        explicit_confirmation_required: 'The confirmation phrase did not match.',
    };
    return messages[error.code] ?? (error.status === 401 ? 'Your sign-in has expired. Sign in again to continue.' : `Could not complete that request (${error.code}).`);
}

export function asRecord(value: object): Record<string, unknown> {
    const copy = { ...value } as Record<string, unknown>;
    delete copy.id;
    delete copy.ownerId;
    delete copy.kind;
    delete copy.updatedAt;
    delete copy.createdAt;
    return copy;
}

export function today(): string {
    return new Date().toISOString().slice(0, 10);
}

export function initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'N';
}

export function currency(amount: number, code: string): string {
    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(amount);
    } catch {
        return `${code} ${amount.toFixed(2)}`;
    }
}

export function detectCsvColumns(header: string[]): Record<string, number> {
    const aliases: Record<string, string[]> = {
        release: ['release id', 'releaseid', 'isrc', 'release isrc', 'track isrc', 'release', 'track', 'song', 'recording'],
        amount: ['amount', 'net amount', 'royalty amount', 'net royalties', 'royalties'],
        currency: ['currency', 'ccy', 'currency code'],
        date: ['statement date', 'statementdate', 'date', 'reported at', 'payment date'],
        period: ['reporting period', 'reportingperiod', 'period', 'month', 'quarter'],
        category: ['category', 'royalty type', 'type', 'income type'],
        source: ['source', 'platform', 'payer', 'service', 'provider'],
        line: ['line number', 'linenumber', 'row'],
        reference: ['reference', 'statement reference', 'transaction id'],
    };
    const normalized = header.map((cell) => cell.toLowerCase().trim().replace(/[_-]+/g, ' '));
    return Object.fromEntries(Object.entries(aliases).map(([key, candidates]) => [key, normalized.findIndex((cell) => candidates.includes(cell))]));
}

export function parseStatementAmount(value: string): number {
    let normalized = value.replace(/[€$£\s]/g, '');
    if (normalized.includes(',') && normalized.includes('.')) {
        normalized = normalized.lastIndexOf(',') > normalized.lastIndexOf('.')
            ? normalized.replace(/\./g, '').replace(',', '.')
            : normalized.replace(/,/g, '');
    } else if (normalized.includes(',')) {
        normalized = normalized.replace(',', '.');
    }
    return Number(normalized);
}

export function commaList(value: unknown): string {
    return Array.isArray(value) ? value.map(String).join(', ') : '';
}

export function normalizeList(value: string): string[] {
    return Array.from(new Set(value.split(',').map((part) => part.trim()).filter(Boolean)));
}

export function fieldValue(value: unknown): string | number {
    if (typeof value === 'number') return value;
    return String(value ?? '');
}
