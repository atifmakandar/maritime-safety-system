# SafeWatch SMS — Maritime Safety Management

A React + TypeScript + Vite portfolio application for onboard observations, investigations, corrective actions, residual risks and emergency drills.

## Working features

- Dashboard counts calculated from records, due dates and risk scores.
- Create and edit incidents, near misses and hazard observations.
- Detail view with description, investigation/findings and linked corrective actions.
- Open → Investigating → Closed workflow; closure requires findings and completed linked actions.
- Create/edit linked or standalone corrective actions; Open / In progress / Complete states.
- Completion notes required when an action is completed. Reopening a linked action also returns its closed observation to Investigating.
- Create/edit risk assessments, control measures, owners and review dates.
- Residual score = likelihood × consequence; populated 5×5 matrix and calculated risk classifications.
- Create/edit drill schedules and recurrence intervals.
- Record completion dates, crew attendance, findings and recorder; automatically update next due date from latest completion.
- Persist observations, actions, risks, schedules, drill records and workspace activity in the browser.
- Export incident, corrective-action, risk and drill data to CSV.
- Search/filtering, mobile navigation, focus-trapped dialogs and keyboard support.

## Run

Use Node **22.18+ or 24 LTS**.

```bash
cd /home/atifmakandar/maritime-safety-system
npm install
npm run dev
```

Open **http://localhost:5175**.

## Verify

```bash
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Tests cover risk/date calculations, incident investigations and linked actions, closure checks, persistent risk/drill records, CSV download and mobile search/navigation.

## Vercel deployment

- Framework: **Vite**
- Root directory: **`.`** for a standalone repository
- Install: **`npm install`**
- Build: **`npm run build`**
- Output: **`dist`**

No external APIs, credentials or environment variables are needed for this browser-based version. See [workflow and setup guide](./docs/SETUP.md).

## Data scope

The application starts with sample vessel data and saves changes in `safewatch-workspace-v2`. Records and the activity log are browser-local. Shared multi-user access would require authentication, a backend database and server-side event history.

## Résumé description

> Developed a maritime safety management app using React and TypeScript, implementing incident investigations, linked corrective-action workflows, calculated residual-risk assessments with a 5×5 matrix, recurring drill schedules and attendance records, persistent browser storage, and CSV reporting.
