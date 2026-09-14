# Home Meals — Portion, Nutrition and Recipe Rebase V6

Status: **EXECUTION IN PROGRESS**
Date: 2026-09-15
Baseline: `4ef65aa52854c048d63ced42930c5868a9791e6f`

This work corrects the last major numeric-system ambiguity in Home Meals: **a sensible prep production batch, a frozen/fridge storage packet and a recipe's exact prep requirement are three different quantities.**

It is additive to the accepted four-serving household policy and the 100/100 formulation-locked Phase 2 research.

## Governing household truth

- Typical diners: **2**.
- Default cook batch: **4 servings**.
- Supported smaller cook: **3 servings**.
- A prep production session should remain practical for a household freezer. Do not scale a mother/mid recipe merely because dinner recipes moved from two to four servings.
- A stored packet should usually be useful for one normal four-serving cook, or a simple whole-number fraction/multiple of one where the prep is naturally concentrated.
- **Packet size is not batch yield.** Finished batch output is measured after cooking.
- **Container capacity is not food mass.** Gram-based prep is weighed; no g↔ml conversion is inferred from a silicone cavity.
- The 41 prep objects are a library/rotation. Josh + G are not expected to keep every prep stocked simultaneously.

## Scope

### Workstream 1 — Re-audit every prep quantity and every use

Review all **41 prep objects (8 mothers, 26 mids, 7 boosters)** and every place those quantities are consumed or displayed.

For each prep object establish:

1. canonical exact recipe-use quantity for a normal four-serving cook;
2. practical storage packet/dose quantity and unit;
3. storage packet kind (`meal-packet`, `stock-block`, `booster-dose`, `fridge-portion`, `pantry-dose`);
4. recommended physical container capacity where useful, without treating capacity as weight;
5. sensible household production scale relative to the source/master formulation;
6. target rotation depth, normally a small number of future cooks rather than indefinite stock;
7. measured-output workflow: cook → cool appropriately → weigh/measure actual finished output → divide into full packets + labelled remainder → record exact measured stock;
8. parent/child prep consumption, FIFO stock arithmetic and no-double-charge rules.

Audit all quantity consumers, including:

- live recipe prep requirements;
- the 100 Phase 2 researched recipe prep requirements;
- prep-to-prep parent inputs;
- weekly prep demand/readiness;
- Kitchen stock counting/editor;
- Prep Day and make sheets;
- grocery/prep planning;
- recipe/cooking display;
- Ask Home context;
- freezer/container guidance;
- stock consumption after cooking;
- migration and deterministic audits.

Acceptance: no user-facing path may treat the old tiny `workingUnit` as the canonical freezer packet for a four-serving meal.

### Workstream 2 — Methodology-based kcal/nutrition rebase

Build a reference nutrition layer rather than treating unmeasured household food as unknowable.

Method hierarchy:

1. exact product nutrition label when a household product is bound;
2. USDA FoodData Central / equivalent authoritative composition value for generic ingredients;
3. recipe calculation from ingredient weights using FAO/INFOODS methodology;
4. cooked-food/yield/retention factors for material cooking transformations;
5. published finished-food proxy for extraction-sensitive stocks/broths;
6. published fat-uptake/rendering/yield assumptions for frying or draining where direct measurement is not available;
7. household measured finished yield replaces generic yield assumptions for kcal-per-g/ml density when available.

Every estimate carries provenance and confidence. Reference kcal is useful before household calibration; calibrated kcal remains a higher-truth state.

For normal sauces/pastes:

`ingredient kcal → batch input kcal → finished output estimate/measurement → kcal per g/ml → kcal per storage packet → kcal contribution to finished recipe`

For water-loss-only reduction, energy is conserved while density changes. For strained stock, frying, rendered/discarded fat or discarded marinade, use the appropriate proxy/yield/uptake model instead of counting all inputs as eaten.

Acceptance:

- all prep ingredients and recipe ingredients required by the 36 live + 100 researched recipes have a reference energy path or an explicit documented proxy;
- all 41 prep objects have a reference kcal method/status;
- all 136 recipes have methodology-derived reference kcal/person or a clearly identified proxy/fallback with uncertainty;
- no 2-serving divisor remains in the four-serving nutrition path;
- reference estimates are not mislabeled as household-calibrated nutrition.

## Workstream 3 — Update recipes in controlled batches

Reconcile the complete recipe set against Workstreams 1 and 2.

Order:

1. **36 existing live dinners** — update prep packet language, exact prep use, kcal method and UI/runtime consistency first.
2. **15 Chinese**
3. **10 Indian**
4. **8 Thai**
5. **10 Malaysia / Singapore / Indonesia**
6. **6 Vietnamese**
7. **8 Japanese**
8. **8 Korean**
9. **8 Middle Eastern / Mediterranean**
10. **8 Italian / European**
11. **6 Mexican / Latin**
12. **13 breakfast / lunch / everyday**

A recipe should present prep in human terms such as `1 GOLD meal packet · 240 g` when the exact requirement equals one canonical packet. If it requires a fraction or multiple, say so while always preserving the exact g/ml value underneath.

Research provenance remains immutable; V6 operational overlays may supersede older V2/V5 display/runtime quantities without rewriting history.

## Execution plan

### Phase A — Numeric graph audit

- map all 41 prep objects to all 136 recipes and prep-parent relationships;
- find every UI/runtime path that derives counts from `workingUnit`;
- define the V6 packet/storage contract and household batch scales;
- add deterministic graph audits before changing UI.

### Phase B — Portion architecture implementation

- add V6 packet/batch policy data and helpers;
- update stock math and prep demand to count canonical packets while preserving exact quantities;
- replace count×old-working-unit production logging with actual measured output entry;
- update Mother, Mid, Booster, Prep Day and Kitchen stock language/controls;
- expose full packets + remainder after measured production;
- update recipe/cooking prep labels to packet + exact quantity.

### Phase C — Nutrition methodology implementation

- add authoritative ingredient energy reference/provenance layer;
- add yield/retention/proxy methodology types;
- calculate prep batch reference energy and packet contribution;
- fix four-serving nutrition arithmetic;
- derive recipe reference kcal/person across live and research registries;
- compare against existing rounded planning references and flag material deltas for review rather than silently overwriting anomalies.

### Phase D — Recipe reconciliation batches

- live 36 first;
- then each Phase 2 cuisine batch in the research order above;
- verify every prep reference resolves to exact V6 use and every recipe has nutrition status/confidence;
- do not promote the 100 research recipes to `LIVE` merely as a side effect of this numeric rebase.

### Phase E — Acceptance and deployment

- repo-native audits only; **no GitHub Actions**;
- TypeScript and production build;
- relevant Playwright/browser acceptance where available;
- Railway production deploy and exact-head verification;
- close this document with final counts, evidence and remaining household-only calibration boundaries.

## Non-goals

- no redesign of the Home Meals product;
- no forced new mother/mid components for symmetry;
- no claim that a cavity volume equals a gram mass;
- no fake finished yields;
- no claim that reference kcal is laboratory analysis;
- no automatic live promotion of the 100 researched recipes until their separate Live Promotion contract is satisfied;
- no GitHub Actions.
