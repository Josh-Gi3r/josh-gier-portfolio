# Home Meals backend v2 status

## Scope

This tracker covers the non-visual Home Meals food/data/intelligence layer. UI/UX is deliberately owned by the separate design track.

## Implemented

### Canonical food truth
- 8 mothers / 26 mids / 7 boosters represented in the v2 truth layer.
- 36 current dinners represented in the v2 recipe layer.
- `g | ml | count` quantity model.
- no implicit mass/volume conversion.
- `madeFrom`, `usedWith`, and `unlocks` relationships separated.
- parent-child double consumption corrected for LAKSA/REMPAH, RENDANG/REMPAH, WOK-B/CLEAR, WOK-W/CLEAR and similar cases.
- MASS separated from THAI-R as a dry spice booster.
- KRAPOW kept as seasoning sauce; garlic/chilli/basil remain independently controllable.

### 41 prep formulations
- measured ingredient inputs and methods for all 41 components.
- source/evidence entry per component.
- no expected physical batch output is stored as household fact.
- every finished batch must be weighed/measured before it becomes Kitchen stock.
- child prep production consumes its explicit `madeFrom` parent when the child is produced.

### 36 dinner formulations
- exact two-person formulation decisions.
- explicit direct ingredient quantities.
- corrected prep dependencies.
- explicit starch amounts where part of the canonical version.
- structured equipment and cooking steps.
- structured visual cues and safety boundaries.
- finished dinner weight, actual servings and actual cook time remain unknown until observed.

### Variants and substitutions
- explicit no-rice / half-rice variants where relevant.
- explicit protein/starch branches instead of ambiguous `chicken or beef`, `rice or lettuce`, `potatoes or pasta` records.
- small approved substitution graph with A/B/C grades.
- substitutions are never silently auto-applied.

### Kitchen / Prep engine
- unit-safe prep demand, shortages, readiness and consumption.
- FIFO measured-batch consumption.
- actual batch IDs and measured output.
- dependency-aware Prep Day planning.
- First Run disposition across all 41 components.
- no synthetic portions-per-batch.

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
- dinner leftover/freezer-quality policies without invented freezer durations.

### Nutrition
- FDC/manufacturer binding architecture.
- household product-label bindings.
- bottom-up ingredient → component → dinner calculation engine.
- component nutrient density requires actual measured finished output.
- strained stocks refuse naive raw-ingredient nutrition summation and require an analyzed finished-food proxy.
- nutrition remains unavailable rather than guessed when dependencies are missing.

### Procurement / waste readiness
- household package observation model.
- package-price-derived ingredient cost calculations.
- plan package remainder calculation.
- use-soon package sorting when an actual use-by/best-before date exists.
- no synthetic prices or expiry dates.

### Household truth
- safe v11 → v12 migration model.
- old ml-only prep stock and ambiguous ingredient stock are archived, not silently converted.
- Josh/G ratings, notes, versions, favourites and history are preserved.
- separate household preference evidence.
- repeated evidence required before automatic preference adaptation is eligible.
- actual component batch calibration derives only from measured household batches.
- actual dinner cook observations can record time, final weight, plate weights, leftovers, ratings and heat feedback.

### Planner / Ask Home
- constraints-first planner.
- optional exact ingredient readiness, prep readiness, equipment compatibility and allergen exclusions.
- use-soon, preference, recency and prep-reuse ranking signals.
- deterministic Ask Home context builder precomputes stock/demand/shortfalls instead of asking an LLM to do hidden arithmetic.
- confirmation-gated v12 state actions.
- Live/Ask/Vision truth contracts prohibit invented stock, yields, nutrition, expiry, safety and preference history.

### Parallel runtime migration
- `HouseholdStateV12Provider` exists.
- `HouseholdSyncV12` exists.
- current v11 frontend is intentionally not switched yet because the UI/UX track is still being rebuilt.
- legacy Vision write path is guarded so gram-based v2 observations cannot corrupt the old ml-only store.

### QA / CI
- legacy data audit retained.
- food-truth v2 audit.
- full food-system v2 audit.
- intelligence v2 audit.
- Home Meals GitHub Actions workflow runs typecheck, all data audits and production build.
- active runtime is audited against importing the historical `foundation` data as current truth.

## Intentionally unknown until Josh + G provide evidence

These are not engineering gaps and must not be filled by web research or AI estimates:

- actual finished yield of an adapted household prep batch;
- actual household dinner finished weight;
- actual Josh/G plate size and leftover preference;
- actual household cook time;
- final household heat/salt preference;
- brand-specific nutrition until the actual package label is bound;
- exact nutrient density of a cooked component until its finished output is measured;
- real package prices and expiry/use-by dates until observed.

## Remaining integration owned with UI track

The backend is ready for visual cutover. The remaining work is integration, not another food-model redesign:

1. migrate Kitchen screen to v12 quantities;
2. migrate Prep / Prep Day and add measured-output confirmation;
3. migrate Plan/groceries to v2 demand engines;
4. migrate Recipe/Cooking to structured formulations/steps;
5. migrate Home readiness/recommendations;
6. migrate Scan confirmation to canonical ingredient/component units;
7. migrate Ask Home client payload/actions;
8. switch household sync to v12;
9. replace the provider in `app/layout.tsx`;
10. run final end-to-end regression against the completed visual design.

Do not switch the active provider before those consumers are unit-aware.

## Product gate

Do not expand the cookbook before the first household calibration cycle.

Recommended first real calibration order:

`GOLD → SAMBAL → REMPAH → RED → CLEAR → WOK-B → THAI-G → DUX → G/CH`

Then cook the first-week dinners and record real household observations.
