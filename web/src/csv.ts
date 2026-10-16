export type CsvRow = { lineNumber: number; cells: string[] };

export function parseCsv(source: string): CsvRow[] {
    if (source.length > 2_000_000) throw new Error('This CSV is larger than 2 MB. Split it into smaller statements.');
    const rows: CsvRow[] = [];
    let row: string[] = [];
    let cell = '';
    let quoted = false;
    let lineNumber = 1;

    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        if (quoted) {
            if (character === '"' && source[index + 1] === '"') {
                cell += '"';
                index += 1;
            } else if (character === '"') {
                quoted = false;
            } else {
                cell += character;
                if (character === '\n') lineNumber += 1;
            }
            continue;
        }
        if (character === '"') {
            if (cell.length) throw new Error(`Unexpected quote near CSV line ${lineNumber}.`);
            quoted = true;
        } else if (character === ',') {
            row.push(cell.trim());
            cell = '';
        } else if (character === '\n' || character === '\r') {
            row.push(cell.trim());
            cell = '';
            if (row.some((item) => item !== '')) rows.push({ lineNumber, cells: row });
            row = [];
            if (character === '\r' && source[index + 1] === '\n') index += 1;
            lineNumber += 1;
        } else {
            cell += character;
        }
    }
    if (quoted) throw new Error('This CSV has an unclosed quoted field.');
    row.push(cell.trim());
    if (row.some((item) => item !== '')) rows.push({ lineNumber, cells: row });
    return rows;
}

export function toCsv(records: Array<Record<string, unknown>>): string {
    const columns = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
    const quote = (value: unknown) => {
        const rendered = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
        return /[",\r\n]/.test(rendered) ? `"${rendered.replace(/"/g, '""')}"` : rendered;
    };
    return [columns.map(quote).join(','), ...records.map((record) => columns.map((column) => quote(record[column])).join(','))].join('\r\n');
}
