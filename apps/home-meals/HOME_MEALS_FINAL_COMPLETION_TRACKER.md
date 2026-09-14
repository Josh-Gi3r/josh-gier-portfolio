# Home Meals — Final Completion Tracker

Status: **COMPLETE — SOFTWARE ACCEPTANCE GREEN**
Owner: Home Meals product / engineering
Source of truth: `main`
Completion date: 2026-09-14
Implementation acceptance commit: `11a416636250200c60f27866154aaa02dfb37185`

## Purpose

This is the execution ledger for taking Home Meals from the integrated v3 UI + v12 household system to a defensible **100% software-complete** household product for Josh + G.

The existing product spec, master implementation plan, v12 master-plan addendum, food-engine documentation, culinary verification and QA matrix remain authoritative. This tracker does not replace them. It records the final audit, defects found, fixes, evidence and release decision.

## Completion rule

`100% software-complete` means every behaviour the software can control is implemented, tested, production-safe and evidenced.

Two categories are deliberately not fabricated merely to turn a dashboard green:

- **DEVICE** — camera/microphone permission and hardware behaviour that requires Josh or G's real phone/browser;
- **HOUSEHOLD** — facts only real use can create, such as preferred heat/salt/acid balance, actual stored prep yield/usable portions, favourites and long-term repertoire.

Those are not software defects. The product is complete when it captures them cleanly instead of pretending to know them in advance.

## Working rules preserved

1. `main` remained the source of truth; the project was not restarted and no replacement roadmap was invented.
2. New findings were additive unless they genuinely superseded stale implementation detail.
3. The approved v3 design and information architecture were preserved; fixes were targeted to verified defects.
4. Product truth stayed deterministic: no invented Kitchen state, physical yield, nutrition, safety or preference history.
5. State-changing AI outputs remained proposal/confirmation gated.
6. Josh/G shared-state privacy and optimistic concurrency remained first-class release requirements.
7. PASS means evidence exists; it does not mean a screen merely looked plausible.

## Final workstreams

| ID | Workstream | Status | Final evidence |
|---|---|---|---|
| HM-F100-01 | Re-baseline current `main` against canonical docs and release gates | **COMPLETE** | Canonical docs/current code/recent commits reconciled; stale v11/ml-only/yield assumptions removed or explicitly superseded; deployment contract refreshed. |
| HM-F100-02 | First-week end-to-end household journey | **PASS** | Deterministic audit covers unknown → empty truth → GOLD/SAMBAL/RED → week gaps → shopping → prep → exact cook consumption → separate Josh/G ratings/notes → history/recency. |
| HM-F100-03 | Deterministic state, sync, conflict and recovery | **PASS** | Static sync-recovery audit plus 5 repeatable Playwright two-device cases; real first-write, cooking-deferral and repeated-conflict defects found and fixed. |
| HM-F100-04 | Ask Home, camera and voice product integration | **PASS** | Deterministic context/mutation contract protected; private AI endpoints audited; prior live Ask Home, real Vision inference and Live WebRTC negotiation preserved. Camera/mic hardware permission remains DEVICE only. |
| HM-F100-05 | Mobile, responsive, accessibility and interaction QA | **PASS** | 136-route repeatable crawl + 132 responsive samples + visible-control accessible-name checks; Kitchen accessibility defect found/fixed and regression-gated. |
| HM-F100-06 | Food/data truth and catalogue edge audit | **PASS** | 41 prep formulations, 36 dinner formulations, culinary verification, unit-safe quantities, dormant library lock, no assumed batch yields and no placeholder nutrition all green. |
| HM-F100-07 | Production hardening, privacy, security and failure states | **PASS** | v12 API envelope/size validation, generic DB errors, session security, timing-safe secret, household-code rate limiting, security headers, private AI endpoints, PWA and recovery guards. |
| HM-F100-08 | Final release gate and handover | **PASS** | Node/npm parity, lockfile install, typecheck, 12 audit gates, production build, 152 Playwright tests and Railway exact-SHA deployment accepted on implementation line; final docs head must preserve the same gates. |

## What the final audit actually found and fixed

This was not a rubber-stamp pass. The completion program exposed defects that a green build alone had not caught.

### Sync / two-device defects

1. **First-write race used stale conflict information.** If two devices raced to create the first server state, a losing client could enter conflict UI without fetching the winning payload/version. Fixed by re-fetching canonical server state before conflict choice.
2. **Cooking deferral advanced sync metadata too early.** A remote change arriving during cooking could be deferred after metadata had already moved forward, allowing stale local state to look synchronized. Fixed by deferring before metadata advancement.
3. **Post-cook pending state could overwrite local cooking work.** The old path could blindly apply a stale pending remote after the cooking route ended. Fixed by discarding the marker and re-fetching/reconciling canonical server truth.
4. **Repeated conflict retry could reuse a stale version forever.** `Keep this device` now refreshes the latest remote/version before another decision when the write conflicts again.
5. These behaviours are now protected by both `audit-sync-recovery.cjs` and repeatable browser-mocked two-device acceptance.

### Browser / accessibility defects

- The new repeatable browser crawl found an unlabeled Kitchen search field.
- Kitchen search, tab group, clear-search control, image-only prep edit controls and freezer portion steppers are now explicitly labelled.
- Dynamic Kitchen accessibility is separately regression-gated.
- Full catalogue browser acceptance now checks visible interactive controls for accessible names.

### Production / API hardening

- Incoming and stored shared household payloads are runtime-validated as v12 envelopes.
- Household payloads are capped at 1.5 MB before persistence.
- Browser-facing database failures no longer expose raw failure detail.
- Household-code attempts are rate-limited to 10 per 15 minutes per client key with HTTP 429 + `Retry-After`; successful authentication clears the bucket.
- Session remains HTTP-only, Secure and SameSite=Lax with timing-safe code/token checks.
- Production security headers now cover content sniffing, framing, referrer leakage, camera/microphone permissions, opener isolation and HSTS; the framework identification header is disabled.

### Release-engineering defects

- Production and CI runtimes are now aligned on Node 24 and npm 10.9.8.
- A committed npm lockfile replaces non-deterministic installs.
- CI uses `npm ci`.
- GitHub Actions runtime is current.
- Playwright is a release gate rather than ad hoc evidence.
- Railway deployment documentation now matches the real `main` → `apps/home-meals` production setup.

## Final repeatable acceptance suite

Home Meals CI now runs:

1. catalogue audit;
2. food-truth v2 audit;
3. food-system v2 audit;
4. intelligence v2 audit;
5. household-journey audit;
6. household-API hardening audit;
7. private-AI endpoint audit;
8. sync-recovery audit;
9. Kitchen accessibility audit;
10. release-infrastructure audit;
11. v3/v12 cutover audit;
12. product-completion audit;
13. TypeScript typecheck;
14. production Next.js build;
15. Chromium Playwright browser acceptance.

The browser gate currently contains **152 tests**:

- 13 core route tests at 390 px;
- one data-derived **136-route** full catalogue crawl covering core routes, all 36 recipes, all 36 cooking routes, 8 mothers, 26 mids, 7 boosters, Learn routes and all six Scan modes;
- one stateful first-run/navigation test;
- **132 responsive samples**: 12 representative routes × `360, 375, 390, 393, 412, 430, 768, 820, 1024, 1280, 1440`;
- five deterministic two-device sync/recovery browser cases.

The implementation acceptance run on `11a416636250200c60f27866154aaa02dfb37185` completed **152 / 152 passing**, after all static/data audits, typecheck and production build had also passed. Railway deployed that exact implementation commit successfully.

## Intelligence / reasoning decision

The model is not a second calculator or database.

- deterministic Kitchen, stock, prep, grocery, history and safety arithmetic remains code-owned;
- ambiguous meal planning, trade-offs, explanation and constrained substitutions may use the configured higher-intelligence model;
- prompts state goals/constraints directly rather than requesting narrated chain-of-thought;
- realtime voice prioritizes latency but delegates current-household questions to the deterministic backend;
- structured output is validated before UI/state use;
- OpenAI state-changing suggestions still require user confirmation.

## Documentation reconciliation

Final documentation now reflects the shipped product rather than earlier transitional architecture:

- `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md` remains the original governing vision;
- `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md` explicitly supersedes only stale v11/ml-only/yield/placeholder-Scan/placeholder-voice/local-only persistence details;
- `HOME_MEALS_V2_INTEGRATION.md` records the completed v2/v12 cutover;
- `HOME_MEALS_BACKEND_V2_STATUS.md` records integrated production status;
- `QA-ACCEPTANCE-MATRIX.md` is the current release matrix;
- `README.md` describes current v12 production truth;
- `DEPLOY.md` describes the actual Railway production contract.

## Final acceptance boundary

### Software-controlled completion: **100%**

No software workstream remains PENDING in HM-F100.

### DEVICE evidence that remains intentionally external

- Josh/G's actual phone/browser camera permission + hardware behaviour.
- Josh/G's actual phone/browser microphone permission + hardware behaviour.

The app already implements clean fallback/denial behaviour; only the physical device observation is outstanding.

### HOUSEHOLD evidence that remains intentionally external

- real taste calibration for meals not yet cooked;
- preferred heat/salt/acid balance over time;
- actual observed prep yields / usable stored portions where Josh/G choose to record them;
- long-term favourite active repertoire and real preference memory;
- real brand/package/expiry observations where evidence is required.

These are product-learning inputs, not unfinished engineering.

## Release decision

**ACCEPT.**

Home Meals is complete as a software product for the defined Josh + G household scope. The next meaningful phase is no longer broad construction. It is real household operation: shop, prep, cook, rate, observe, and let the system accumulate truthful household evidence.

The final repository documentation head is release-acceptable only after the same CI + Railway gates above remain green; the exact final accepted SHA is recorded externally in the release handoff/final completion report once those automated checks finish.

## Worklog

### 2026-09-14 — Re-baseline
- Recovered project continuity from the full prior conversation and repository history.
- Re-read canonical product/master/food/QA documents against current `main`.
- Verified the approved v3 UI, v12 household system, culinary verification and existing live production evidence rather than restarting the roadmap.

### 2026-09-14 — Truth and legacy cleanup
- Removed ml-only compatibility assumptions from current stock/UI logic.
- Retired stale v11 sync/runtime and parallel prep relationship/yield truth.
- Locked regressions preventing those assumptions from returning.

### 2026-09-14 — First-week household gate
- Added deterministic end-to-end household journey audit.
- Gated CI on unknown→empty Kitchen truth, starter repertoire, week gaps, shopping, prep, exact cook consumption, separate Josh/G ratings and recency.

### 2026-09-14 — Intelligence/privacy gate
- Protected Ask Home, Vision and Live POST endpoints behind the private household session.
- Preserved confirmation-before-mutation and deterministic context contracts.

### 2026-09-14 — Browser acceptance
- Added Playwright release infrastructure and deterministic lockfile/runtime setup.
- Expanded to a data-derived 136-route catalogue crawl and all canonical responsive width checkpoints.
- Added first-run stateful acceptance and visible-control accessible-name checks.
- Browser QA found and drove real accessibility fixes rather than merely documenting old evidence.

### 2026-09-14 — Two-device sync recovery
- Added repeatable browser-mocked Josh/G sync tests.
- Found/fixed first-write race, stale conflict refresh, active-cooking metadata deferral and post-cook stale-pending overwrite risks.
- Added static sync-recovery regression gate.

### 2026-09-14 — Production hardening
- Added v12 payload validation, payload size cap and generic DB failure responses.
- Added household-code rate limiting.
- Added production browser security headers.
- Aligned CI/production Node + npm runtimes and deterministic installs.

### 2026-09-14 — Implementation acceptance
- Accepted implementation SHA `11a416636250200c60f27866154aaa02dfb37185` after all audits, typecheck, production build and **152 / 152 Playwright tests** passed.
- Verified Railway deployed the exact implementation SHA successfully.
- Began final documentation certification on top of the accepted implementation without changing product behaviour.
