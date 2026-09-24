import { ArrowUpRight, AudioLines, BadgeCheck, CalendarDays, CircleHelp, LayoutDashboard, ListMusic, LoaderCircle, Music2, ShieldCheck, Sparkles, Headphones, WalletCards } from 'lucide-react';

export function LoadingScreen() {
    return <div className="welcome-loading"><div className="brand-mark"><AudioLines size={20} /></div><LoaderCircle className="spin" size={18} /><span>Opening your NOTE workspace</span></div>;
}

export function WelcomeScreen({ onSignIn, signingIn }: { onSignIn: () => void; signingIn: boolean }) {
    return (
        <main className="welcome-page">
            <div className="welcome-nav"><div className="brand-row"><div className="brand-mark"><AudioLines size={19} /></div><div><div className="brand-name">NOTE</div><div className="brand-label">FOR INDEPENDENT MUSIC</div></div></div><span className="private-label"><ShieldCheck size={14} /> Private artist workspace</span></div>
            <div className="welcome-content">
                <div className="welcome-copy">
                    <div className="eyebrow"><span className="eyebrow-dot" /> MUSIC, ON YOUR TERMS</div>
                    <h1>Make the music.<br /><em>Keep the rights.</em></h1>
                    <p className="welcome-lede">A calmer place to plan release promotion, keep the details straight, and understand where career income comes from.</p>
                    <button className="button button-dark button-large" type="button" onClick={onSignIn} disabled={signingIn}>{signingIn ? <LoaderCircle size={17} className="spin" /> : <Music2 size={16} />}{signingIn ? 'Connecting…' : 'Open your workspace'}<ArrowUpRight size={16} /></button>
                    <div className="welcome-note"><ShieldCheck size={15} /> Sign in securely. Your workspace is private to your account.</div>
                    <div className="welcome-note subtle"><CircleHelp size={15} /> No promotions are sent and no money is spent by NOTE.</div>
                </div>
                <div className="welcome-visual" aria-label="Preview of the NOTE workspace">
                    <div className="visual-glow" />
                    <div className="mock-window">
                        <div className="mock-top"><div className="mock-brand"><span><AudioLines size={14} /></span> NOTE</div><span>YOUR MUSIC WORKSPACE</span><div className="mock-dots"><i /><i /><i /></div></div>
                        <div className="mock-body"><div className="mock-side"><span className="mock-selected"><LayoutDashboard size={12} /></span><span><ListMusic size={12} /></span><span><CalendarDays size={12} /></span><span><WalletCards size={12} /></span></div><div className="mock-main"><div className="mock-greeting">YOUR NEXT CHAPTER</div><div className="mock-title">A good place to begin.</div><div className="mock-card-row"><div className="mock-card"><span>RELEASES</span><strong>Song Passport</strong><i><Music2 size={19} /></i><small>Rights, details, collaborators</small></div><div className="mock-card tint"><span>YOUR PLAN</span><strong>Campaigns</strong><i><CalendarDays size={18} /></i><small>Boundaries you set</small></div></div><div className="mock-list-head"><span>RECENT ACTIVITY</span><span>VIEW ALL</span></div><div className="mock-list"><span className="mock-list-icon"><BadgeCheck size={14} /></span><div><strong>Ready when you are</strong><small>Start with a release and your goals</small></div><span className="mock-list-dot" /></div></div></div>
                    </div>
                    <div className="floating-note"><span><Headphones size={17} /></span><div><strong>Independent by design</strong><small>Your rights come first.</small></div></div>
                    <div className="welcome-stamp">ARTIST<br />FIRST <Sparkles size={12} /></div>
                </div>
            </div>
            <div className="welcome-bottom"><span>Plan with intention. Track with clarity.</span><span>NOTE PROMOTION · A PRODUCER’S WORKSPACE</span></div>
        </main>
    );
}
