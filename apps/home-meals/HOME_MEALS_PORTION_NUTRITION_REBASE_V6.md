# Home Meals — Portion, Nutrition and Recipe Rebase V6

Status: **COMPLETE**
Date: 2026-09-15
Baseline: `4ef65aa52854c048d63ced42930c5868a9791e6f`
Accepted implementation head: `441e1e3ebec1b9d8c89ee790d5eaa8b24c454116`
Railway acceptance deployment: `034b8c71-d72e-4e7f-a232-a69ae79a24d4` — **SUCCESS**

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

## Scope completed

### Workstream 1 — Re-audit every prep quantity and every use

All **41 prep objects (8 mothers, 26 mids, 7 boosters)** and their quantity consumers were re-audited. For each prep object V6 now distinguishes:

1. exact recipe-use quantity for a normal four-serving cook;
2. practical storage packet/dose quantity and unit;
3. storage packet kind (`meal-packet`, `stock-block`, `booster-dose`, `fridge-portion`, `pantry-dose`);
4. recommended physical container capacity where useful, without treating capacity as weight;
5. sensible household production scale relative to the source/master formulation;
6. small target rotation depth rather than indefinite freezer stock;
7. measured-output workflow: cook → cool appropriately → weigh/measure actual finished output → divide into full packets + labelled remainder → record exact measured stock;
8. parent/child prep consumption, FIFO stock arithmetic and no-double-charge rules.

The audit covered live recipe requirements, all 100 researched recipes, prep-to-prep inputs, weekly demand/readiness, Kitchen stock, Prep Day and make sheets, grocery/prep planning, recipe/cooking display, Ask Home, freezer/container guidance, stock consumption and migration/release audits.

The old tiny `workingUnit` is no longer the user-facing canonical freezer packet for a four-serving meal. Historical/internal unit semantics remain only where needed for compatibility and provenance.

### Workstream 2 — Methodology-based kcal/nutrition rebase

V6 implements a reference-energy methodology rather than treating unmeasured household food as unknowable.

Method hierarchy:

1. exact product nutrition label when a household product is bound;
2. USDA FoodData Central / equivalent authoritative composition value for generic ingredients;
3. recipe calculation from ingredient weights using FAO/INFOODS-style recipe arithmetic;
4. cooked-food/yield/retention treatment for material cooking transformations;
5. finished-food proxies for extraction-sensitive stocks/broths;
6. fat-uptake/rendering/yield assumptions for frying or draining when direct measurement is unavailable;
7. household measured finished yield can supersede generic density assumptions.

Reference estimates carry provenance/confidence and remain distinct from household-calibrated nutrition. Water-loss-only reductions conserve energy while changing density; strained stock, frying, rendered/discarded fat and discarded marinade are not naively counted as fully eaten.

Accepted coverage:

- **41 / 41** prep objects have a reference energy method;
- **136 / 136** recipes have V6 reference kcal/person paths;
- four-serving nutrition arithmetic is authoritative; the stale two-serving divisor was removed;
- reference kcal is not labelled as laboratory or household-calibrated nutrition;
- current deterministic range is **185–1455 kcal/person** across the 136-recipe graph, with per-recipe uncertainty/confidence preserved.

### Workstream 3 — Recipe reconciliation in controlled batches

Reconciliation is complete across:

1. **36 existing live dinners**;
2. **15 Chinese**;
3. **10 Indian**;
4. **8 Thai**;
5. **10 Malaysia / Singapore / Indonesia**;
6. **6 Vietnamese**;
7. **8 Japanese**;
8. **8 Korean**;
9. **8 Middle Eastern / Mediterranean**;
10. **8 Italian / European**;
11. **6 Mexican / Latin**;
12. **13 breakfast / lunch / everyday**.

Recipe prep is now presented in human storage terms plus exact quantity, e.g. a meal packet/dose/block relationship while retaining the exact g/ml requirement underneath. Research provenance remains intact through operational V6 overlays.

The 100 Phase 2 recipes remain deliberately **FORMULATION LOCKED, 0/100 LIVE**. This V6 numeric rebase does not silently promote them into the selectable live catalogue.

## Implementation acceptance

### Portion architecture

- **41 / 41** canonical V6 packet policies resolve.
- Mother, Mid, Booster and Prep Day production log **actual measured finished output**, not `count × workingUnit`.
- Kitchen shows full packets plus exact loose remainder and exact total stock.
- Kitchen steppers add/remove the component's V6 packet/dose rather than a legacy micro-unit.
- Recipe and Cooking views retain exact prep quantity while explaining packet/dose/block relationship.
- Parent component consumption remains exact and FIFO.
- g/ml remain separate unit domains.

### Nutrition architecture

- **41 / 41** prep energy-method records resolve.
- **136 / 136** recipe energy references resolve.
- Extraction-sensitive `CLEAR`, `DARK`, `DASHI` and `K-STOCK` use finished-food proxies rather than pretending all raw stock ingredients are eaten.
- Product-sensitive sauces remain proxy/label-upgradable.
- Actual measured finished prep output can later improve density truth without changing the architecture.

### Recipe architecture

- **36 / 36** current live dinners are reconciled to V6 prep/nutrition truth.
- **100 / 100** Phase 2 recipes are operationally reconciled while remaining not-live.
- **4 servings** remains the default household cook contract for 2 diners plus leftovers.

## Acceptance evidence

Railway deployment `034b8c71-d72e-4e7f-a232-a69ae79a24d4` built and deployed implementation head `441e1e3ebec1b9d8c89ee790d5eaa8b24c454116` successfully.

Repo-native acceptance passed through the full build chain, including:

- catalogue, food-truth, food-system, intelligence and household-journey audits;
- household API, private AI and sync recovery audits;
- Kitchen accessibility audit with V6 packet stepper labels;
- culinary re-audit and four-serving serving-policy audit;
- all Phase 2 cuisine/wave gates;
- aggregate Phase 2 100-recipe gate at **100/100 FORMULATION LOCKED · 0/100 LIVE**;
- V6 portion/nutrition gate at **41/41 prep packets · 41/41 prep energy methods · 136/136 recipe energy references · 100/100 research recipes reconciled not-live**;
- release-infrastructure audit;
- v3/v12 cutover audit;
- product-completion audit;
- Next.js production compilation;
- TypeScript validation;
- static-page generation;
- production server start;
- Railway `/` healthcheck.

Production server acceptance: Next.js 16.3.4 reported **Ready in 166ms** and Railway healthcheck succeeded on the first attempt.

Playwright was **not rerun in this V6 cycle**; this completion record does not claim otherwise.

## Permanent truth boundaries after V6

The following are real household-calibration inputs, not unfinished software:

- exact product nutrition labels for the products Josh + G actually buy;
- measured finished yields/densities from real prep batches;
- better finished-stock proxies where household stock preparation materially differs from the current reference;
- observed frying/rendering uptake when household technique justifies tighter estimates;
- Josh/G taste, portion and repeat-preference calibration.

## Non-goals preserved

- no redesign of the Home Meals product;
- no forced new mother/mid components for symmetry;
- no claim that a cavity volume equals a gram mass;
- no fake finished yields;
- no claim that reference kcal is laboratory analysis;
- no automatic live promotion of the 100 researched recipes until their separate Live Promotion contract is satisfied;
- no GitHub Actions.
