# WagerBrain Terminal — Frontend Sprint Tracker

Owner: Master (frontend)
Backend: [backend dev]
Source doc: `wagerbrain_terminal_frontend_phases.md`
Stack: Vite + React + TypeScript + Tailwind, react-router-dom, Zustand

---

## Stack Decision — RESOLVED

- [x] Vite + React + TypeScript confirmed — matches backend dev's primary recommendation, avoids static-export config entirely, builds a plain SPA for Tauri.

---

## Folder Structure (annotated by phase — build order)

```
wager-brain-terminal/
├─ src/
│  ├─ main.tsx                      [Phase 0]
│  ├─ App.tsx                       [Phase 0] router setup (react-router-dom)
│  ├─ index.css                     [Phase 0] @import "tailwindcss";
│  │
│  ├─ routes/                       [Phase 0] scaffolded empty → [Phase 1] built out
│  │  ├─ Dashboard.tsx
│  │  ├─ ProviderImport.tsx
│  │  ├─ ImportedArbs.tsx
│  │  ├─ ExecutionDesk.tsx
│  │  ├─ RecoveryDesk.tsx
│  │  ├─ BookmakerProfiles.tsx
│  │  ├─ ProviderProfiles.tsx
│  │  ├─ ProxyProfiles.tsx
│  │  ├─ Ledger.tsx
│  │  └─ Settings.tsx
│  │
│  ├─ components/
│  │  ├─ ui/                        [Phase 0] started → [Phase 1] filled out (buttons, inputs, modals, status chips)
│  │  ├─ layout/                    [Phase 0] Sidebar, Topbar, Shell
│  │  └─ features/                  [Phase 1]
│  │     ├─ arb-import/
│  │     ├─ execution/
│  │     ├─ recovery/
│  │     ├─ profiles/
│  │     └─ ledger/
│  │
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ types.ts                [Phase 0] stub → [Phase 3] real shared contracts w/ backend dev
│  │  │  ├─ mock/                   [Phase 0] folder scaffolded → [Phase 1] JSON filled with realistic mock data
│  │  │  │  ├─ providerProfiles.json
│  │  │  │  ├─ bookmakerProfiles.json
│  │  │  │  ├─ proxyProfiles.json
│  │  │  │  ├─ importedArbs.json
│  │  │  │  ├─ executionTickets.json
│  │  │  │  ├─ recoveryOptions.json
│  │  │  │  └─ ledgerEntries.json
│  │  │  ├─ providerClient.ts       [Phase 3] typed client — swap point mock → real
│  │  │  ├─ profileClient.ts        [Phase 3]
│  │  │  ├─ proxyClient.ts          [Phase 3]
│  │  │  ├─ executionClient.ts      [Phase 3]
│  │  │  ├─ calculatorClient.ts     [Phase 3]
│  │  │  ├─ ledgerClient.ts         [Phase 3]
│  │  │  ├─ settingsClient.ts       [Phase 3]
│  │  │  └─ licenseClient.ts        [Phase 3]
│  │  │
│  │  ├─ store/                     [Phase 2] Zustand slices (mirrors state shape below)
│  │  │  ├─ useAppShellStore.ts
│  │  │  ├─ useProviderProfileStore.ts
│  │  │  ├─ useBookmakerProfileStore.ts
│  │  │  ├─ useProxyProfileStore.ts
│  │  │  ├─ useArbImportStore.ts
│  │  │  ├─ useExecutionDeskStore.ts
│  │  │  ├─ useRecoveryDeskStore.ts
│  │  │  ├─ useLedgerStore.ts
│  │  │  └─ useSettingsStore.ts
│  │  │
│  │  └─ utils.ts                   [Phase 0]
│  │
│  ├─ hooks/                        [Phase 2] as interactivity needs custom hooks
│  └─ types/                        [Phase 0] started → grows through Phase 3
│
├─ public/                          [Phase 0]
├─ index.html                       [Phase 0]
├─ vite.config.ts                   [Phase 0]
└─ package.json                     [Phase 0]
```

**Phase 0 first-commit checklist** (what actually gets created before anything else):
`main.tsx`, `App.tsx`, `index.css`, `vite.config.ts`, `index.html`, `package.json` → empty `routes/*.tsx` (10 files, placeholder return only) → `components/layout/` (Sidebar, Topbar, Shell) → `components/ui/` started → `lib/api/mock/` folder created (empty or stub JSON) → `lib/api/types.ts` stub → `lib/utils.ts` → `types/` started.

Nothing in `lib/store/`, `lib/api/*Client.ts`, `components/features/`, or `hooks/` exists yet at end of Phase 0 — those are Phase 1–3.

**Rule:** nothing outside `lib/api/` imports mock JSON directly. Everything goes through the client functions — this is what makes Phase 3/5 a swap, not a rewrite.

---

## Phase 0 — Product Skeleton

**Goal:** app shell + navigation, no real backend.

- [ ] Desktop-sized layout (`App.tsx` shell)
- [ ] Sidebar / top navigation
- [ ] Route structure for all 10 screens via `react-router-dom` (Dashboard, Provider Import, Imported Arbs, Execution Desk, Recovery Desk, Bookmaker Profiles, Provider Profiles, Proxy Profiles, Ledger, Settings)
- [ ] Empty states for each screen
- [ ] Basic responsive behavior for smaller desktop windows
- [ ] Mock data folder scaffolded (`lib/api/mock/`)
- [ ] Shared component system started (`components/ui/`)

---

## Phase 1 — Static Product UI

**Goal:** every screen looks like the real product using mock data.

Required mock scenarios:

- [ ] No profiles yet
- [ ] Provider connected but not logged in
- [ ] Provider page has imported visible arbs
- [ ] Bookmaker profiles ready
- [ ] Bookmaker session expired
- [ ] Proxy healthy / failed
- [ ] Ticket ready for verification
- [ ] Odds changed
- [ ] Ticket ready for confirmation
- [ ] Ticket placed successfully
- [ ] One leg placed, one failed
- [ ] Cashout available
- [ ] Hedge available
- [ ] Ledger has history

Deliverables:

- [ ] Polished screens
- [ ] Realistic tables/cards
- [ ] Status chips
- [ ] Confirmation dialogs
- [ ] Warning states
- [ ] Failed-leg recovery screen
- [ ] Ledger detail view

---

## Phase 2 — Interactive Mock App

**Goal:** UI behaves like the real app, no real bookmaker calls.

- [ ] Provider page import (simulated)
- [ ] Selecting an arb
- [ ] Creating an execution ticket
- [ ] Resolving legs
- [ ] Verifying odds
- [ ] Changed-odds prompt
- [ ] Stake recalculation
- [ ] Final confirmation
- [ ] Placement success
- [ ] Partial placement failure
- [ ] Recovery choices
- [ ] Ledger entry creation

Deliverables:

- [ ] Clickable execution flow end-to-end
- [ ] Deterministic mock scenarios
- [ ] Clear loading states
- [ ] Clear error states
- [ ] Local mock ledger
- [ ] Frontend state store wired to all screens

---

## Phase 3 — API Contract Layer

**Goal:** replace direct mock imports with typed client functions.

- [ ] `providerClient` — `listProviderProfiles()`, `launchProviderBrowser()`, `importVisibleArbs()`
- [ ] `profileClient` — bookmaker profile CRUD, `checkBookmakerSession()`
- [ ] `proxyClient` — proxy CRUD, health check
- [ ] `executionClient` — `verifyTicketOdds()`, `prepareTicket()`, `confirmPlacement()`, `listRecoveryOptions()`, `selectRecoveryAction()`
- [ ] `calculatorClient` — `calculateTicketStakes()`
- [ ] `ledgerClient` — `listLedgerEntries()`
- [ ] `settingsClient`
- [ ] `licenseClient`
- [ ] Confirm none of these leak whether they're backed by mock JSON, MSW, HTTP, or Tauri `invoke` — UI should be agnostic

---

## Phase 4 — Tauri Shell Integration

**Goal:** run the built frontend inside Tauri.

- [ ] Confirm dev server / build output matches Tauri config (`dist` for Vite)
- [ ] Verify production build (`npm run build`) is clean — no browser-only APIs assumed that won't exist in Tauri's webview
- [ ] Hand off to backend dev for Tauri shell wiring
- [ ] No Rust required from frontend side unless Tauri commands are exposed directly (backend dev's call)

---

## Phase 5 — Backend Connection (tracked by backend dev, frontend confirms UI state shape holds)

- [ ] Local settings / local data folder
- [ ] Provider profile CRUD
- [ ] Bookmaker profile CRUD
- [ ] Proxy profile CRUD + health check
- [ ] Browser launch/session status
- [ ] Provider visible-page import
- [ ] Execution ticket persistence
- [ ] Stake calculator
- [ ] SportyBet odds verification
- [ ] SportyBet prepare/place flow
- [ ] Ledger persistence
- [ ] Failed-leg recovery options

---

## Phase 6 — Real Bookmaker MVP

- [ ] SportyBet marked executable
- [ ] 1xBet marked executable
- [ ] 3 additional researched books marked executable
- [ ] "Research only / Not executable yet" state shown for unfinished adapters

---

## Phase 7 — Polish and Safety

- [ ] Confirmation wording reviewed
- [ ] Changed-odds prompts finalized
- [ ] Failed-leg recovery UI finalized
- [ ] Ledger filters + detail view finalized
- [ ] Profile/session status clarity pass
- [ ] No auto-execute-implying language
- [ ] No "guaranteed profit" / "risk-free" language anywhere
- [ ] Confirmation required before: real placement, cashout, hedge, deleting profile/session data
- [ ] Visible status for: session expiry, suspended markets, stake-limited legs

---

## Constraints (do not violate)

- No money-critical state stored only in frontend memory
- No hard-coded bookmaker assumptions in UI components
- Typed data contracts (`lib/api/types.ts`) shared/reviewed with backend dev
- State boundaries from source doc respected — frontend owns UI/session-display state, backend owns real sessions/secrets/persistence/execution

---

## Timeline (from source doc, non-binding)

| Phase | Estimate                               |
| ----- | -------------------------------------- |
| 0–1   | 1–2 weeks                              |
| 2     | 1–2 weeks                              |
| 3     | 3–5 days                               |
| 4     | 2–4 days                               |
| 5     | depends on backend readiness           |
| 6     | depends on bookmaker adapter readiness |
| 7     | 1–2 weeks                              |
