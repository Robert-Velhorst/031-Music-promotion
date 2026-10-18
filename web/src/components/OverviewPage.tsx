import type { ReactNode } from 'react';
import { Activity as ActivityIcon, ArrowUpRight, AudioLines, Banknote, BadgeCheck, CalendarDays, CircleHelp, ClipboardCheck, FileAudio2, Globe2, Music2, Plus, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { Activity, Campaign, Lead, Profile, Release, Royalty } from '../types';
import type { Section } from '../helpers';
import { activityOutcomeLabels, currency, today } from '../helpers';
import { EmptyState } from './SharedUi';

export function OverviewPage(props: {
    profile: Profile | null;
    releases: Release[];
    campaigns: Campaign[];
    leads: Lead[];
    royalties: Royalty[];
    actions: Activity[];
    currencies: string[];
    profileComplete: boolean;
    onNavigate: (section: Section) => void;
    onCreateProfile: () => void;
    onCreateRelease: () => void;
    onCreateCampaign: () => void;
}) {
    const { profile, releases, campaigns, leads, royalties, actions, currencies, profileComplete, onNavigate } = props;
    const currentRelease = releases.find((release) => release.releaseDate >= today()) ?? releases[0];
    const live = campaigns.filter((campaign) => campaign.status === 'Active').length;
    const opted = leads.filter((lead) => !lead.suppressed).length;
    const welcomeName = profile?.artistName?.split(' ')[0] || 'producer';
    const actionBreakdown = actions.reduce<Record<string, number>>((total, action) => {
        total[action.eventType] = (total[action.eventType] ?? 0) + 1;
        return total;
    }, {});
    return (
        <>
            <div className="page-heading overview-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR MUSIC, YOUR MOVES</div><h1>Good to see you, {welcomeName}.</h1><p>Keep the work moving, one intentional step at a time.</p></div><div className="heading-date"><CalendarDays size={15} /> {new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}</div></div>
            {!profileComplete && <div className="setup-callout"><div className="setup-symbol"><CircleHelp size={17} /></div><div className="setup-copy"><strong>Start with your artist profile</strong><span>Set your territories, languages, and contact preferences so campaigns can stay within your boundaries.</span></div><button type="button" className="button button-small button-outline" onClick={props.onCreateProfile}>Set up profile <ArrowUpRight size={14} /></button></div>}
            <div className="dashboard-grid">
                <section className="dashboard-main">
                    <div className="metrics-grid">
                        <MetricCard title="In your catalog" value={String(releases.length).padStart(2, '0')} foot="releases in your Song Passport" icon={<Music2 size={16} />} tone="coral" />
                        <MetricCard title="In motion" value={String(live).padStart(2, '0')} foot="artist-run campaigns marked active" icon={<ActivityIcon size={16} />} tone="sage" />
                        <MetricCard title="On your radar" value={String(opted).padStart(2, '0')} foot="opportunities not suppressed" icon={<Globe2 size={16} />} tone="lavender" />
                        <MetricCard title="Logged" value={String(actions.length).padStart(2, '0')} foot="activity records, not outcome guarantees" icon={<ClipboardCheck size={16} />} tone="sand" />
                    </div>
                    <section className="panel next-panel">
                        <div className="section-title-row"><div><div className="panel-kicker">A CLEAR NEXT STEP</div><h2>Pick up where you left off</h2></div><button className="text-action" type="button" onClick={() => onNavigate('Campaigns')}>Your plan <ArrowUpRight size={14} /></button></div>
                        <div className="next-step-list">
                            {!profileComplete && <NextStep icon={<SlidersHorizontal size={16} />} color="coral" title="Set your artist boundaries" detail="Tell NOTE where and how you want to promote." action="Create profile" onClick={props.onCreateProfile} />}
                            {!currentRelease && <NextStep icon={<FileAudio2 size={16} />} color="lavender" title="Build your first Song Passport" detail="Keep the rights, collaborators, and release details together." action="Add a release" onClick={props.onCreateRelease} />}
                            {profileComplete && currentRelease && campaigns.length === 0 && <NextStep icon={<CalendarDays size={16} />} color="sage" title="Shape a campaign around your release" detail="Set a time window, channels, territories, and exclusions." action="Plan campaign" onClick={props.onCreateCampaign} />}
                            {campaigns.length > 0 && <NextStep icon={<CalendarDays size={16} />} color="sage" title={currentRelease ? `Plan promotion for ${currentRelease.title}` : 'Review your campaign plan'} detail="Choose opportunities and log only the work you actually do." action="View campaigns" onClick={() => onNavigate('Campaigns')} />}
                            {releases.length > 0 && leads.length === 0 && <NextStep icon={<Search size={16} />} color="sand" title="Keep a vetted opportunity list" detail="Track public submission rules, fees, fit, and your contact decisions." action="Add an opportunity" onClick={() => onNavigate('Opportunities')} />}
                            {profileComplete && currentRelease && campaigns.length > 0 && leads.length > 0 && <NextStep icon={<ClipboardCheck size={16} />} color="lavender" title="Keep a record of work completed" detail="Log researched, prepared, artist-sent, and reported outcomes separately." action="Open activity log" onClick={() => onNavigate('Activity log')} />}
                        </div>
                    </section>
                    <section className="panel recent-panel">
                        <div className="section-title-row"><div><div className="panel-kicker">YOUR WORK HISTORY</div><h2>Recent activity</h2></div><button className="text-action" type="button" onClick={() => onNavigate('Activity log')}>Full activity log <ArrowUpRight size={14} /></button></div>
                        {actions.length ? <div className="recent-activity-list">{actions.slice(0, 4).map((action) => <RecentActivity key={action.id} action={action} campaigns={campaigns} leads={leads} />)}</div> : <EmptyState icon={<ClipboardCheck size={19} />} title="Your activity history starts here" detail="Log research, preparation, outreach you send, and the outcome as it happens." action="Open activity log" onClick={() => onNavigate('Activity log')} />}
                    </section>
                </section>
                <aside className="dashboard-aside">
                    <section className="panel focus-panel"><div className="focus-top"><div className="focus-icon"><AudioLines size={17} /></div><div><span>IN FOCUS</span><strong>{currentRelease?.title || 'Your release'}</strong></div><span className="focus-wave"><i /><i /><i /><i /><i /></span></div>{currentRelease ? <><div className="focus-release-meta"><span>{currentRelease.releaseType}{currentRelease.version ? ` · ${currentRelease.version}` : ''}</span><span>{currentRelease.releaseDate || 'Release date not set'}</span></div><div className="focus-line"><span>Rights authority</span><strong>{currentRelease.artistAuthorityConfirmed ? <><BadgeCheck size={13} /> Confirmed by you</> : <><CircleHelp size={13} /> Needs your review</>}</strong></div><div className="focus-note"><ShieldCheck size={14} /><span>A release identifier helps identify a recording. It does not prove who owns the rights.</span></div><button type="button" className="button button-outline button-block" onClick={() => onNavigate('Song Passport')}>Open Song Passport <ArrowUpRight size={14} /></button></> : <><p className="focus-empty">Your catalog is the source for every promotion plan.</p><button type="button" className="button button-dark button-block" onClick={props.onCreateRelease}><Plus size={15} /> Add your first release</button></>}</section>
                    <section className="panel income-panel"><div className="section-title-row compact"><div><div className="panel-kicker">INCOME YOU TRACKED</div><h2>Statement ledger</h2></div><div className="money-icon"><Banknote size={16} /></div></div>{royalties.length ? <><div className="income-lines">{currencies.slice(0, 2).map((code) => <div className="income-row" key={code}><span>{code} loaded</span><strong>{currency(royalties.filter((row) => row.currency === code).reduce((sum, row) => sum + row.amount, 0), code)}</strong></div>)}</div><p className="tiny-disclaimer">Loaded lines only. Open Earnings and load more to see a larger ledger; amounts are not verified payable revenue.</p><button type="button" className="text-action" onClick={() => onNavigate('Earnings')}>Open earnings ledger <ArrowUpRight size={14} /></button></> : <><p className="focus-empty">Keep statement lines together across the sources that pay your music career.</p><button type="button" className="text-action" onClick={() => onNavigate('Earnings')}>Set up earnings tracking <ArrowUpRight size={14} /></button></>}</section>
                    <section className="panel outcomes-panel"><div className="panel-kicker">ACTIVITY, KEPT HONEST</div><h2>Different work, different outcomes.</h2><div className="outcome-chip-row">{Object.entries(actionBreakdown).slice(0, 4).map(([type, count]) => <span key={type} className="outcome-chip"><i />{activityOutcomeLabels[type] || type}<b>{count}</b></span>)}</div><p>Work you log is not the same thing as a placement, audience, stream, or income result.</p></section>
                </aside>
            </div>
        </>
    );
}

function MetricCard({ title, value, foot, icon, tone }: { title: string; value: string; foot: string; icon: ReactNode; tone: string }) {
    return <div className="metric-card"><div className={`metric-icon tone-${tone}`}>{icon}</div><div className="metric-label">{title}</div><div className="metric-value">{value}</div><div className="metric-foot">{foot}</div><div className="metric-spark" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div></div>;
}

function NextStep({ icon, color, title, detail, action, onClick }: { icon: ReactNode; color: string; title: string; detail: string; action: string; onClick: () => void }) {
    return <div className="next-step"><div className={`next-step-icon tone-${color}`}>{icon}</div><div className="next-step-copy"><strong>{title}</strong><span>{detail}</span></div><button type="button" onClick={onClick}>{action}<ArrowUpRight size={13} /></button></div>;
}

function RecentActivity({ action, campaigns, leads }: { action: Activity; campaigns: Campaign[]; leads: Lead[] }) {
    const campaign = campaigns.find((entry) => entry.id === action.campaignId);
    const lead = leads.find((entry) => entry.id === action.leadId);
    return <div className="recent-activity"><div className="timeline-dot"><ActivityIcon size={13} /></div><div className="recent-activity-copy"><strong>{activityOutcomeLabels[action.eventType] || action.eventType}{lead ? ` · ${lead.name}` : ''}</strong><span>{campaign?.title || 'Campaign'}{action.notes ? ` — ${action.notes}` : ''}</span></div><time>{action.occurredOn}</time></div>;
}
