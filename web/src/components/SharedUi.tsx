import type { ReactNode } from 'react';
import { ChevronDown, LoaderCircle, Plus } from 'lucide-react';

export function PageHeader({ kicker, title, description, action, actionText }: { kicker: string; title: string; description: string; action?: () => void; actionText?: string }) {
    return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> {kicker}</div><h1>{title}</h1><p>{description}</p></div>{action && <button type="button" className="button button-dark" onClick={action}><Plus size={16} /> {actionText}</button>}</div>;
}


export function Field({ label, hint, children, required, full }: { label: string; hint?: string; children: ReactNode; required?: boolean; full?: boolean }) {
    return <label className={`field ${full ? 'field-span' : ''}`}><span className="field-label">{label}{required && <i>Required</i>}</span>{children}{hint && <small className="field-hint">{hint}</small>}</label>;
}

export function EmptyState({ icon, title, detail, action, onClick }: { icon: ReactNode; title: string; detail: string; action: string; onClick: () => void }) {
    return <div className="empty-state" role="status"><div className="empty-icon">{icon}</div><strong>{title}</strong><p>{detail}</p><button type="button" className="button button-outline button-small" onClick={onClick}><Plus size={14} /> {action}</button></div>;
}

export function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
    return <article className="info-card"><div>{icon}</div><strong>{title}</strong><p>{text}</p></article>;
}

export function LoadMore({ busy, onClick }: { busy: boolean; onClick: () => void }) {
    return <div className="load-more-wrap"><button type="button" className="button button-outline button-small" onClick={onClick} disabled={busy}>{busy ? <LoaderCircle size={14} className="spin" /> : <ChevronDown size={14} />}Load more records</button></div>;
}
