import { Activity as ActivityIcon, ArrowUpRight, BadgeCheck, ClipboardCheck, X } from 'lucide-react';
import type { Activity, Campaign, Lead } from '../types';
import { activityOutcomeLabels } from '../helpers';
import { EmptyState, InfoCard, LoadMore } from './SharedUi';
import { PageHeader } from './SharedUi';

export function ActivityPage(props: {
    actions: Activity[]; campaigns: Campaign[]; leads: Lead[]; query: string; onAdd: () => void;
    onEdit: (item: Activity) => void; onDelete: (item: Activity) => void; onLoadMore: () => void; hasMore: boolean;
}) {
    const items = props.actions.filter((action) => {
        const campaign = props.campaigns.find((item) => item.id === action.campaignId)?.title ?? '';
        const lead = props.leads.find((item) => item.id === action.leadId)?.name ?? '';
        return !props.query || `${action.eventType} ${action.notes} ${campaign} ${lead}`.toLowerCase().includes(props.query);
    }).sort((a, b) => b.occurredOn.localeCompare(a.occurredOn));
    return <>
        <PageHeader kicker="TRACK WHAT ACTUALLY HAPPENED" title="Activity log" description="Separate research and preparation from messages sent, responses, placements, and releases published." action={props.onAdd} actionText="Log activity" />
        <div className="activity-definition"><div className="definition-mark"><ClipboardCheck size={17} /></div><div><strong>Qualified activity should be verifiable.</strong><span>Use evidence links and accurate event labels. A logged task is not proof of a placement, stream, listener, or financial result.</span></div></div>
        <section className="panel data-panel"><div className="table-top"><div><div className="panel-kicker">YOUR ACTIVITY RECORDS</div><h2>{items.length} logged item{items.length === 1 ? '' : 's'}</h2></div><div className="activity-legend"><span><i className="legend-work" /> Work</span><span><i className="legend-outcome" /> Outcome</span></div></div>
            {items.length ? <div className="activity-table">{items.map((action) => {
                const campaign = props.campaigns.find((item) => item.id === action.campaignId);
                const lead = props.leads.find((item) => item.id === action.leadId);
                const outcome = ['Response', 'Accepted', 'Published', 'Declined'].includes(action.eventType);
                return <div className="activity-row" key={action.id}><div className={`activity-date ${outcome ? 'date-outcome' : ''}`}><span>{new Date(`${action.occurredOn}T12:00:00`).toLocaleDateString(undefined, { month: 'short' })}</span><strong>{new Date(`${action.occurredOn}T12:00:00`).getDate()}</strong></div><div className={`activity-type-icon ${outcome ? 'activity-outcome-icon' : ''}`}>{outcome ? <BadgeCheck size={17} /> : <ActivityIcon size={16} />}</div><div className="activity-copy"><div><strong>{activityOutcomeLabels[action.eventType] || action.eventType}</strong><span className={`activity-kind ${outcome ? 'kind-outcome' : ''}`}>{outcome ? 'OUTCOME' : 'WORK'}</span></div><p>{lead?.name || 'Opportunity'} · {campaign?.title || 'Campaign'}{action.notes ? ` — ${action.notes}` : ''}</p>{action.evidenceUrl && <a href={action.evidenceUrl} target="_blank" rel="noreferrer">View evidence <ArrowUpRight size={12} /></a>}</div><div className="activity-actions"><button type="button" className="button button-small button-outline" onClick={() => props.onEdit(action)}>Edit</button><button type="button" className="icon-button" aria-label="Delete activity record" onClick={() => props.onDelete(action)}><X size={15} /></button></div></div>;
            })}</div> : <EmptyState icon={<ClipboardCheck size={19} />} title={props.query ? 'No activity matches your search' : 'No activity has been logged yet'} detail="Record a researched opportunity, prepared material, artist-sent outreach, response, or published result." action="Log activity" onClick={props.onAdd} />}
            {props.hasMore && <LoadMore busy={false} onClick={props.onLoadMore} />}
        </section>
        <div className="info-grid two"><InfoCard icon={<ActivityIcon size={17} />} title="Work records" text="Research, preparation, artist-sent messages, and follow-up describe what you did." /><InfoCard icon={<BadgeCheck size={17} />} title="Outcome records" text="Responses, accepted submissions, published coverage, and declines describe what happened next." /></div>
    </>;
}
