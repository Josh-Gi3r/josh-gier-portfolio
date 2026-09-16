# Home Meals Product Acceptance Audit V16

Status: **DISCOVERY COMPLETE — REMEDIATION BOARD OPEN**  
Audit base: `10786957326f6f678710ab756749a495ce852f3e`

## Purpose

This audit treats Home Meals as one Josh + G household product, not a collection of individually working pages. The question is whether either person can enter from a sensible point, understand what is happening, complete the household task, and move to the next task without understanding the internal data model.

The governing product rule remains:

> **Home Meals should expose love, food and the next useful action. The machinery stays underneath.**

`PRODUCT_ACCEPTANCE_TRACKER_V16.json` is the execution board for the findings below.

## Audit method

1. Map all live routes, persistent controls, runtime features, setup states and modal/sheet layers.
2. Test journeys in both normal and reverse directions.
3. Test state combinations, not only routes.
4. Record evidence before redesigning.
5. Fix only P0 safety/data-loss/security issues during discovery. P1–P3 stay on the board until the full picture is reviewed.
6. Preserve food truth, safety endpoints, stock arithmetic, confirmation-before-mutation and conflict-safe sync while simplifying UX.

Severity: **P0** destructive/security/safety/unrecoverable; **P1** blocks or seriously confuses a normal household journey; **P2** meaningful UX/copy/IA defect; **P3** polish.

## Surface inventory

Core navigation: Home · Cook · Prep · Kitchen · Plan · More · persistent camera/Home-orb/voice dock.

Cook: 136 live recipe pages + 136 cooking routes, search/filter, favourites, Ready now, history/recency, add-to-week, timers, wake lock, completion, separate ratings, notes/versions and dinner photos.

Prep: Browse/Ours/This week, Core bases/Mids/Sauces/Boosters/Common, 41 prep objects, detail pages, measured production, freezer stock and Prep Day.

Kitchen: Fridge/Freezer/Pantry, exact quantity where needed, Low/Some/Plenty where sufficient, use-soon, stock sheets, batches and scan entry.

Plan: seven-day calendar, unplanned/suggested/confirmed lifecycle, planning preferences, day swaps, shopping, add-purchases-to-Kitchen and Prep Day handoff.

Intelligence: typed Ask Home, local fallback, realtime voice + browser speech fallback, Vision and Fridge/Freezer/Pantry/Receipt/Prep/Meal scan modes. AI state changes remain confirmation-gated.

Shared runtime: Josh/G identity, household code/session, Postgres sync, conflict recovery, cooking deferral, PWA/offline/update handling, Kitchen setup and G talking-head walkthrough/replay.

## State matrix audited

- person: Josh / G / not selected
- session: authenticated / needs household code
- device: first / clean additional / additional with local changes
- guide: unseen / dismissed / completed / summoned
- Kitchen: unknown / empty / partial / stocked
- Plan: unplanned / suggested / confirmed
- sync: disabled / needs-code / needs-person / ready / conflict / deferred / error
- AI/Vision/Voice: configured / fallback / failed
- network: online / offline / update waiting
- history: empty / populated
- prep: none / maintained / physically stocked

## Journey matrix

Entry: new G → connect/identify → Josh guide → Kitchen if needed → Cook → Prep → Plan → Home orb. New Josh gets one minimal setup path. A clean second device should simply hydrate from the household. A genuine local/shared conflict should present one understandable decision before any Kitchen/onboarding UI.

Dinner: Home → recipe → cook → Done → ratings/note/photo → History → cook again. Reverse: History → recipe; Cook → recipe → Plan; Ask → recommendation → recipe.

Kitchen: Kitchen → edit → Ready now → recipe. Reverse: recipe missing item → Kitchen/Plan; camera → confirm → Kitchen; receipt → purchases → Kitchen.

Plan: choose/swap → confirm → shop → Kitchen → Prep Day → Cook. Reverse: recipe → day; Home → swap; use-soon → Plan.

Prep: Prep → family → detail → make/measure → freezer → dinner. Reverse: Plan gap → Prep Day; Kitchen shortage → Prep; recipe → prep detail.

Help: any supported screen → Home orb → Ask / Show me around / topic refresher. Camera/mic permissions only follow explicit user actions.

## Evidence collected

The repo contains 172 Playwright cases once the responsive matrix expands, covering route crawling, canonical widths, Ask Home, Vision confirmation, six camera modes, voice start, Plan, guide behavior and sync recovery.

Additional real Chromium exploration ran against the production build at phone dimensions with controlled household/sync states. Representative routes included Home, Cook, Builder, recipe/cooking, Prep + five families + details + Prep Day, Kitchen, Plan, Fridge/Receipt scan, History and Learn.

Baseline on representative routes: successful HTTP responses; no document horizontal overflow; no loaded broken images; no browser page errors; exactly one active Ask Home dialog on the smart-AI path; no sampled CTA/dock collision; no sampled unnamed/sub-44px visible control.

## Findings

### P0 SAFE-001 — destructive reset falsely described as local — fixed during audit

More → Our home exposed **Start the kitchen over** and described the effect as **this phone**. The action called the shared V12 reset helper. With sync active, the changed payload was then PUT to the shared household.

Browser reproduction captured a sync PUT after reset containing `kitchenReady=false`, `weekStatus=unplanned`, `history=[]` and `ratings={}`.

V16 safety action: remove the user-accessible reset until a deliberate shared-household reset design exists. Keep the helper internal and regression-gate the UI.

### P1 SYNC-001 — clean additional device falsely becomes a conflict

A genuinely clean G browser joining an existing household reproduced **This device already has Home Meals data** instead of simply loading the shared household.

Root cause: the fresh V12 state includes zero-valued quantity objects. `meaningfulPayload()` treats nested `{qty:0, unit:...}` objects as meaningful because the object itself is truthy. Default scaffolding is therefore mistaken for user-created local data.

### P1 FLOW-001 to FLOW-005 — no single entry/onboarding arbiter

HouseholdSync, the legacy Home first-run screen, FirstRunKitchen and HomeGuide independently decide when they can appear.

Reproduced combinations:

- expired G session: **Connect Josh + G + Josh guide simultaneously**;
- sync conflict + unknown Kitchen: **sync conflict + Kitchen setup simultaneously**;
- true fresh G: Josh guide over legacy **Start with what’s true** Home onboarding;
- true fresh Josh: Home first-run and FirstRunKitchen together.

This requires one entry state machine, not z-index tuning.

### P1 SYNC-002 — sync conflict choice is too opaque

Current copy says **state should win** / **become canonical**. Actions are **Use shared household** / **Keep this device**. The latter can replace shared server state, but no meaningful difference summary or last-change context is shown.

### P1 COOK-001 — leftovers are promised but not actually tracked

Cooking completion says a normal four-serving cook means two portions now + two leftovers, but current observation logging writes `leftoverWeightG:null`; no live leftover portions/location inventory exists; Home/Ask/Plan/Kitchen cannot consume an actual leftover record later.

Storage/reheat guidance exists. Household leftover state does not.

### P2 COPY-001 — internal engineering language is widespread

Active UI exposes terms such as Kitchen/household **truth**, recorded Kitchen, **canonical**, **qualitative**, repertoire, reconcile/reconciled, exact stock, packet equivalents, production batch, storage packet, source-tested formulation, reference minutes and household brain.

This contradicts the master copy contract and is a product-wide rewrite, not a one-screen patch.

### P2 AI-001 — conversational layer is not fenced from internal vocabulary

Smart Ask itself says **prep repertoire** / **household brain**. Ask/Live prompts legitimately carry technical context but need an explicit final-answer rule: reason over technical state, speak to Josh/G in normal household English.

### P2 IA-001 — From what we have is hidden

`/cook/builder` works and is tested, but current Cook has no direct entry even though the master plan calls for **From what we have** at the top of Cook.

### P2 MEMORY-001 — dinner photos are device-local

Ratings, notes and history are shared, but dinner photos use localStorage and are explicitly “on this phone.” For a couple cookbook this needs an intentional product decision rather than remaining an implementation accident.

### P2 COPY-002 — Prep/Help often teach machinery before the task

Precise measurement rules must remain, but copy often leads with phrases such as production batch, storage packet, packet math and exact stock instead of what Josh/G should do next.

### P2 VISION-001 — Vision presentation reads like model diagnostics

Confirmation-first behavior is correct. Labels such as **HOME VISION**, percentage confidence and **Keep manual** need a more natural household presentation.

### P2 PWA-001 — offline promise may be broader than the guarantee

Core routes are pre-cached, but unvisited dynamic recipe/detail routes are not guaranteed. The offline banner should either make a narrower promise or week/needed recipe pages should be proactively cached.

### P2 GUIDE-001 — guide architecture is good; some copy is not

The floating-head route-aware system is sound, but a few lines still say **household truth** / **recorded**. Josh should sound like Josh explaining the app to G.

### P3 GUIDE-002 — mixed reaction source dimensions

Five guide assets are 112×112 and four are 80×80. All decode and render in Chromium; real-device QA should check whether expression swaps visibly change sharpness/apparent scale.

## What is already working and should be preserved

- representative routes are healthy and responsive;
- CTA/dock clearance holds on sampled short-phone routes;
- recipe → week selection works;
- Plan → Shop mode → checked item → Kitchen works;
- cooking reaches completion and writes history state;
- Prep category → family → detail navigation works;
- History entries deep-link to recipes;
- typed AI/Vision changes remain confirmation-first;
- camera supports photo library + environment camera;
- guide follows real navigation, accepts detours and has replay/topic help;
- reduced-motion support exists;
- optimistic sync protects against silent overwrite before conflict resolution;
- cooking defers incoming sync updates;
- food/safety/data audits are extensive and should not be weakened by UX cleanup.

## Remediation programme

### A. Entry/sync/onboarding orchestration — P1

Create one coordinator with precedence:

1. household authentication/code;
2. person selection;
3. sync resolution;
4. G first-use guide or Josh minimal setup;
5. Kitchen setup if still needed;
6. ordinary app sheets/notices.

Fix meaningful-local-state detection so zero/default scaffolding is ignored. Rewrite conflict resolution in normal language with enough context to choose safely.

### B. One coherent first-use system — P1/P2

Remove competing legacy Home first-run UI. G’s Josh-head guide owns G onboarding and teaches Kitchen inside the real app. Josh gets one concise setup path. If Kitchen remains unfinished, surface a normal later reminder rather than dropping an old setup modal after the tour.

### C. Human-language pass — P2

Review every active user-facing string, not only keywords. Internal remains exact; user copy becomes short household English.

Examples:
- `Set Kitchen truth` → `Check what we have`
- `qualitative` → remove; show `Low / Some / Plenty`
- `active prep repertoire` → `the prep we like to keep around`
- `recorded Kitchen` → `what we have at home`
- `reconciled` → `updated`
- `source-tested formulation` → remove from primary UI

After rewrite, add a release gate preventing implementation vocabulary from returning to active surfaces.

### D. Truthful leftovers — P1

Preferred direction: cook completion records remaining portions and location (`Fridge / Freezer / None`), Home can later suggest/use them, and consumption removes them. Until that exists, do not imply Home tracks leftovers.

### E. Discoverability/shared memory — P2

Restore a visible **From what we have** entry to Cook. Decide whether dinner photos become bounded shared household memory.

### F. Real-device acceptance

Run iPhone Safari + installed PWA acceptance: camera/mic permission denied/allowed, keyboard open, background/foreground, offline after normal use, interrupted cooking, second-device changes while cooking, and cold Josh/G usability.

## Final acceptance criteria

1. G clean phone joins an existing household without a false conflict.
2. Only one setup/recovery decision is active at a time.
3. G can explain/use Home, Cook, Prep, Kitchen, Plan and the Home orb without Josh teaching her.
4. Josh fresh device has one setup experience.
5. Sync conflicts are understandable before either version can overwrite the other.
6. Ordinary UI does not leak internal implementation vocabulary.
7. Ask Home and Voice use the same natural household voice.
8. Vision remains confirm-before-change.
9. Destructive actions state their real shared/local scope.
10. Home never claims to track an object, especially leftovers, that it does not persist and use.
11. Primary loops work in both directions.
12. Supported phone widths remain collision/overflow safe.
13. Food truth, safety, stock arithmetic and conflict-safe sync remain intact.
