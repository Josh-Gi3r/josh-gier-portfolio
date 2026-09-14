# Home Meals — Controlled Live Promotion V7

Status: **EXECUTION PLAN — STARTED**
Date: 2026-09-15
Baseline: V6 complete, 36 live + 100 formulation-locked researched recipes
Source of truth: `main`

## Objective

Promote the 100 Phase 2 researched recipes into the real Josh + G Home Meals product without weakening the truth contract or creating a second food system.

A recipe is not `LIVE` merely because its research is complete. Promotion means it participates correctly in the same household system as the existing 36 dinners.

## Governing rules

1. Preserve the approved v3 visual/product architecture and v12 household state.
2. Preserve the V6 quantity contract: production batch, storage packet and exact recipe requirement are distinct.
3. Canonical default cook remains 4 servings for 2 diners + leftovers; 3 servings remains the supported smaller cook.
4. No GitHub Actions.
5. No recipe is partially promoted. A wave can contain only recipes whose entire promotion gate passes.
6. Research provenance is immutable. Live adapters may normalize identities/units for runtime but do not rewrite the underlying research history.
7. Direct meals and pantry-sauce meals remain first-class; do not manufacture freezer prep merely for symmetry.
8. Reference nutrition remains an estimate with provenance/confidence; household-calibrated nutrition remains a higher truth state.
9. A route, card or planner suggestion must never point at a recipe that cannot also cook, shop and reconcile through deterministic household state.

## Promotion contract per recipe

Every recipe must have all of the following before `LIVE`:

### A. Identity and display
- unique recipe ID;
- title, cuisine, occasion, format, meal-weight and effort/time lane;
- concise household-facing subtitle/copy;
- dish-faithful hero image bound to the recipe ID;
- image brief retained as provenance for the visual asset.

### B. Canonical ingredients
- every ingredient has a stable canonical ID;
- canonical unit is `g | ml | count`;
- no ambiguous unit conversion;
- pantry/qualitative items remain qualitative only where exact stock is not useful;
- product-sensitive ingredients retain manufacturer-label upgrade paths;
- specialist sourcing flags preserved where relevant.

### C. Prep and pantry
- exact V6 prep requirement resolves for the four-serving cook;
- `madeFrom` parents are never double-charged;
- pantry foundations remain pantry foundations rather than fake mids;
- no-base recipes remain no-base when research says so.

### D. Cooking
- deterministic four-serving ingredient formulation;
- supported three-serving derived formulation;
- equipment/capacity guidance;
- ordered steps, cues, warnings and thermometer targets;
- cooking UI can complete through explicit stock-reconciled or history-only outcomes.

### E. Household arithmetic
- readiness;
- groceries;
- prep shortages;
- exact ingredient consumption;
- exact prep consumption;
- FIFO prep stock;
- planner scoring;
- history, ratings, notes and favourites;
- Ask Home context.

### F. Safety / allergens / substitutions
- recipe-level allergens carried into the live product;
- relevant official safety target carried into cooking;
- substitutions remain graded and source/research constrained;
- camera never certifies internal safety.

### G. Nutrition
- V6 reference energy resolves;
- kcal/person uses the four-serving formulation;
- uncertainty/confidence is retained;
- no legacy planning kcal silently overrides V6;
- exact product labels / measured prep outputs can later upgrade household calibration.

### H. Acceptance
- data audit;
- cuisine-wave audit;
- aggregate live-catalogue audit;
- TypeScript;
- production Next build;
- route/browser acceptance expanded for the new live catalogue;
- Railway exact-SHA deployment green.

## Execution waves

The 100 recipes are promoted in coherent food-system waves, preserving the completed research grouping:

1. Chinese — 15
2. Indian — 10
3. Thai — 8
4. Malaysia / Singapore / Indonesia — 10
5. Vietnamese — 6
6. Japanese — 8
7. Korean — 8
8. Middle Eastern / Mediterranean — 8
9. Italian / European — 8
10. Mexican / Latin — 6
11. Breakfast / lunch / everyday — 13

Each wave is accepted before the next is marked live. Shared pantry/canonical ingredient work may be implemented ahead of a wave when multiple cuisines depend on it.

## Architecture plan

### Phase LP0 — Promotion readiness layer
- normalize the 100 V5 research records into one V7 candidate interface;
- bind V6 nutrition overlays;
- bind V6 prep packet/exact-quantity language;
- create deterministic candidate validation;
- inventory canonical ingredient gaps, live-engine gaps and image gaps.

### Phase LP1 — Canonical ingredient expansion
- extend ingredient identity collection to promoted research ingredients;
- preserve distinct measured forms where unit or edible state differs;
- add allergen, nutrition-binding, sourcing and specialist metadata where known;
- regression-gate incompatible-unit collisions.

### Phase LP2 — Unified runtime formulation
- make the runtime formulation layer able to serve both the original 36 and promoted V7 recipes;
- preserve four-serving locked formulations directly;
- derive the supported three-serving option without rewriting V5 research;
- reuse the same ingredient/prep engines for readiness, groceries and consumption.

### Phase LP3 — Catalogue/product integration
- promoted recipes enter Cook, Plan, Builder, readiness and history through one catalogue;
- Ask Home receives the same promoted catalogue, not a parallel research list;
- dynamic route handling stays generic; no hand-authored route per recipe.

### Phase LP4 — Visual assets
- generate/bind one dish-faithful hero image per promoted recipe from its locked image brief;
- no generic cuisine photo substituted as the recipe image;
- image IDs/URLs are stored as recipe assets, not embedded ad-hoc in components.

### Phase LP5 — Wave acceptance
For each cuisine wave:
- candidate count matches research count;
- all canonical ingredients resolve;
- prep/pantry references resolve;
- allergens/safety/nutrition resolve;
- live catalogue count rises by the exact wave size;
- route/cooking/grocery/plan/Ask Home acceptance passes.

### Phase LP6 — Final 136-recipe acceptance
Final live target after all waves: **136 live recipes = existing 36 + promoted 100**.

The 41 prep objects remain a rotation library, not a requirement to stock everything.

## Project-management rule

Promotion status must be machine-readable and monotonic:

`formulation_locked → promotion_ready → live`

No code path may infer `live` from research completeness alone.

## Current starting point

- Existing live recipes: **36**
- Phase 2 formulation-locked: **100 / 100**
- V6 operational overlays: **100 / 100**
- Phase 2 live: **0 / 100**
- Target final live catalogue: **136**

## Definition of done

V7 is done only when all 100 recipes meet the promotion contract, the live product exposes 136 recipes through the same deterministic household system, final imagery is bound, all repo-native/data/build/browser gates pass, and Railway production is green on the exact final `main` SHA.
