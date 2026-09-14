# Home Meals backend v2 / household v12 status

Status: **INTEGRATED IN PRODUCTION — SOFTWARE ACCEPTANCE GREEN**
Updated: 2026-09-14

## Scope

This tracker covers the non-visual Home Meals food/data/intelligence layer and its integration into the approved v3 UI. The old separation between a waiting backend track and an unfinished UI cutover no longer describes production.

## Implemented

### Canonical food truth
- 8 mothers / 26 mids / 7 boosters represented in the v2 truth layer.
- 36 current dinners represented in the v2 recipe layer.
- `g | ml | count` quantity model.
- no implicit mass/volume conversion.
- `madeFrom` and `usedWith` relationships separated.
- parent-child double consumption corrected for LAKSA/REMPAH, RENDANG/REMPAH, WOK-B/CLEAR, WOK-W/CLEAR and similar cases.
- MASS separated from THAI-R as a dry spice booster.
- KRAPOW kept as seasoning sauce; garlic/chilli/basil remain independently controllable.

### 41 prep formulations
- measured ingredient inputs and methods for all 41 components.
- source/evidence entry per component.
- no expected physical batch output is stored as household fact.
- normal household production is working-portion first: Josh/G store useful standardized portions and confirm how many were actually stored.
- canonical g/ml/count quantities remain underneath for arithmetic.
- whole-pot weighing is optional household calibration evidence, not a normal UX requirement.
- child prep production consumes its explicit `madeFrom` parent when the child is produced.

### 36 dinner formulations
- exact two-person formulation decisions.
- explicit direct ingredient quantities.
- corrected prep dependencies.
- explicit starch amounts where part of the canonical version.
- structured equipment and cooking steps.
- structured visual cues and safety boundaries.
- household-only observations remain unknown until actually observed.

### Variants and substitutions
- explicit no-rice / half-rice variants where relevant.
- explicit protein/starch branches instead of ambiguous combined records.
- small approved substitution graph with A/B/C grades.
- substitutions are never silently auto-applied.

### Kitchen / Prep engine
- unit-safe prep demand, shortages, readiness and consumption.
- FIFO measured/confirmed batch consumption.
- dependency-aware Prep Day planning.
- active prep repertoire rather than treating 41 components as a checklist.
- start-small repertoire supports `GOLD + SAMBAL + RED`.
- no synthetic portions-per-batch and no ml-only compatibility math in current runtime.

### Ingredient / grocery engine
- normalized ingredient ledger spanning prep and dinners.
- different measured forms stay separate identities when needed.
- exact plan ingredient demand.
- exact shopping shortfall.
- exact ingredient consumption after cooking.
- specialist sourcing flags for JB/SG planning.

### Safety / allergens / storage
- recipe safety profiles across all 36 dinners.
- thermometer targets separated from camera-visible quality cues.
- recursive allergen derivation through component dependencies.
- conservative prep storage policies.
- dinner leftover/freezer-quality policies without invented durations.

### Nutrition
- deterministic nutrition architecture remains available for evidence-backed calculation.
- provisional research calories/macros are not surfaced as household truth.
- component nutrient density is not invented from an unmeasured cooked yield.
- strained stocks refuse naive raw-ingredient nutrition summation and require an analyzed finished-food proxy.
- nutrition remains unavailable/not calibrated rather than guessed when dependencies are missing.

### Procurement / waste readiness
- household package observation model.
- package-price-derived ingredient cost calculations where actual package evidence exists.
- plan package remainder calculation.
- use-soon package sorting when an actual use-by/best-before date exists.
- no synthetic prices or expiry dates.

### Household truth
- safe historical v11 → v12 migration path.
- ambiguous old ml-only prep/ingredient stock is archived rather than silently converted.
- Josh/G ratings, notes, versions, favourites and history are preserved where safely mappable.
- separate household preference evidence.
- real use is required before taste/yield assumptions become household truth.

### Planner / Ask Home
- constraints-first planner.
- active-prep fit, ingredient readiness, prep readiness, use-soon, preference, recency, cuisine variety, weekday time and prep reuse influence ranking.
- deterministic Ask Home context precomputes stock/demand/shortfalls instead of asking an LLM to do hidden arithmetic.
- full seven-day planning and active-repertoire proposals are confirmation-gated.
- Ask/Live/Vision truth contracts prohibit invented stock, yields, nutrition, expiry, safety and preference history.
- complex/ambiguous model reasoning is used only where it adds value; deterministic household arithmetic remains code-owned.

### Vision
- live Fridge, Freezer, Pantry, Receipt, Prep and Meal modes.
- canonical-unit validation before proposals reach household state.
- inventory changes require confirmation.
- visual cooking guidance may describe browning, texture, reduction, oil separation and obvious scorching.
- visual appearance never certifies internal food temperature or microbial safety.

### Voice
- production realtime voice path implemented and negotiated successfully in acceptance testing.
- low-latency conversation delegates current-household arithmetic/planning/state work to the deterministic backend.
- mutation requests return through the same confirmation path as Ask Home.
- browser speech fallback remains available.

### v12 runtime cutover
- `HouseholdStateV12Provider` / current v12 household bridge is the active household runtime.
- shared Josh/G state is backed by Railway Postgres.
- old v11 sync/runtime files are retired from active product code and regression-guarded from reintroduction.
- current Kitchen, Prep, Prep Day, Plan, Cook, Home, Scan, Ask Home and Voice all consume v12/current truth.

### Sync / privacy / API hardening
- private household session.
- HTTP-only, Secure, SameSite=Lax session cookie.
- timing-safe household code/token comparison.
- household-code attempts rate-limited to 10 per 15 minutes per proxy-derived client key, with HTTP 429 + `Retry-After`; a successful connection clears its bucket.
- incoming and stored household payloads are runtime-validated as v12 envelopes.
- household payload is capped at 1.5 MB before persistence.
- database failure detail remains server-side; browser receives generic failure states.
- optimistic versioning prevents silent overwrite.
- first-write race refreshes the actual winning remote payload/version before conflict choice.
- concurrent/join conflicts are explicit.
- remote updates during active cooking are deferred without prematurely advancing sync metadata.
- after cooking the client re-fetches/reconciles server truth rather than blindly applying stale pending state.
- repeated conflicts refresh the current remote/version before another choice.
- failed writes preserve local work and surface retry/recovery.
- household and mutation-capable AI endpoints are not exposed without the private session when sync is configured.
- browser security headers include nosniff, deny framing, no-referrer, scoped camera/microphone permissions, same-origin opener policy and HSTS; the framework identification header is disabled.

### QA / CI
- catalogue audit.
- food-truth v2 audit.
- full food-system v2 audit.
- intelligence v2 audit.
- first-week household-journey audit.
- household-API hardening audit.
- private-AI endpoint audit.
- sync-recovery audit.
- Kitchen accessibility audit.
- release-infrastructure audit.
- v3/v12 cutover audit.
- product-completion audit.
- Node 24 + npm 10.9.8 + committed lockfile.
- deterministic `npm ci` in CI.
- Chromium Playwright release acceptance.
- **152 repeatable browser tests** on the implementation acceptance line.
- full derived **136-route** catalogue crawl at 390 px.
- **132 responsive samples**: 12 routes × all canonical widths `360, 375, 390, 393, 412, 430, 768, 820, 1024, 1280, 1440`.
- stateful first-run browser test.
- five two-device browser-mocked sync/recovery cases.
- visible-control accessible-name checks across the full route crawl.

Implementation acceptance commit `11a416636250200c60f27866154aaa02dfb37185` passed all audits, production build and **152 / 152 Playwright tests**, and deployed successfully on Railway. Final documentation commits are release-acceptable only if they preserve those same gates.

## Intentionally unknown until Josh + G provide evidence

These are not engineering gaps and must not be filled by web research or AI estimates:

- actual physical finished yield/usable portions of a household prep beyond what Josh/G record;
- actual Josh/G plate size and leftover preference;
- final household heat/salt/acid preference;
- long-term favourite active prep repertoire;
- brand-specific nutrition until the actual product evidence is bound where needed;
- exact nutrient density of a cooked component where the necessary finished-food evidence is unavailable;
- real package prices and expiry/use-by dates until observed;
- device-specific camera/microphone permission behaviour on Josh/G's actual phones.

## Integration status

The earlier ten-step UI cutover checklist is complete. It is retained historically in git history, not as remaining work.

Current software acceptance is defined by:

- `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`;
- `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md`;
- culinary verification + food-truth source ledgers;
- `QA-ACCEPTANCE-MATRIX.md`;
- `QA-ACCEPTANCE-ADDENDUM_2026-09-14.md`;
- `HOME_MEALS_FINAL_COMPLETION_TRACKER.md`.

## Product gate

Do not expand the cookbook merely to make the catalogue larger. Software-controlled completion is now a release-engineering/acceptance problem, not a catalogue-growth problem. After the final release head is green, the next product-learning loop is real household use: cook, rate, note, observe actual stored portions/yields where useful, and let those observations improve future plans.
