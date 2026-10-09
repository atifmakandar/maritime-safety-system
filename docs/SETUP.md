# SafeWatch setup and workflow guide

## 1. Local use and hosting

Install Node 22.18+ or 24 LTS, then run `npm install` and `npm run dev`. Open `http://localhost:5175`.

For Vercel: framework Vite, standalone root `.`, install `npm install`, build `npm run build`, output `dist`. There are no required API keys. Navigation uses internal section state and needs no URL rewrite rules.

## 2. Observation → investigation → corrective action

1. Select **Log observation**.
2. Supply title, type, location, occurrence date, reporter, severity and description.
3. Open the new record from Overview or Incidents.
4. Use **Edit / investigate** to record findings and change status to Investigating.
5. Use **Add linked action** to create follow-up work connected to this record.
6. In Actions, assign owner, priority and due date; set In progress as work begins.
7. Record completion evidence/notes and set the action Complete.
8. Close the observation when findings are recorded and all linked actions are complete.

Closing while linked actions are incomplete is blocked with a visible message. Reopening a completed linked action returns its closed observation to Investigating. Date fields use UTC date-only values; future occurrence/completion dates are blocked by form validation.

## 3. Risk assessments

1. Open Risk register → New assessment.
2. Supply the hazard, activity, owner and controls.
3. Set residual likelihood (1–5) and consequence (1–5) after controls.
4. Review the calculated score and set a review date.
5. Edit the assessment as controls or operation change.

Scores 1–7 = Low, 8–14 = Medium, 15–25 = High. The matrix shows both the cell score and assessment count. An overdue review date appears against its assessment. These are configurable application categories, not a claim of a particular company's approved risk standard.

## 4. Emergency drills

1. Open Drills → Schedule drill.
2. Enter title, owner, next date and repeat interval in days.
3. Select Record completion for the relevant drill.
4. Enter completion date, attendance, recorder and findings/lessons learned.
5. Save the record. Next due = latest recorded completion + configured interval.

Backdated records do not overwrite a more recent drill's next due calculation. A drill is Overdue if its due date is before today, Due soon within seven days, otherwise Ready.

## 5. Reports and persistence

Export report selects the current section's CSV dataset: observations, risks, actions or drill completion records. Download log in Drills exports attendance/findings history. Spreadsheet formula prefixes and quote characters are escaped in exports.

The single localStorage workspace includes observations, actions, risks, drills, records and a timestamped local activity list. Each change is saved; navigating away or reloading preserves records. Clearing browser storage resets the workspace to samples. CSV reports are exports, not a synchronization service.

## 6. Verification

- `npm test`: risk thresholds, UTC date rollover, completed-action overdue exclusions and drill-date boundaries.
- `npm run test:e2e`: record creation, linked actions, closure rules, reload persistence, risk scoring, drill logging and mobile search.
- `npm run build`: strict TypeScript compilation and Vite production assets.

Browser tests require Chromium: `npx playwright install --with-deps chromium`.
