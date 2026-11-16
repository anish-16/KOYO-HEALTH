/**
 * Employee roster CSV parsing.
 *
 * Partners paste or upload a roster exported from their HRMS. The parser is
 * deliberately forgiving: it accepts either a header row (with common aliases
 * such as "Emp ID" or "Mobile") or the documented positional order, handles
 * quoted fields and CRLF, and reports line numbers so a bad row can be fixed
 * instead of failing the whole upload.
 */

export type CsvColumn =
  | 'code'
  | 'name'
  | 'age'
  | 'gender'
  | 'phone'
  | 'email'
  | 'department'
  | 'location';

export type ParsedCsvRow = { line: number; values: Partial<Record<CsvColumn, string>> };

export const CSV_COLUMNS: CsvColumn[] = [
  'code',
  'name',
  'age',
  'gender',
  'phone',
  'email',
  'department',
  'location',
];

const HEADER_ALIASES: Record<string, CsvColumn> = {
  'employee code': 'code',
  'employee id': 'code',
  'emp code': 'code',
  'emp id': 'code',
  code: 'code',
  id: 'code',
  name: 'name',
  'employee name': 'name',
  'full name': 'name',
  age: 'age',
  years: 'age',
  gender: 'gender',
  sex: 'gender',
  phone: 'phone',
  mobile: 'phone',
  contact: 'phone',
  'phone number': 'phone',
  'mobile number': 'phone',
  email: 'email',
  'email id': 'email',
  department: 'department',
  dept: 'department',
  team: 'department',
  location: 'location',
  city: 'location',
  site: 'location',
  branch: 'location',
  centre: 'location',
  center: 'location',
};

export const EMPLOYEE_CSV_TEMPLATE = [
  'employee_code,name,age,gender,phone,email,department,location',
  'EMP-3001,Ananya Gupta,32,Female,9810124477,ananya@example.com,Engineering,Bengaluru',
  'EMP-3002,Rahul Mehta,41,Male,9810124478,rahul@example.com,Finance,Mumbai',
].join('\n');

function splitLine(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      out.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  out.push(current);
  return out.map((value) => value.trim());
}

function normaliseHeader(value: string) {
  return value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseCsvRows(text: string): { rows: ParsedCsvRow[]; hasHeader: boolean; error?: string } {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return { rows: [], hasHeader: false, error: 'Paste or upload a roster to continue.' };

  const firstCells = splitLine(lines[0]);
  const aliases = firstCells.map((cell) => HEADER_ALIASES[normaliseHeader(cell)]).filter(Boolean) as CsvColumn[];
  const hasHeader = aliases.length >= 2;

  const mapping: CsvColumn[] = hasHeader
    ? firstCells.map((cell) => HEADER_ALIASES[normaliseHeader(cell)] ?? 'code')
    : CSV_COLUMNS;

  const body = hasHeader ? lines.slice(1) : lines;
  if (body.length === 0) {
    return { rows: [], hasHeader, error: 'The file has a header but no employee rows.' };
  }

  const rows: ParsedCsvRow[] = body.map((line, index) => {
    const cells = splitLine(line);
    const values: Partial<Record<CsvColumn, string>> = {};
    mapping.forEach((column, columnIndex) => {
      const raw = cells[columnIndex];
      if (raw === undefined) return;
      // Two columns may map to the same key (e.g. "mobile" and "phone");
      // the first non-empty value wins so nothing is silently lost.
      if (!values[column]) values[column] = raw;
    });
    return { line: index + (hasHeader ? 2 : 1), values };
  });

  return { rows, hasHeader };
}
