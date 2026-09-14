# Home Meals — Final Completion Tracker

Status: ACTIVE
Owner: Home Meals product / engineering
Baseline branch: `main`
Baseline commit reviewed: `5b72e825ae9299de72a99878752c121a15dfa1f4`
Baseline date: 2026-09-14

## Purpose

This is the execution ledger for taking Home Meals from the current integrated v3 UI + v12 household system to a defensible 100% software-complete household product for Josh + G.

The existing product spec, master implementation plan, food-engine documentation, culinary verification and QA matrix remain authoritative. This tracker does not replace them. It records the final audit, fixes, evidence and release decision.

## Completion rule

`100% software-complete` means every behaviour the software can control is implemented, tested, production-safe and evidenced.

Two things are not allowed to be fabricated merely to turn a dashboard green:

- device-specific camera / microphone permission outcomes that require Josh or G's real phone/browser;
- household evidence that only real use can create, such as preferred heat/salt/acid balance, favourite meals and preferred long-term prep repertoire.

The product is complete when it captures those observations cleanly and never invents them.

## Working rules

1. `main` is the source of truth. Do not create a replacement roadmap or restart the product.
2. New findings are additive unless they explicitly supersede an older requirement.
3. Fixes ship in small, coherent commits with regression coverage where practical.
4. Every claimed PASS must have implementation, automated/static evidence, live evidence, or a clearly named DEVICE/HOUSEHOLD boundary.
5. Do not convert unknown kitchen truth, physical yields, nutrition, safety, or household preferences into guessed numbers.
6. No design rewrite. Preserve the approved v3 design language and existing information architecture unless a verified usability defect requires a targeted change.
7. Preserve Josh/G household privacy, confirmation-before-mutation, deterministic arithmetic and current food-truth contracts.

## Workstreams

| ID | Workstream | Status | Acceptance |
|---|---|---|---|
| HM-F100-01 | Re-baseline current `main` against canonical docs and release gates | IN PROGRESS | Current implementation, recent commits, CI, production status and known gaps are reconciled; stale claims are removed or corrected. |
| HM-F100-02 | First-week end-to-end household journey | PENDING | First run → Kitchen truth → active prep → plan → groceries → prep → cook → rating/history → next recommendation works without manual repair or contradictory state. |
| HM-F100-03 | Deterministic state, sync, conflict and recovery | PENDING | Josh/G sync, version conflicts, cooking-session deferral, failed writes, refresh/reload and interrupted sessions preserve truth without silent partial state. |
| HM-F100-04 | Ask Home, camera and voice product integration | PENDING | Deterministic context, proposal/confirmation contract, route validity, error/fallback behaviour and permission-denied states are coherent. Device hardware acceptance remains explicitly DEVICE where unavoidable. |
| HM-F100-05 | Mobile, responsive, accessibility and interaction QA | PENDING | Canonical 390px experience plus required width checkpoints have no overflow, inaccessible controls, trapped scroll, unreadable text, unsafe keyboard/safe-area behaviour or broken reduced-motion handling. |
| HM-F100-06 | Food/data truth and catalogue edge audit | PENDING | 8 mothers, 26 mids, 7 boosters and 36 dinners remain internally consistent after UI/runtime cutover; dormant items are intentionally labelled/handled; recipes, quantities, safety, storage, sources and nutrition states do not drift. |
| HM-F100-07 | Production hardening, privacy, security and failure states | PENDING | Auth/session/sync/API behaviour, loading/empty/error/offline states, PWA update behaviour, secrets exposure, rate/error handling and health diagnostics are production-safe for a private two-person app. |
| HM-F100-08 | Final release gate and handover | PENDING | Full audit suite + typecheck + production build + CI + Railway deployment/health pass; QA matrix and this tracker match reality; only named DEVICE/HOUSEHOLD observations remain. |

## Execution order

### Slice A — Re-baseline and contradiction hunt

- Read the canonical master plan, product spec, v2 integration/status docs, culinary verification/status and QA matrix against current code.
- Review recent Home Meals commits so already-completed work is not duplicated.
- Search for legacy household-state paths, placeholder truth, TODO/FIXME, dead runtime branches, stale copy and duplicated state sources.
- Confirm the current release gates actually exercise the claims recorded as PASS.

Exit: a concrete defect/residual list, not a speculative wishlist.

### Slice B — First real operating week

Exercise the product as one continuous household story:

1. first visit with Kitchen unknown;
2. confirm empty OR add only what exists;
3. choose GOLD + SAMBAL + RED starter repertoire;
4. build a seven-dinner week;
5. inspect groceries and prep consequences;
6. mark shopping additions;
7. complete prep jobs / stored working portions;
8. cook one dinner;
9. reconcile stock;
10. rate separately as Josh and G and add a note;
11. verify history and next-week ranking change.

Exit: no contradiction between what the UI says, what v12 stores and what planning/cooking subsequently derives.

### Slice C — Recovery and two-person reality

Test reloads, concurrent edits, stale versions, offline/online changes, active cooking, sync conflicts, failed mutations and PWA updates.

Exit: every failure is either safely retried, explicitly surfaced, or recoverable without guessing household truth.

### Slice D — Intelligence surfaces

Audit Ask Home, vision and voice using the same deterministic household context. Verify no invented stock, yield, nutrition, temperature or unsafe mutation. Exercise permission denied, API unavailable and malformed-model-response paths.

Exit: intelligence is useful when available and never becomes a second source of household truth.

### Slice E — Fit and finish

Run route-by-route mobile/responsive/accessibility QA including loading, empty, missing, error and keyboard/safe-area states. Fix only real defects; preserve the approved design.

Exit: no meaningful interaction defect remains on the supported viewport matrix.

### Slice F — Final truth + release

Re-run food/data audits, catalogue-edge checks, exact quantity arithmetic, source/reference integrity and release gates. Update QA documentation to match evidence and deploy the exact accepted commit.

Exit: HM-F100-01 through HM-F100-08 accepted; any remaining item is DEVICE or HOUSEHOLD by definition rather than unfinished software.

## Evidence baseline

At tracker creation:

- repository default branch: `main`;
- current reviewed head before this tracker: `5b72e825ae9299de72a99878752c121a15dfa1f4`;
- latest observed Home Meals CI for that head: run 153, completed successfully;
- Railway commit status for that head: success;
- canonical release matrix currently records software PASS with explicit DEVICE/HOUSEHOLD boundaries.

These are a starting baseline, not proof that the final completion audit is done.

## Worklog

### 2026-09-14 — Baseline

- Recovered project continuity from prior conversation and repository documentation.
- Verified current `main` is materially ahead of the older handoff commit mentioned in the screenshots.
- Confirmed recent Home Meals commits include mobile overflow fixes, scan accessibility labels, canonical culinary references, AI route validation and increased full-week Ask Home response budget.
- Confirmed Home Meals CI run 153 and Railway commit status were successful for the reviewed baseline head.
- Opened HM-F100 final completion program. No product PASS was downgraded or re-certified yet; re-audit begins with HM-F100-01.
