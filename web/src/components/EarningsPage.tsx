import { useRef, useState } from 'react';
import { AudioLines, Banknote, CircleHelp, Check, Globe2, LoaderCircle, Music2, ShieldCheck, SlidersHorizontal, Upload, WalletCards } from 'lucide-react';
import type { Release, Royalty } from '../types';
import { currency, detectCsvColumns, friendlyError, parseStatementAmount } from '../helpers';
import { parseCsv } from '../csv';
import { EmptyState, InfoCard, LoadMore } from './SharedUi';
import { PageHeader } from './SharedUi';

export function EarningsPage(props: {
    royalties: Royalty[]; releases: Release[]; currencies: string[]; query: string; onAdd: () => void;
    onEdit: (item: Royalty) => void; onImport: (rows: unknown[], statementRef: string) => Promise<unknown>;
    notify: (message: string, kind?: 'success' | 'error') => void; onLoadMore: () => void; hasMore: boolean;
}) {
    const [fileName, setFileName] = useState('');
    const [parsedRows, setParsedRows] = useState<Array<{ lineNumber: number; cells: string[] }> | null>(null);
    const [columnMap, setColumnMap] = useState<Record<string, number>>({});
    const [fileError, setFileError] = useState('');
    const [statementReference, setStatementReference] = useState('');
    const [importing, setImporting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const normalizedItems = props.royalties.filter((row) => !props.query || `${row.source} ${row.category} ${row.reportingPeriod} ${row.statementReference}`.toLowerCase().includes(props.query));
    const totals = props.currencies.map((code) => ({ code, amount: props.royalties.filter((row) => row.currency === code).reduce((sum, row) => sum + row.amount, 0) }));

    async function chooseFile(file?: File) {
        setFileError('');
        setParsedRows(null);
        setColumnMap({});
        if (!file) return;
        setFileName(file.name);
        try {
            const content = (await file.text()).replace(/^\uFEFF/, '');
            const rows = parseCsv(content);
            if (rows.length < 2) throw new Error('Add a header row and at least one statement line.');
            if (rows.length > 101) throw new Error('This import supports 100 statement lines at a time. Split the export into smaller files.');
            setParsedRows(rows);
            setColumnMap(detectCsvColumns(rows[0].cells));
            if (!statementReference) setStatementReference(file.name.replace(/\.csv$/i, '').slice(0, 120));
        } catch (cause) {
            setFileError(cause instanceof Error ? cause.message : 'Could not read this CSV.');
        }
    }

    function mappedImportRows(): { rows: unknown[]; error: string } {
        if (!parsedRows?.length) return { rows: [], error: 'Choose a CSV file first.' };
        const indexes = columnMap;
        for (const [key, index] of Object.entries(indexes)) {
            if (index < 0 && !['line', 'reference'].includes(key)) return { rows: [], error: `The CSV needs a “${key}” column.` };
        }
        const releases = props.releases;
        const rows: unknown[] = [];
        for (const row of parsedRows.slice(1)) {
            const cell = (index: number) => index >= 0 ? (row.cells[index] ?? '').trim() : '';
            const releaseInput = cell(indexes.release).toLowerCase();
            const release = releases.find((item) => item.id?.toLowerCase() === releaseInput)
                ?? releases.find((item) => item.isrc && item.isrc.toLowerCase() === releaseInput)
                ?? releases.find((item) => `${item.title}${item.version ? ` ${item.version}` : ''}`.toLowerCase() === releaseInput);
            if (!release?.id) return { rows: [], error: `CSV line ${row.lineNumber} does not match a release in your Song Passport.` };
            const amount = parseStatementAmount(cell(indexes.amount));
            const date = cell(indexes.date);
            const currencyCode = cell(indexes.currency).toUpperCase();
            if (!Number.isFinite(amount) || Math.abs(amount) > 100000000 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^[A-Z]{3}$/.test(currencyCode)) return { rows: [], error: `CSV line ${row.lineNumber} has an invalid amount, date (use YYYY-MM-DD), or currency code.` };
            const sourceCategory = cell(indexes.category).toLowerCase();
            const category = sourceCategory.includes('master') || sourceCategory.includes('recording') || sourceCategory.includes('sound recording') ? 'Master royalties'
                : sourceCategory.includes('composition') || sourceCategory.includes('publishing') || sourceCategory.includes('performance') || sourceCategory.includes('mechanical') ? 'Composition/performance'
                    : sourceCategory.includes('neighbour') || sourceCategory.includes('neighbor') ? 'Neighbouring rights'
                        : sourceCategory.includes('sync') || sourceCategory.includes('licen') ? 'Sync/licence'
                            : sourceCategory.includes('direct') || sourceCategory.includes('fan') ? 'Direct-to-fan'
                                : sourceCategory.includes('live') || sourceCategory.includes('concert') ? 'Live' : 'Other';
            rows.push({
                releaseId: release.id,
                category,
                sourceCategory: cell(indexes.category),
                source: cell(indexes.source),
                reportingPeriod: cell(indexes.period),
                statementDate: date,
                currency: currencyCode,
                amount,
                statementReference: cell(indexes.reference) || statementReference.trim(),
                provenance: 'Imported artist statement',
                lineNumber: indexes.line >= 0 ? Number(cell(indexes.line)) || row.lineNumber : row.lineNumber,
            });
        }
        return { rows, error: '' };
    }

    async function importCsv() {
        const mapped = mappedImportRows();
        if (mapped.error) { setFileError(mapped.error); return; }
        if (!statementReference.trim()) { setFileError('Add a statement reference so you can trace this import to its source.'); return; }
        setImporting(true);
        try {
            const result = await props.onImport(mapped.rows, statementReference.trim());
            const outcome = result as { imported?: number; skipped?: number; failed?: number; duplicateOnly?: boolean };
            props.notify(outcome.duplicateOnly ? 'These statement lines already appear to be imported.' : `${outcome.imported ?? 0} lines imported${outcome.skipped ? `, ${outcome.skipped} duplicate lines skipped` : ''}${outcome.failed ? `, ${outcome.failed} lines need retry` : ''}.`);
            if (!outcome.failed) {
                setParsedRows(null);
                setFileName('');
                setStatementReference('');
                setColumnMap({});
                if (inputRef.current) inputRef.current.value = '';
            }
        } catch (cause) {
            props.notify(friendlyError(cause), 'error');
        } finally {
            setImporting(false);
        }
    }

    return <>
        <PageHeader kicker="KNOW WHAT GOT PAID, AND BY WHOM" title="Earnings" description="Bring income statements together by release, source, reporting period, and rights category." action={props.onAdd} actionText="Add income record" />
        <div className="earnings-caveat"><Banknote size={18} /><div><strong>These are recorded statement amounts, not a promise of payable revenue.</strong><span>NOTE does not connect to distributors, PROs, CMOs, royalty payers, banks, or payment processors. Estimates are not included in payable totals.</span></div></div>
        <div className="earnings-totals">{totals.length ? totals.map(({ code, amount }) => <div className="earnings-total" key={code}><span>{code} loaded</span><strong>{currency(amount, code)}</strong><small>{props.royalties.filter((row) => row.currency === code).length} loaded statement line{props.royalties.filter((row) => row.currency === code).length === 1 ? '' : 's'} · amount is not reconciled</small></div>) : <div className="earnings-total"><span>Loaded amounts</span><strong>—</strong><small>Add or import a statement to start your ledger</small></div>}<div className="income-sparkline" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></div>
        <section className="panel import-panel"><div className="section-title-row"><div><div className="panel-kicker">ADD A STATEMENT</div><h2>Import a royalty CSV</h2></div><span className="import-badge"><Upload size={13} /> Browser-side import</span></div><p className="panel-description">Choose a CSV. NOTE reads it in your browser and imports up to 100 statement lines; the original file is not retained. Match each line to a release by title or ISRC.</p><input className="visually-hidden" ref={inputRef} type="file" accept=".csv,text/csv" onChange={(event) => void chooseFile(event.target.files?.[0])} /><div className="import-controls"><button type="button" className="button button-outline" onClick={() => inputRef.current?.click()}><Upload size={15} /> {fileName || 'Choose CSV file'}</button><label className="field-inline"><span>Statement reference</span><input value={statementReference} maxLength={120} onChange={(event) => setStatementReference(event.target.value)} placeholder="e.g. Q1 2026 distributor statement" /></label>{parsedRows && <button className="button button-dark" type="button" onClick={() => void importCsv()} disabled={importing}>{importing ? <LoaderCircle size={15} className="spin" /> : <Check size={15} />} Import {parsedRows.length - 1} lines</button>}</div>{fileError && <p className="field-error">{fileError}</p>}{parsedRows && !fileError && <><div className="csv-map-grid">{[['release', 'Release / ISRC'], ['amount', 'Amount'], ['currency', 'Currency'], ['date', 'Statement date'], ['period', 'Reporting period'], ['category', 'Category'], ['source', 'Source']].map(([key, label]) => <label className="field-inline" key={key}><span>{label}</span><select value={columnMap[key] ?? -1} onChange={(event) => setColumnMap((current) => ({ ...current, [key]: Number(event.target.value) }))}><option value={-1}>Choose column</option>{parsedRows[0].cells.map((heading, index) => <option key={`${heading}-${index}`} value={index}>{heading || `Column ${index + 1}`}</option>)}</select></label>)}</div><div className="csv-preview"><div className="csv-preview-head"><strong>Preview · {parsedRows.length - 1} statement lines</strong><span>Release matching uses title or ISRC. Amounts accept decimal points or commas.</span></div><div className="table-scroll"><table><thead><tr>{parsedRows[0].cells.slice(0, 6).map((header, index) => <th key={`${header}-${index}`}>{header.toUpperCase()}</th>)}</tr></thead><tbody>{parsedRows.slice(1, 4).map((row) => <tr key={row.lineNumber}>{row.cells.slice(0, 6).map((cell, index) => <td key={`${row.lineNumber}-${index}`}>{cell || '—'}</td>)}</tr>)}</tbody></table></div></div></>}<div className="import-footnote"><CircleHelp size={13} /><span>Dates must use YYYY-MM-DD. Exact duplicate checks compare against up to 100 existing ledger lines; review older statements manually in a larger ledger. Imported amounts are artist-provided, and NOTE does not verify that funds were paid.</span></div></section>
        <section className="panel data-panel"><div className="table-top"><div><div className="panel-kicker">STATEMENT LEDGER</div><h2>{normalizedItems.length} recorded line{normalizedItems.length === 1 ? '' : 's'}</h2></div><span className="provenance-label"><ShieldCheck size={13} /> Source and provenance retained</span></div>
            {normalizedItems.length ? <div className="table-scroll"><table><thead><tr><th>RELEASE</th><th>SOURCE</th><th>CATEGORY</th><th>PERIOD</th><th>REPORTED</th><th>RECORDED AMOUNT</th><th>PROVENANCE</th><th /></tr></thead><tbody>{normalizedItems.slice().sort((a, b) => b.statementDate.localeCompare(a.statementDate)).map((row) => { const release = props.releases.find((item) => item.id === row.releaseId); return <tr key={row.id}><td><strong>{release?.title || 'Release not found'}</strong><small className="table-subline">{release?.isrc || 'No ISRC'}</small></td><td>{row.source}</td><td title={row.sourceCategory ? `Imported category label: ${row.sourceCategory}` : undefined}>{row.category}{row.sourceCategory && row.sourceCategory !== row.category && <small>Source label: {row.sourceCategory}</small>}</td><td>{row.reportingPeriod}</td><td>{row.statementDate}</td><td><strong>{currency(row.amount, row.currency)}</strong></td><td><span className="provenance-chip">{row.provenance}</span></td><td><button type="button" className="icon-button" aria-label="Edit income record" onClick={() => props.onEdit(row)}><SlidersHorizontal size={15} /></button></td></tr>; })}</tbody></table></div> : <EmptyState icon={<WalletCards size={20} />} title={props.query ? 'No income lines match your search' : 'No income sources connected yet'} detail="Enter a statement line or import one you already have. NOTE does not estimate payable revenue." action="Add income record" onClick={props.onAdd} />}
            {props.hasMore && <LoadMore busy={false} onClick={props.onLoadMore} />}
        </section>
        <div className="info-grid three"><InfoCard icon={<AudioLines size={16} />} title="Master royalties" text="Recording income from digital services, labels, or direct licenses." /><InfoCard icon={<Music2 size={16} />} title="Composition income" text="Publishing, performance, mechanical, and collecting-society statements." /><InfoCard icon={<Globe2 size={16} />} title="Other career income" text="Sync, neighbouring rights, direct-to-fan, live, and other artist-entered sources." /></div>
    </>;
}
