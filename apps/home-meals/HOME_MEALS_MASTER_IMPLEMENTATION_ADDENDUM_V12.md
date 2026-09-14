# Home Meals — Master Implementation Addendum (v12 truth)

Status: canonical additive amendment to `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`
Date: 2026-09-14

This addendum does **not** replace the master plan. It explicitly supersedes only the implementation details below that became stale after the culinary-verification, food-truth v2, v12 household-state, live Vision/Voice and production-sync cutovers. Every other product, design, copy, interaction and acceptance requirement in the master plan remains in force.

## 1. Quantity truth supersedes legacy `portionMl` / assumed-yield language

Where the master plan refers to `portionMl`, normalized ml-only component stock, a fixed batch yield, or automatically writing an exact batch yield, the current rule is:

- recipe and prep requirements use an explicit quantity object with canonical unit `g`, `ml` or `count`;
- grams and millilitres are never silently converted into each other;
- component stock is derived from measured/confirmed batches plus explicit manual stock, not from a guessed recipe yield;
- internet/source research may validate formulation and technique but does not prove the household's physical cooked yield;
- physical yield remains unknown until Josh/G actually observe it;
- the normal Prep UX is **working-portion first**: make the recipe, divide/store useful working portions, tell Home how many standardized portions were stored; exact canonical quantity remains underneath for arithmetic;
- cooking, planning, groceries and prep all consume the same canonical quantities.

This supersedes stale quantity/yield wording in master-plan sections 8.1, 8.2, 17 and 20. The governing runtime is v12 plus food-truth/food-engine v2.

## 2. Prep relationships

The current prep graph distinguishes:

- `madeFrom`: a true production dependency;
- `usedWith`: a common pairing that is not an ingredient dependency;
- standalone prep items: no parent dependency.

No display catalogue or UI may recreate a second parallel relationship truth. Dormant/researched library items remain available without pretending they are required household repertoire.

## 3. Kitchen truth

Fresh household state is **unknown**, not empty.

The user may explicitly:

- confirm the Kitchen is empty in one action;
- start from zero and add only what exists;
- scan a fridge/freezer/pantry/receipt and review proposed additions before applying them.

Qualitative pantry state remains `Out / Low / Some / Plenty`; it must never be converted into invented grams or millilitres.

## 4. Active prep repertoire

The 41 prep objects are a capability library, not a checklist. Josh/G maintain an active subset.

Supported starter choices include:

- small starter: `GOLD + SAMBAL + RED`;
- balanced five-base set;
- all eight mothers;
- custom repertoire.

Planning and Ask Home should prefer the active repertoire and may explain the smallest useful extra prep that unlocks meaningful variety.

## 5. Nutrition

Hard-coded recipe calories/macros are not household truth and must not appear as calibrated values.

Nutrition may only become a first-class displayed value when its ingredient inputs, serving basis and retained-yield assumptions are sufficiently evidenced/calibrated. Until then, the app should state that nutrition is not calibrated rather than fabricate precision.

## 6. Live Vision supersedes the old placeholder-only Scan rule

The old master-plan section 23 described the pre-live-vision state. Vision is now live.

Current contract:

- modes: Fridge, Freezer, Pantry, Receipt, Prep and Meal;
- image inference may propose tracked ingredient/prep matches and visible cooking cues;
- inventory changes require explicit user confirmation;
- quantity estimates must be expressed only in the target canonical unit or returned as unknown;
- visible puck/cube count does not prove prep quantity without a readable amount;
- image appearance may help with browning, texture, reduction, oil separation and obvious scorching;
- image appearance can never certify internal food temperature or microbial safety;
- camera permission denial must degrade cleanly to photo-library/manual paths.

## 7. Realtime voice supersedes the old microphone-placeholder rule

The old master-plan section 10 allowed microphone UI to remain a placeholder until realtime voice existed. Realtime voice now exists.

Current contract:

- voice is a low-latency conversational surface using the same Home truth contract;
- household-dependent arithmetic, stock, planning, recipe, substitution and mutation questions delegate to the deterministic backend before an answer is given;
- state-changing requests return through the same proposal/confirmation path as Ask Home;
- browser speech fallback remains available where realtime voice is unavailable;
- microphone permission denial is a DEVICE boundary, not a reason to invent a fake voice state.

## 8. AI reasoning / model-routing principle

Home Meals uses the model as a reasoning layer only where reasoning adds value; deterministic household code remains the source of truth.

- straightforward stock/readiness/history arithmetic is computed locally/server-side and supplied to the model rather than asking the model to recompute it;
- ambiguous meal planning, trade-offs, substitutions and complex household questions may use the higher-intelligence configured model;
- realtime voice prioritizes low latency, then delegates complex/current-household questions to the backend;
- prompts state the end goal and constraints directly; they do not ask the model to reveal or narrate chain-of-thought;
- structured outputs are validated before they reach the UI;
- model responses are proposals, never an independent household database.

This preserves accuracy while avoiding needless model work for deterministic tasks.

## 9. Server persistence, privacy and recovery supersede local-only persistence language

The old master-plan section 28 described localStorage as the bridge "until server persistence arrives." Server persistence has arrived.

Current contract:

- Railway Postgres stores the shared Josh + G household state;
- a private household session gates household sync and AI mutation-capable endpoints;
- the household code is rate-limited against repeated guessing and successful authentication clears its attempt bucket;
- session cookies are HTTP-only, Secure and SameSite=Lax;
- household code/token comparison is timing-safe;
- household API payloads are runtime-validated as v12 state and size-capped before persistence;
- optimistic versioning prevents silent last-write-wins overwrite;
- first-write races refresh the winning remote state/version before presenting a conflict;
- concurrent edits surface an explicit conflict;
- remote updates are deferred during active cooking without prematurely advancing sync metadata;
- leaving cooking re-fetches canonical server truth rather than blindly applying a stale pending payload;
- failed sync writes preserve local state and surface recovery rather than silently dropping work;
- database error detail is logged server-side and not returned to the browser;
- local/session browser storage may support migration, offline continuity and active-cooking resilience, but it is not a second authoritative household truth.

Production browser responses also carry defensive headers for content-type sniffing, framing, referrer leakage, permissions, opener isolation and HSTS, and the framework identification header is disabled.

## 10. PWA / offline status

The offline shell is no longer merely desirable. Primary completed routes are cached by the v12 service worker and the image cache is bounded. An app update must not interrupt an active cooking session.

## 11. Release evidence

Software completion requires all of the following to agree on the accepted commit:

1. Node 24 and npm 10.9.8 parity between CI and production, with a committed npm lockfile;
2. TypeScript typecheck;
3. catalogue audit;
4. culinary / food-truth audit;
5. food-system audit;
6. intelligence audit;
7. first-week household-journey audit;
8. household-API hardening audit;
9. private-AI endpoint audit;
10. sync-recovery audit;
11. Kitchen accessibility audit;
12. release-infrastructure audit;
13. v3/v12 cutover audit;
14. product-completion audit;
15. production Next.js build;
16. repeatable Chromium browser acceptance in CI;
17. Railway deployment and healthcheck success on the same accepted head;
18. production status/configuration checks;
19. QA acceptance matrix and final completion tracker updated to the same evidence.

The current repeatable browser gate is **152 Playwright tests**: a data-derived **136-route** catalogue crawl at 390 px, stateful first-run navigation, **132 responsive samples** across all canonical widths (`360, 375, 390, 393, 412, 430, 768, 820, 1024, 1280, 1440`) and five two-device sync/recovery cases. Visible-control accessible-name checks run during the full catalogue crawl.

Implementation acceptance commit `11a416636250200c60f27866154aaa02dfb37185` passed all audits, production build and **152 / 152 Playwright tests**, and deployed successfully on Railway. Final documentation heads must preserve the same release gates before closure.

Only two categories may remain outside software acceptance:

- **DEVICE**: real phone/browser camera or microphone permission/hardware behaviour;
- **HOUSEHOLD**: taste preferences, actual measured prep yields, long-term favourite repertoire and other facts that only real Josh/G use can create.

The software is complete when it captures those facts cleanly instead of pretending to know them in advance.
