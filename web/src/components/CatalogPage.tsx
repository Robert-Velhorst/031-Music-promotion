import { Archive, BadgeCheck, CircleHelp, FileAudio2, Music2, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { Profile, Release } from '../types';
import { EmptyState, InfoCard, LoadMore } from './SharedUi';
import { PageHeader } from './SharedUi';

export function CatalogPage(props: {
    releases: Release[]; profile: Profile | null; query: string; onAdd: () => void; onEdit: (item: Release) => void;
    onArchive: (item: Release) => void; busyAction: string; onLoadMore: () => void; hasMore: boolean;
}) {
    const items = props.releases.filter((item) => !props.query || `${item.title} ${item.genre} ${item.isrc} ${item.releaseType}`.toLowerCase().includes(props.query));
    return <>
        <PageHeader kicker="PROMOTE WITH RIGHTS IN VIEW" title="Song Passport" description="Your release details, collaborators, rights notes, and permitted territory in one place." action={props.onAdd} actionText="Add release" />
        <div className="rights-banner"><ShieldCheck size={18} /><div><strong>Keep evidence and rights status distinct.</strong><span>A title, ISRC, ISWC, UPC, or note is not proof of ownership. Record claims, clearances, and evidence in their proper context.</span></div><span className="rights-tag">ARTIST CONTROL</span></div>
        {!props.profile && <div className="inline-alert"><CircleHelp size={16} /> Create your artist profile and permitted territories before adding releases.</div>}
        <section className="panel data-panel"><div className="table-top"><div><div className="panel-kicker">YOUR CATALOG</div><h2>{items.length} release{items.length === 1 ? '' : 's'}</h2></div><label className="table-search"><Search size={15} /><input placeholder="Filter catalog" aria-label="Filter catalog" value={props.query} readOnly /></label></div>
            {items.length ? <div className="table-scroll"><table><thead><tr><th>RELEASE</th><th>FORMAT</th><th>RELEASE DATE</th><th>IDENTIFIER</th><th>RIGHTS REVIEW</th><th /></tr></thead><tbody>{items.map((release) => <tr key={release.id}><td><div className="table-primary"><span className="release-cover"><Music2 size={16} /></span><span><strong>{release.title || 'Untitled release'}</strong><small>{release.genre || 'Genre not set'}{release.version ? ` · ${release.version}` : ''}</small></span></div></td><td>{release.releaseType}</td><td>{release.releaseDate || '—'}</td><td><span className="mono-value">{release.isrc || 'No ISRC'}</span></td><td><span className={`status-pill ${release.artistAuthorityConfirmed ? 'status-good' : 'status-pending'}`}><i />{release.archived ? 'Archived' : release.artistAuthorityConfirmed ? 'Authority confirmed' : 'Review needed'}</span></td><td><div className="row-actions"><button type="button" className="button button-small button-outline" onClick={() => props.onEdit(release)}>Open</button>{!release.archived && <button type="button" className="icon-button" title="Archive release" aria-label={`Archive ${release.title}`} onClick={() => props.onArchive(release)} disabled={props.busyAction === `archive-${release.id}`}><Archive size={15} /></button>}</div></td></tr>)}</tbody></table></div> : <EmptyState icon={<FileAudio2 size={20} />} title={props.query ? 'No releases match your search' : 'Your catalog is ready for its first release'} detail="Add the recording details and rights notes you want beside every promotion plan." action="Add a release" onClick={props.onAdd} />}
            {props.hasMore && <LoadMore busy={props.busyAction === 'page-releases'} onClick={props.onLoadMore} />}
        </section>
        <div className="info-grid two"><InfoCard icon={<BadgeCheck size={17} />} title="What this passport keeps" text="Release metadata, contributors, identifiers, territory choices, clearance notes, and public reference links." /><InfoCard icon={<ShieldAlert size={17} />} title="What it does not verify" text="NOTE does not verify ownership, clear samples, or certify the authority of any contributor. Keep source evidence with the rightsholder." /></div>
    </>;
}
