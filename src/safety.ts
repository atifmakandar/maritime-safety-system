export type Severity = 'High' | 'Medium' | 'Low';
export type Incident = { id: string; title: string; type: 'Near miss' | 'Hazard observation' | 'Incident'; location: string; date: string; reportedBy: string; severity: Severity; status: 'Open' | 'Investigating' | 'Closed'; description: string; investigation: string };
export type Action = { id: string; title: string; source: string; owner: string; dueDate: string; status: 'Open' | 'In progress' | 'Complete'; priority: Severity; completionNote: string };
export type Risk = { id: string; hazard: string; activity: string; likelihood: number; consequence: number; owner: string; control: string; reviewDate: string };
export type Drill = { id: string; title: string; nextDate: string; owner: string; intervalDays: number };
export type DrillRecord = { id: string; drillId: string; title: string; date: string; crew: number; findings: string; recordedBy: string };
export type Event = { id: string; at: string; description: string };
export type SafetyData = { incidents: Incident[]; actions: Action[]; risks: Risk[]; drills: Drill[]; records: DrillRecord[]; events: Event[] };

export function today(): string { return new Date().toISOString().slice(0, 10); }
export function addDays(date: string, days: number): string { const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
export const riskScore = (risk: Pick<Risk, 'likelihood' | 'consequence'>) => risk.likelihood * risk.consequence;
export const riskLevel = (score: number): Severity => score >= 15 ? 'High' : score >= 8 ? 'Medium' : 'Low';
export const drillStatus = (drill: Drill) => drill.nextDate < today() ? 'Overdue' : drill.nextDate <= addDays(today(), 7) ? 'Due soon' : 'Ready';
export const overdue = (action: Action) => action.status !== 'Complete' && action.dueDate < today();

export function seedData(): SafetyData {
  const date = today();
  return {
    incidents: [
      { id: 'NM-0264', title: 'Unsecured stores found on forecastle', type: 'Near miss', location: 'Forecastle deck', date: addDays(date, -1), reportedBy: 'R. Menon', severity: 'Medium', status: 'Investigating', description: 'Loose stores were found during deck rounds. No injury reported.', investigation: 'Securing checklist and stowage practice under review.' },
      { id: 'HO-0263', title: 'Oil sheen around purifier platform', type: 'Hazard observation', location: 'Engine room', date: addDays(date, -3), reportedBy: 'A. Khan', severity: 'High', status: 'Open', description: 'Oil observed around drain tray; inspect hose and isolate the source.', investigation: '' },
      { id: 'NM-0261', title: 'Wet deck near galley entrance', type: 'Near miss', location: 'Galley entrance', date: addDays(date, -6), reportedBy: 'S. Patel', severity: 'Low', status: 'Closed', description: 'Wet deck after washdown. No injury reported.', investigation: 'Area dried. Barricading and signage included in toolbox talk.' },
    ],
    actions: [
      { id: 'CA-148', title: 'Secure loose stores on forecastle', source: 'NM-0264', owner: 'R. Menon', dueDate: addDays(date, 1), status: 'In progress', priority: 'Medium', completionNote: '' },
      { id: 'CA-147', title: 'Inspect purifier drain tray and hose', source: 'HO-0263', owner: 'A. Khan', dueDate: addDays(date, -1), status: 'Open', priority: 'High', completionNote: '' },
      { id: 'CA-143', title: 'Refresh wet-deck signage at galley', source: 'NM-0261', owner: 'S. Patel', dueDate: addDays(date, -7), status: 'Complete', priority: 'Low', completionNote: 'Signage installed and verified in deck rounds.' },
    ],
    risks: [
      { id: 'RA-042', hazard: 'Enclosed space entry', activity: 'Tank inspection', likelihood: 3, consequence: 5, owner: 'Chief Officer', control: 'Permit, gas testing, attendant and rescue arrangements.', reviewDate: addDays(date, 7) },
      { id: 'RA-039', hazard: 'Slips and trips', activity: 'Deck washdown', likelihood: 3, consequence: 3, owner: 'Bosun', control: 'Barricades, signage, anti-slip checks.', reviewDate: addDays(date, 14) },
      { id: 'RA-037', hazard: 'Hot work ignition', activity: 'Welding', likelihood: 2, consequence: 5, owner: '2nd Engineer', control: 'Permit, fire watch, gas testing.', reviewDate: addDays(date, -1) },
    ],
    drills: [
      { id: 'DR-01', title: 'Fire drill', nextDate: addDays(date, 4), owner: 'Chief Officer', intervalDays: 30 },
      { id: 'DR-02', title: 'Abandon ship drill', nextDate: addDays(date, -2), owner: 'Master', intervalDays: 30 },
      { id: 'DR-03', title: 'Enclosed space rescue', nextDate: addDays(date, 10), owner: 'Chief Engineer', intervalDays: 60 },
      { id: 'DR-04', title: 'Oil spill response', nextDate: addDays(date, 1), owner: 'Safety Officer', intervalDays: 30 },
    ], records: [], events: [],
  };
}

export function loadData(): SafetyData {
  try {
    const raw = localStorage.getItem('safewatch-workspace-v2');
    if (raw) {
      const data = JSON.parse(raw) as SafetyData;
      if (data && ['incidents', 'actions', 'risks', 'drills', 'records', 'events'].every((key) => Array.isArray(data[key as keyof SafetyData]))
        && data.incidents.every((item) => typeof item.title === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date))
        && data.risks.every((item) => item.likelihood >= 1 && item.likelihood <= 5 && item.consequence >= 1 && item.consequence <= 5)) return data;
    }
  } catch { /* Fall back to seeded data when storage is missing or malformed. */ }
  return seedData();
}

export function downloadCSV(name: string, rows: (string | number)[][]) {
  const escape = (value: string | number) => {
    const text = String(value);
    return `"${(/^[=+\-@]/.test(text) ? "'" : '') + text.replace(/"/g, '""')}"`;
  };
  const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map((row) => row.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
