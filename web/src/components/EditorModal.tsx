import { useEffect, useRef, type FormEvent } from 'react';
import { Banknote, Check, LoaderCircle, ShieldCheck, X } from 'lucide-react';
import { activityTypes, channels, royaltyCategories, type Campaign, type Lead, type Profile, type Release } from '../types';
import type { EditorState } from '../helpers';
import { fieldValue } from '../helpers';
import { Field } from './SharedUi';

export function EditorModal(props: {
    editor: EditorState; profile: Profile | null; releases: Release[]; campaigns: Campaign[]; leads: Lead[];
    busy: boolean; onClose: () => void; onChange: (value: Record<string, unknown>) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    const dialogRef = useRef<HTMLElement>(null);
    const closeHandler = useRef(props.onClose);
    closeHandler.current = props.onClose;
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ));
        (dialog.querySelector<HTMLElement>('[autofocus]') ?? getFocusable()[0])?.focus();
        const handleKeys = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeHandler.current();
                return;
            }
            if (event.key !== 'Tab') return;
            const focusable = getFocusable();
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
                return;
            }
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeys);
        return () => {
            document.removeEventListener('keydown', handleKeys);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus();
        };
    }, []);
    const { editor } = props;
    const value = editor.value;
    const title = editor.kind === 'profile' ? 'Artist profile' : editor.id ? `Edit ${editor.kind.slice(0, -1)}` : editor.kind === 'releases' ? 'Song Passport' : editor.kind === 'campaigns' ? 'Campaign plan' : editor.kind === 'leads' ? 'Opportunity record' : editor.kind === 'actions' ? 'Activity record' : 'Income record';
    const subtitle = editor.kind === 'profile' ? 'Set the territories, languages, and context rules your promotion plans must follow.'
        : editor.kind === 'releases' ? 'Record facts and rights notes. A self-confirmation is not external proof of ownership.'
            : editor.kind === 'campaigns' ? 'Set a practical plan. NOTE will not take external action or spend the budget.'
                : editor.kind === 'leads' ? 'Save public fit, current rules, fee terms, and the contact route you checked.'
                    : editor.kind === 'actions' ? 'Record work and outcomes separately. Use exact dates and attach evidence when available.'
                        : 'Enter the values from your statement. Keep the source and reporting period visible.';
    const update = (key: string, next: unknown) => props.onChange({ [key]: next });
    const selectedRelease = props.releases.find((release) => release.id === value.releaseId);
    return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) props.onClose(); }}><section ref={dialogRef} className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title"><header className="editor-head"><div><div className="panel-kicker">YOUR NOTE WORKSPACE</div><h2 id="editor-title">{title}</h2><p>{subtitle}</p></div><button className="icon-button" type="button" onClick={props.onClose} aria-label="Close form"><X size={19} /></button></header><form className="editor-form" onSubmit={props.onSubmit}><div className="editor-fields">
        {editor.kind === 'profile' && <>
            <Field label="Artist or project name" required><input autoFocus value={String(value.artistName ?? '')} maxLength={100} onChange={(event) => update('artistName', event.target.value)} /></Field>
            <Field label="Primary genre" required><input value={String(value.genre ?? '')} maxLength={80} placeholder="e.g. ambient, jazz, electronic" onChange={(event) => update('genre', event.target.value)} /></Field>
            <Field label="Short artist bio"><textarea value={String(value.bio ?? '')} maxLength={1200} rows={3} placeholder="Use verified facts only." onChange={(event) => update('bio', event.target.value)} /></Field>
            <Field label="Home territory (ISO country code)" hint="Enter the two-letter ISO code for your home territory." required><input maxLength={2} pattern="[A-Z]{2}" placeholder="NL" value={String(value.homeTerritory ?? '')} onChange={(event) => update('homeTerritory', event.target.value.toUpperCase())} /></Field>
            <Field label="Promotion territories" hint="Comma-separated country codes, for example NL, BE, DE." required><input value={String(value.territories ?? '')} placeholder="NL, BE, DE" onChange={(event) => update('territories', event.target.value.toUpperCase())} /></Field>
            <Field label="Languages" hint="Comma-separated languages, for example Dutch, English." required><input value={String(value.languages ?? '')} placeholder="English, Dutch" onChange={(event) => update('languages', event.target.value)} /></Field>
            <Field label="Website"><input type="url" value={String(value.website ?? '')} placeholder="https://" onChange={(event) => update('website', event.target.value)} /></Field>
            <div className="field-divider">CAREER & CONTACT CONTEXT</div>
            <Field label="Distributor"><input value={String(value.distributor ?? '')} onChange={(event) => update('distributor', event.target.value)} /></Field>
            <Field label="Publisher"><input value={String(value.publisher ?? '')} onChange={(event) => update('publisher', event.target.value)} /></Field>
            <Field label="PRO / CMO"><input value={String(value.pro ?? '')} onChange={(event) => update('pro', event.target.value)} /></Field>
            <Field label="Neighbouring rights organization"><input value={String(value.neighbouringRights ?? '')} onChange={(event) => update('neighbouringRights', event.target.value)} /></Field>
            <Field label="Contexts you do not permit" hint="For example: political use, gambling, or unapproved brand association." full><textarea rows={3} maxLength={1000} value={String(value.prohibitedContexts ?? '')} onChange={(event) => update('prohibitedContexts', event.target.value)} /></Field>
            <Field label="Contact preferences" full><textarea rows={2} maxLength={500} value={String(value.contactPreferences ?? '')} placeholder="Preferred route, timing, or public contact details. Do not enter passwords." onChange={(event) => update('contactPreferences', event.target.value)} /></Field>
        </>}
        {editor.kind === 'releases' && <>
            <Field label="Release title" required><input autoFocus maxLength={120} value={String(value.title ?? '')} onChange={(event) => update('title', event.target.value)} /></Field>
            <Field label="Version / mix"><input maxLength={80} placeholder="Radio edit, remaster…" value={String(value.version ?? '')} onChange={(event) => update('version', event.target.value)} /></Field>
            <Field label="Release type" required><select value={String(value.releaseType ?? 'Single')} onChange={(event) => update('releaseType', event.target.value)}>{['Single', 'EP', 'Album', 'Other'].map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Genre" required><input maxLength={100} value={String(value.genre ?? '')} onChange={(event) => update('genre', event.target.value)} /></Field>
            <Field label="Language" required><input maxLength={60} value={String(value.language ?? '')} onChange={(event) => update('language', event.target.value)} /></Field>
            <Field label="Release date" required><input type="date" value={String(value.releaseDate ?? '')} onChange={(event) => update('releaseDate', event.target.value)} /></Field>
            <Field label="Permitted promotion territories" hint="Must be within your artist profile territories. Comma-separated ISO country codes." required><input value={String(value.territories ?? '')} placeholder="NL, BE" onChange={(event) => update('territories', event.target.value.toUpperCase())} /></Field>
            <Field label="ISRC"><input maxLength={12} value={String(value.isrc ?? '')} placeholder="If assigned" onChange={(event) => update('isrc', event.target.value.toUpperCase())} /></Field>
            <Field label="ISWC"><input maxLength={30} value={String(value.iswc ?? '')} placeholder="If assigned" onChange={(event) => update('iswc', event.target.value.toUpperCase())} /></Field>
            <Field label="UPC / EAN"><input maxLength={14} value={String(value.upc ?? '')} onChange={(event) => update('upc', event.target.value)} /></Field>
            <Field label="Public release link"><input type="url" placeholder="https://" value={String(value.publicLink ?? '')} onChange={(event) => update('publicLink', event.target.value)} /></Field>
            <Field label="Contributors and roles" full><textarea rows={3} maxLength={1500} placeholder="Writers, performers, producer, engineer, label…" value={String(value.contributors ?? '')} onChange={(event) => update('contributors', event.target.value)} /></Field>
            <Field label="Rights claim or ownership notes" full><textarea rows={3} maxLength={1000} placeholder="Record who claims what, and any limits or disputed shares." value={String(value.ownershipNote ?? '')} onChange={(event) => update('ownershipNote', event.target.value)} /></Field>
            <Field label="Sample / interpolation clearance status" full><textarea rows={2} maxLength={500} placeholder="Not reviewed, cleared (include evidence source), or not applicable." value={String(value.sampleClearance ?? '')} onChange={(event) => update('sampleClearance', event.target.value)} /></Field>
            <Field label="Permitted uses" full><textarea rows={2} maxLength={1000} placeholder="Any usage, association, territory, or media limitations." value={String(value.permittedUses ?? '')} onChange={(event) => update('permittedUses', event.target.value)} /></Field>
            <Field label="Rights evidence reference" full><textarea rows={2} maxLength={1000} placeholder="Where the supporting documents are held. Do not upload confidential contracts here." value={String(value.rightsEvidenceNote ?? '')} onChange={(event) => update('rightsEvidenceNote', event.target.value)} /></Field>
            <label className="check-field field-span"><input type="checkbox" checked={Boolean(value.artistAuthorityConfirmed)} onChange={(event) => update('artistAuthorityConfirmed', event.target.checked)} /><span><strong>I confirm I have authority to promote this recording</strong><small>This is your confirmation, not independent rights verification or a transfer of ownership.</small></span></label>
        </>}
        {editor.kind === 'campaigns' && <>
            <Field label="Campaign name" required><input autoFocus maxLength={120} value={String(value.title ?? '')} onChange={(event) => update('title', event.target.value)} /></Field>
            <Field label="Release" required><select value={String(value.releaseId ?? '')} onChange={(event) => update('releaseId', event.target.value)}><option value="">Choose a release</option>{props.releases.filter((release) => !release.archived).map((release) => <option value={release.id} key={release.id}>{release.title}</option>)}</select></Field>
            <Field label="Promotion objective" required full><textarea maxLength={300} rows={2} placeholder="A specific result you want to work toward; do not write a guaranteed outcome." value={String(value.objective ?? '')} onChange={(event) => update('objective', event.target.value)} /></Field>
            <Field label="Start date" required><input type="date" value={String(value.startDate ?? '')} onChange={(event) => update('startDate', event.target.value)} /></Field>
            <Field label="End date" required><input type="date" value={String(value.endDate ?? '')} onChange={(event) => update('endDate', event.target.value)} /></Field>
            <Field label="Channels" hint="Comma-separated: Editorial, Radio, Press, Podcast, Creator, Sync, Community, Direct-to-fan." required full><input value={String(value.channels ?? '')} placeholder="Press, Radio, Podcast" onChange={(event) => update('channels', event.target.value.split(',').map((item) => item.trim()).filter(Boolean).join(', '))} /></Field>
            <Field label="Territories" hint="Comma-separated ISO country codes, within your profile and release permissions." required><input value={String(value.territories ?? '')} placeholder="NL, BE" onChange={(event) => update('territories', event.target.value.toUpperCase())} /></Field>
            <Field label="Languages" hint="Comma-separated, within your artist profile." required><input value={String(value.languages ?? '')} placeholder="English, Dutch" onChange={(event) => update('languages', event.target.value)} /></Field>
            <Field label="Budget cap (tracking only)" required><input type="number" min="0" max="1000000" step="0.01" value={String(value.budgetCap ?? 0)} onChange={(event) => update('budgetCap', event.target.value)} /></Field>
            <Field label="Budget currency" required><input maxLength={3} value={String(value.budgetCurrency ?? 'EUR')} onChange={(event) => update('budgetCurrency', event.target.value.toUpperCase())} /></Field>
            <Field label="Activity target (optional)" hint="A planning target, not guaranteed activity or outcome." ><input type="number" min="0" max="10000" step="1" value={fieldValue(value.actionTarget ?? '')} onChange={(event) => update('actionTarget', event.target.value)} /></Field>
            <Field label="Campaign copy or approved material" hint="Optional. Keep claims factual and use only material you have permission to share." full><textarea rows={4} maxLength={1500} placeholder="Write copy from verified artist and release facts. Do not invent listener numbers, reviews, placements, endorsements, or achievements." value={String(value.pitchDraft ?? '')} onChange={(event) => update('pitchDraft', event.target.value)} /></Field>
            <label className="check-field field-span"><input type="checkbox" checked={Boolean(value.pitchApproved)} onChange={(event) => update('pitchApproved', event.target.checked)} /><span><strong>I reviewed this material for accurate facts and rights</strong><small>Approval records your review only; NOTE does not independently verify claims or send the material.</small></span></label>
            <Field label="Excluded contexts and actions" hint="Required. Include unsafe, unlicensed, paid, or unwanted placements." full><textarea rows={3} maxLength={1200} required value={String(value.exclusions ?? '')} onChange={(event) => update('exclusions', event.target.value)} /></Field>
            <div className="field-callout field-span"><ShieldCheck size={15} /><span>Campaign activation is a status only. You must review any spend, fee, agreement, license, exclusivity, rights transfer, or revenue share separately before agreeing.</span></div>
        </>}
        {editor.kind === 'leads' && <>
            <Field label="Outlet / opportunity" required><input autoFocus maxLength={140} value={String(value.name ?? '')} onChange={(event) => update('name', event.target.value)} /></Field>
            <Field label="Channel" required><select value={String(value.channel ?? 'Editorial')} onChange={(event) => update('channel', event.target.value)}>{channels.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Public page or current rules" required full><input type="url" placeholder="https://" value={String(value.publicUrl ?? '')} onChange={(event) => update('publicUrl', event.target.value)} /></Field>
            <Field label="Territory" hint="ISO country code if relevant"><input maxLength={2} placeholder="NL" value={String(value.territory ?? '')} onChange={(event) => update('territory', event.target.value.toUpperCase())} /></Field>
            <Field label="Submission route"><input maxLength={120} placeholder="Public form, email listed on site…" value={String(value.contactRoute ?? '')} onChange={(event) => update('contactRoute', event.target.value)} /></Field>
            <Field label="Why this opportunity fits" required full><textarea rows={3} maxLength={1000} value={String(value.fitReason ?? '')} onChange={(event) => update('fitReason', event.target.value)} /></Field>
            <Field label="Rules and submission requirements" full><textarea rows={2} maxLength={1000} value={String(value.requirements ?? '')} onChange={(event) => update('requirements', event.target.value)} /></Field>
            <Field label="Fee disclosure" hint="Record free, amount and currency, or not stated." full><input maxLength={500} value={String(value.feeDisclosure ?? '')} onChange={(event) => update('feeDisclosure', event.target.value)} /></Field>
            <label className="check-field field-span"><input type="checkbox" checked={Boolean(value.contactReviewed)} onChange={(event) => update('contactReviewed', event.target.checked)} /><span><strong>I checked the current rules and contact route</strong><small>Review again before each submission. Do not bypass auth, CAPTCHA, anti-automation, or platform limits.</small></span></label>
        </>}
        {editor.kind === 'actions' && <>
            <Field label="Campaign" required><select value={String(value.campaignId ?? '')} onChange={(event) => update('campaignId', event.target.value)}><option value="">Choose a campaign</option>{props.campaigns.map((campaign) => <option value={campaign.id} key={campaign.id}>{campaign.title}</option>)}</select></Field>
            <Field label="Opportunity" required><select value={String(value.leadId ?? '')} onChange={(event) => update('leadId', event.target.value)}><option value="">Choose an opportunity</option>{props.leads.filter((lead) => !lead.suppressed).map((lead) => <option value={lead.id} key={lead.id}>{lead.name}</option>)}</select></Field>
            <Field label="What happened?" required><select value={String(value.eventType ?? 'Researched')} onChange={(event) => update('eventType', event.target.value)}>{activityTypes.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Date" required><input type="date" value={String(value.occurredOn ?? '')} onChange={(event) => update('occurredOn', event.target.value)} /></Field>
            <Field label="Notes" full><textarea rows={3} maxLength={1200} placeholder="Record facts, not inferred results." value={String(value.notes ?? '')} onChange={(event) => update('notes', event.target.value)} /></Field>
            <Field label="Public evidence link" full><input type="url" placeholder="https://" value={String(value.evidenceUrl ?? '')} onChange={(event) => update('evidenceUrl', event.target.value)} /></Field>
        </>}
        {editor.kind === 'royalties' && <>
            <Field label="Release" required><select value={String(value.releaseId ?? '')} onChange={(event) => update('releaseId', event.target.value)}><option value="">Choose a release</option>{props.releases.map((release) => <option value={release.id} key={release.id}>{release.title}</option>)}</select></Field>
            <Field label="Income category" required><select value={String(value.category ?? royaltyCategories[0])} onChange={(event) => update('category', event.target.value)}>{royaltyCategories.map((option) => <option key={option}>{option}</option>)}</select></Field>
            <Field label="Payer / source" required><input maxLength={120} placeholder="Distributor, publisher, PRO…" value={String(value.source ?? '')} onChange={(event) => update('source', event.target.value)} /></Field>
            <Field label="Reporting period" required><input maxLength={30} placeholder="2026 Q1" value={String(value.reportingPeriod ?? '')} onChange={(event) => update('reportingPeriod', event.target.value)} /></Field>
            <Field label="Statement date" required><input type="date" value={String(value.statementDate ?? '')} onChange={(event) => update('statementDate', event.target.value)} /></Field>
            <Field label="Amount" hint="Negative lines can represent a reversal or recoupment." required><input type="number" min="-100000000" max="100000000" step="0.01" value={String(value.amount ?? 0)} onChange={(event) => update('amount', event.target.value)} /></Field>
            <Field label="Currency (ISO 4217)" required><input maxLength={3} placeholder="EUR" value={String(value.currency ?? 'EUR')} onChange={(event) => update('currency', event.target.value.toUpperCase())} /></Field>
            <Field label="Statement reference"><input maxLength={120} value={String(value.statementReference ?? '')} placeholder="File, invoice, or reference number" onChange={(event) => update('statementReference', event.target.value)} /></Field>
            <Field label="Source provenance" required><select value={String(value.provenance ?? 'Artist-entered')} onChange={(event) => update('provenance', event.target.value)}><option>Artist-entered</option><option>Imported artist statement</option></select></Field>
            {selectedRelease && <div className="field-callout field-span"><Banknote size={15} /><span>{selectedRelease.title}: this remains an artist-entered or artist-imported record. NOTE does not validate the payer or confirm that funds were paid.</span></div>}
        </>}
    </div><footer className="editor-footer"><span><ShieldCheck size={13} /> Saved in your private NOTE workspace</span><div><button type="button" className="button button-outline" onClick={props.onClose}>Cancel</button><button type="submit" className="button button-dark" disabled={props.busy}>{props.busy ? <LoaderCircle size={15} className="spin" /> : <Check size={15} />}{props.busy ? 'Saving…' : 'Save record'}</button></div></footer></form></section></div>;
}
