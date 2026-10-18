import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, AudioLines, CalendarDays, Check, ChevronDown, CircleHelp, ClipboardCheck, FileAudio2, LayoutDashboard, LoaderCircle, LogOut, Menu, Search, Settings2, ShieldAlert, WalletCards, X } from 'lucide-react';
import { auth, client } from './client';
import { emptyActivity, emptyCampaign, emptyLead, emptyProfile, emptyRelease, emptyRoyalty, type Activity, type Campaign, type Lead, type PageKind, type RecordKind, type Release, type Workspace } from './types';
import { asRecord, blankWorkspace, commaList, friendlyError, initials, kindLabels, normalizeList, today, type EditorKind, type EditorState, type Section } from './helpers';
import { ActivityPage } from './components/ActivityPage';
import { CampaignsPage } from './components/CampaignsPage';
import { CatalogPage } from './components/CatalogPage';
import { EditorModal } from './components/EditorModal';
import { EarningsPage } from './components/EarningsPage';
import { OpportunitiesPage } from './components/OpportunitiesPage';
import { OverviewPage } from './components/OverviewPage';
import { SettingsPage } from './components/SettingsPage';
import { LoadingScreen, WelcomeScreen } from './components/WelcomeScreen';
import './index.css';

type ToastState = { message: string; kind: 'success' | 'error' } | null;

const sections: Array<{ name: Section; icon: typeof LayoutDashboard; group: string }> = [
    { name: 'Overview', icon: LayoutDashboard, group: 'WORKSPACE' },
    { name: 'Song Passport', icon: FileAudio2, group: 'PROMOTE' },
    { name: 'Campaigns', icon: CalendarDays, group: 'PROMOTE' },
    { name: 'Opportunities', icon: Search, group: 'PROMOTE' },
    { name: 'Activity log', icon: ClipboardCheck, group: 'PROMOTE' },
    { name: 'Earnings', icon: WalletCards, group: 'CAREER' },
    { name: 'Settings', icon: Settings2, group: 'WORKSPACE' },
];

function App() {
    const [user, setUser] = useState<{ userId: string; name?: string; email?: string } | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const [section, setSection] = useState<Section>('Overview');
    const [workspace, setWorkspace] = useState<Workspace>(blankWorkspace);
    const [editor, setEditor] = useState<EditorState | null>(null);
    const [toast, setToast] = useState<ToastState>(null);
    const [query, setQuery] = useState('');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [busyAction, setBusyAction] = useState('');
    const [exportStatus, setExportStatus] = useState('');
    const [deleteStatus, setDeleteStatus] = useState('');
    const toastTimer = useRef<number | null>(null);
    const searchInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let active = true;
        const loadUser = async () => {
            try {
                const currentUser = await auth.getUser();
                if (active) setUser(currentUser);
            } catch {
                if (active) setUser(null);
            } finally {
                if (active) setAuthReady(true);
            }
        };
        void loadUser();
        return () => {
            active = false;
            if (toastTimer.current) window.clearTimeout(toastTimer.current);
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        let active = true;
        setLoading(true);
        client.workspace()
            .then((data) => { if (active) setWorkspace(data); })
            .catch((error) => { if (active) notify(friendlyError(error), 'error'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [user?.userId]);

    useEffect(() => {
        if (!toast) return;
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 5200);
        return () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); };
    }, [toast]);

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                searchInput.current?.focus();
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    function notify(message: string, kind: 'success' | 'error' = 'success') {
        setToast({ message, kind });
    }

    async function signIn() {
        setSigningIn(true);
        try {
            const result = await auth.signIn();
            setUser(result.user);
        } catch (cause) {
            const code = (cause as { code?: string }).code;
            notify(code === 'popup_blocked' ? 'Allow the sign-in popup in your browser, then try again.' : code === 'popup_closed' ? 'Sign-in was cancelled.' : friendlyError(cause), 'error');
        } finally {
            setSigningIn(false);
        }
    }

    async function refreshWorkspace() {
        setLoading(true);
        try {
            setWorkspace(await client.workspace());
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setLoading(false);
        }
    }

    function openEditor(kind: EditorKind, value?: object, id?: string) {
        if (value) {
            const prepared = asRecord(value);
            if ('territories' in prepared) prepared.territories = commaList(prepared.territories);
            if ('languages' in prepared) prepared.languages = commaList(prepared.languages);
            if ('channels' in prepared) prepared.channels = commaList(prepared.channels);
            setEditor({ kind, id, value: prepared });
            return;
        }
        const initial: object = kind === 'profile' ? emptyProfile
            : kind === 'releases' ? emptyRelease
                : kind === 'campaigns' ? emptyCampaign
                    : kind === 'leads' ? emptyLead
                        : kind === 'actions' ? { ...emptyActivity, occurredOn: today() }
                            : emptyRoyalty;
        const prepared = asRecord(initial);
        if ('territories' in prepared) prepared.territories = commaList(prepared.territories);
        if ('languages' in prepared) prepared.languages = commaList(prepared.languages);
        if ('channels' in prepared) prepared.channels = commaList(prepared.channels);
        setEditor({ kind, value: prepared });
    }

    async function saveEditor(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editor) return;
        if (editor.kind === 'campaigns' && String(editor.value.pitchDraft ?? '').trim() && editor.value.pitchApproved !== true) {
            notify('Review campaign copy and confirm its facts and rights before saving.', 'error');
            return;
        }
        setBusyAction('save');
        try {
            const payload = { ...editor.value };
            for (const key of ['territories', 'languages', 'channels']) {
                if (typeof payload[key] === 'string') payload[key] = normalizeList(payload[key] as string);
            }
            if (editor.kind === 'campaigns') {
                payload.budgetCap = Number(payload.budgetCap);
                payload.actionTarget = payload.actionTarget === '' || payload.actionTarget === null ? null : Number(payload.actionTarget);
            }
            if (editor.kind === 'royalties') payload.amount = Number(payload.amount);
            if (editor.kind === 'profile') {
                await client.saveProfile(payload);
            } else if (editor.id) {
                await client.update(editor.kind, editor.id, payload);
            } else {
                await client.create(editor.kind, payload);
            }
            setEditor(null);
            notify(`${editor.kind === 'profile' ? 'Artist profile' : `${editor.kind.slice(0, -1)} record`} saved.`);
            await refreshWorkspace();
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
        }
    }

    async function loadMore(kind: PageKind) {
        const nextToken = workspace.pages[kind];
        if (!nextToken) return;
        setBusyAction(`page-${kind}`);
        try {
            const page = await client.page(kind, nextToken);
            if (kind === 'profiles') return;
            const key = kind as RecordKind;
            setWorkspace((current) => ({
                ...current,
                [key]: [...current[key], ...page.items] as never,
                pages: { ...current.pages, [kind]: page.nextToken ?? null },
            }));
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
        }
    }

    async function changeCampaignStatus(campaign: Campaign, status: string) {
        if (!campaign.id) return;
        if (status === 'Active' && !window.confirm('Mark this campaign active? NOTE will not send messages or spend money. You will carry out all approved actions yourself.')) return;
        setBusyAction(`campaign-${campaign.id}`);
        try {
            await client.transition(campaign.id, status);
            notify(status === 'Active' ? 'Campaign marked active. Promotion remains artist-run.' : `Campaign marked ${status.toLowerCase()}.`);
            await refreshWorkspace();
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
        }
    }

    async function archiveRelease(release: Release) {
        if (!release.id || !window.confirm(`Archive “${release.title}”? It will remain in your history but will not be available for new campaigns.`)) return;
        setBusyAction(`archive-${release.id}`);
        try {
            await client.archiveRelease(release.id);
            notify('Release archived. Its history remains in NOTE.');
            await refreshWorkspace();
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
        }
    }

    async function suppressLead(lead: Lead) {
        if (!lead.id || lead.suppressed) return;
        const reason = window.prompt(`Add a short reason for permanently suppressing “${lead.name}”. This opportunity will be excluded from future NOTE workflows.`);
        if (!reason?.trim()) return;
        setBusyAction(`suppress-${lead.id}`);
        try {
            await client.suppress(lead.id, reason.trim());
            notify('Do not contact saved for this opportunity.');
            await refreshWorkspace();
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
        }
    }

    async function deleteActivity(activity: Activity) {
        if (!activity.id || !window.confirm('Remove this activity record? This cannot be undone.')) return;
        try {
            await client.remove('actions', activity.id);
            notify('Activity record removed.');
            await refreshWorkspace();
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        }
    }

    async function exportWorkspace() {
        setBusyAction('export');
        setExportStatus('Preparing your export…');
        try {
            const result = await client.exportPage();
            const data: Record<PageKind, Array<Record<string, unknown>>> = { ...result.data };
            const kinds: PageKind[] = ['profiles', 'releases', 'campaigns', 'leads', 'actions', 'royalties'];
            let remaining = kinds.reduce((count, kind) => count + (result.pages[kind] ? 1 : 0), 0);
            setExportStatus(`Collecting remaining pages (${remaining} collections)…`);
            for (const kind of kinds) {
                let token = result.pages[kind];
                while (token) {
                    const page = await client.page(kind, token);
                    if (kind !== 'profiles') data[kind].push(...page.items);
                    token = page.nextToken ?? null;
                }
                remaining -= 1;
                setExportStatus(`Collecting remaining pages (${Math.max(remaining, 0)} collections)…`);
            }
            const bundle = { product: result.product, exportedAt: result.exportedAt, data };
            const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `note-export-${today()}.json`;
            anchor.click();
            URL.revokeObjectURL(url);
            notify('Your complete NOTE workspace export is ready.');
        } catch (cause) {
            notify(friendlyError(cause), 'error');
        } finally {
            setBusyAction('');
            setExportStatus('');
        }
    }

    async function deleteWorkspaceData() {
        const confirmation = window.prompt('This permanently removes your NOTE profile, releases, campaigns, opportunity records, activity, and income records. Your sign-in account will remain. Type DELETE MY NOTE DATA to continue.');
        if (confirmation !== 'DELETE MY NOTE DATA') return;
        const order: PageKind[] = ['actions', 'royalties', 'campaigns', 'leads', 'releases', 'profiles'];
        setBusyAction('delete-data');
        try {
            let total = 0;
            for (const kind of order) {
                let response = await client.deletePage(kind, confirmation);
                total += response.deletedCount;
                setDeleteStatus(`Removing ${kindLabels[kind]} data…`);
                while (response.moreRecords) {
                    response = await client.deletePage(kind, confirmation);
                    total += response.deletedCount;
                }
            }
            setWorkspace(blankWorkspace());
            setSection('Overview');
            notify(`${total} NOTE record${total === 1 ? '' : 's'} permanently removed. Your sign-in account remains active.`);
        } catch (cause) {
            notify(`${friendlyError(cause)} ${deleteStatus ? 'Some records may already have been removed; you can retry the deletion.' : ''}`, 'error');
            await refreshWorkspace();
        } finally {
            setBusyAction('');
            setDeleteStatus('');
        }
    }

    const profile = workspace.profile;
    const visibleReleases = useMemo(() => workspace.releases.filter((release) => !release.archived), [workspace.releases]);
    const searchText = query.trim().toLowerCase();
    const allIncomeCurrencies = Array.from(new Set(workspace.royalties.map((row) => row.currency)));
    const profileComplete = Boolean(profile?.artistName && profile.genre && profile.territories.length && profile.languages.length);

    if (!authReady) return <LoadingScreen />;
    if (!user) return <WelcomeScreen onSignIn={signIn} signingIn={signingIn} />;

    return (
        <div className="app-shell">
            <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
                <div className="brand-row">
                    <div className="brand-mark"><AudioLines size={19} strokeWidth={2.4} /></div>
                    <div><div className="brand-name">NOTE</div><div className="brand-label">MUSIC PROMOTION</div></div>
                    <button className="icon-button nav-close" type="button" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}><X size={18} /></button>
                </div>
                <div className="artist-switcher">
                    <div className="artist-avatar">{initials(profile?.artistName || user.name || user.email || 'N')}</div>
                    <div className="artist-meta"><strong>{profile?.artistName || user.name || 'Your workspace'}</strong><span>Artist workspace</span></div>
                    <ChevronDown size={15} className="muted-icon" />
                </div>
                {['WORKSPACE', 'PROMOTE', 'CAREER'].map((group) => (
                    <div className="nav-group" key={group}>
                        <div className="nav-group-label">{group}</div>
                        {sections.filter((item) => item.group === group).map(({ name, icon: Icon }) => (
                            <button key={name} className={`nav-item ${section === name ? 'nav-item-active' : ''}`} type="button" onClick={() => { setSection(name); setMobileNavOpen(false); }}>
                                <Icon size={17} strokeWidth={1.9} /><span>{name}</span>
                                {name === 'Earnings' && workspace.royalties.length > 0 && <span className="nav-count">{workspace.royalties.length}</span>}
                            </button>
                        ))}
                    </div>
                ))}
                <div className="sidebar-bottom">
                    <div className="sidebar-helper"><div className="helper-icon"><CircleHelp size={16} /></div><div><strong>Need a hand?</strong><span>Make a clear next move.</span></div><ArrowUpRight size={14} /></div>
                    <button className="user-card" type="button" onClick={() => void auth.signOut().then(() => { setUser(null); setWorkspace(blankWorkspace()); })}>
                        <div className="user-avatar">{initials(user.name || user.email || 'A')}</div>
                        <div className="user-meta"><strong>{user.name || 'Signed in'}</strong><span>{user.email || 'Account'}</span></div>
                        <LogOut size={15} />
                    </button>
                </div>
            </aside>
            {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

            <main className="main-area">
                <header className="topbar">
                    <button className="icon-button menu-toggle" type="button" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
                    <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{section}</strong></div>
                    <div className="topbar-actions">
                        <label className="top-search"><Search size={16} /><input ref={searchInput} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your workspace" aria-label="Search your workspace" /><kbd>⌘ K</kbd></label>
                        <button className="top-avatar" type="button" aria-label="Open settings" onClick={() => setSection('Settings')}>{initials(profile?.artistName || user.name || user.email || 'N')}</button>
                    </div>
                </header>
                <div className="page-wrap">
                    {section === 'Overview' && <OverviewPage
                        profile={profile}
                        releases={visibleReleases}
                        campaigns={workspace.campaigns}
                        leads={workspace.leads}
                        royalties={workspace.royalties}
                        actions={workspace.actions}
                        currencies={allIncomeCurrencies}
                        profileComplete={profileComplete}
                        onNavigate={setSection}
                        onCreateProfile={() => openEditor('profile', profile ?? undefined, profile?.id)}
                        onCreateRelease={() => openEditor('releases')}
                        onCreateCampaign={() => openEditor('campaigns')}
                    />}
                    {section === 'Song Passport' && <CatalogPage
                        releases={workspace.releases}
                        profile={profile}
                        query={searchText}
                        onAdd={() => openEditor('releases')}
                        onEdit={(item) => openEditor('releases', item, item.id)}
                        onArchive={(item) => void archiveRelease(item)}
                        busyAction={busyAction}
                        onLoadMore={() => void loadMore('releases')}
                        hasMore={Boolean(workspace.pages.releases)}
                    />}
                    {section === 'Campaigns' && <CampaignsPage
                        campaigns={workspace.campaigns}
                        releases={workspace.releases}
                        profile={profile}
                        query={searchText}
                        onAdd={() => openEditor('campaigns')}
                        onEdit={(item) => openEditor('campaigns', item, item.id)}
                        onStatus={(item, status) => void changeCampaignStatus(item, status)}
                        busyAction={busyAction}
                        onLoadMore={() => void loadMore('campaigns')}
                        hasMore={Boolean(workspace.pages.campaigns)}
                    />}
                    {section === 'Opportunities' && <OpportunitiesPage
                        leads={workspace.leads}
                        query={searchText}
                        onAdd={() => openEditor('leads')}
                        onEdit={(item) => openEditor('leads', item, item.id)}
                        onSuppress={(item) => void suppressLead(item)}
                        busyAction={busyAction}
                        onLoadMore={() => void loadMore('leads')}
                        hasMore={Boolean(workspace.pages.leads)}
                    />}
                    {section === 'Activity log' && <ActivityPage
                        actions={workspace.actions}
                        campaigns={workspace.campaigns}
                        leads={workspace.leads}
                        query={searchText}
                        onAdd={() => openEditor('actions')}
                        onEdit={(item) => openEditor('actions', item, item.id)}
                        onDelete={(item) => void deleteActivity(item)}
                        onLoadMore={() => void loadMore('actions')}
                        hasMore={Boolean(workspace.pages.actions)}
                    />}
                    {section === 'Earnings' && <EarningsPage
                        royalties={workspace.royalties}
                        releases={workspace.releases}
                        currencies={allIncomeCurrencies}
                        query={searchText}
                        onAdd={() => openEditor('royalties')}
                        onEdit={(item) => openEditor('royalties', item, item.id)}
                        onImport={async (rows, statementRef) => {
                            const result = await client.importRoyalties(statementRef, rows);
                            await refreshWorkspace();
                            return result;
                        }}
                        notify={notify}
                        onLoadMore={() => void loadMore('royalties')}
                        hasMore={Boolean(workspace.pages.royalties)}
                    />}
                    {section === 'Settings' && <SettingsPage
                        profile={profile}
                        user={user}
                        onEditProfile={() => openEditor('profile', profile ?? undefined, profile?.id)}
                        onExport={() => void exportWorkspace()}
                        onDelete={() => void deleteWorkspaceData()}
                        busyAction={busyAction}
                        exportStatus={exportStatus}
                        deleteStatus={deleteStatus}
                    />}
                    <footer className="page-footer"><span>NOTE is an artist workspace. Your rights and choices stay visible.</span><button type="button" onClick={() => setSection('Settings')}>Privacy & data <ArrowUpRight size={12} /></button></footer>
                </div>
            </main>
            {loading && <div className="sync-status"><LoaderCircle size={14} className="spin" /> Syncing workspace</div>}
            {toast && <div className={`toast toast-${toast.kind}`} role="status"><span>{toast.kind === 'success' ? <Check size={16} /> : <ShieldAlert size={16} />}</span>{toast.message}<button aria-label="Dismiss message" type="button" onClick={() => setToast(null)}><X size={15} /></button></div>}
            {editor && <EditorModal
                editor={editor}
                profile={profile}
                releases={workspace.releases}
                campaigns={workspace.campaigns}
                leads={workspace.leads}
                busy={busyAction === 'save'}
                onClose={() => setEditor(null)}
                onChange={(value) => setEditor((current) => current ? { ...current, value: { ...current.value, ...value } } : current)}
                onSubmit={saveEditor}
            />}
        </div>
    );
}


export default App;
