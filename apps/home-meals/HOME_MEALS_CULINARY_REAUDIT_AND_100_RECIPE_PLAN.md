# Home Meals — Culinary Re-audit + Next 100 Recipe Plan

Status: **PHASE 1 COMPLETE — CURRENT CATALOGUE RE-AUDITED / NEXT 100 PLANNED**
Date: 2026-09-14
Scope: additive to the accepted v3 UI + v12 household product. This document does not replace the master implementation plan, culinary verification ledger, food-truth v2 contracts or QA matrix.

## 1. Decision

Home Meals should not force every meal through a freezer base.

The future food system has three equally valid acceleration lanes:

1. **Prepared components** — mothers, mids and boosters for work that is genuinely worth doing ahead.
2. **Pantry foundations** — soy sauces, fish sauce, oyster sauce, vinegars, fermented pastes, cooking wines and similar shelf/fridge staples that create fast flavour without manufacturing another prep object.
3. **Direct meals** — eggs, sandwiches, salads, grilled fish, omelettes, toast, wraps and other meals that are better cooked directly from ordinary ingredients.

That architecture gives the household speed without turning prep into an obligation.

## 2. Current catalogue re-audit

The live catalogue remains:

- **8 mothers**
- **26 mids**
- **7 boosters**
- **41 prep objects total**
- **36 current dinners**

The re-audit reviewed the current canonical prep formulations, recipe formulations, prep-consumption graph, recipe source/identity layer, safety layer, ingredient/grocery truth and nutrition architecture together rather than treating the old display recipes as authoritative.

### Acceptance rule

A recipe/component is accepted when:

- ingredient quantities are explicit in `g | ml | count` where measurement is meaningful;
- no hidden g↔ml conversion is used;
- the cooking method contains the culinary endpoint that matters, not only a timer;
- component relationships distinguish `madeFrom` from `usedWith`;
- physical finished yield is not invented;
- safety endpoints are explicit where relevant;
- source-backed technique and Home adaptation are distinguished honestly;
- grocery and prep demand agree with the canonical dinner formulation;
- nutrition precision does not exceed the evidence available.

### Re-audit corrections found and shipped

The pass found real issues rather than rubber-stamping the previous catalogue:

1. **Pad kra pao** — the existing KRAPOW dose was too small relative to the current two-person source formula and the dinner omitted source-relevant direct seasoning/water/onion. KRAPOW is now 45 ml for the canonical dinner, the raw ground chicken receives 5 ml fish sauce, and the final wok step includes 30 ml water plus onion. Holy basil remains fresh and garlic/chilli remain separately adjustable.
2. **Massaman beef** — the old 70-minute reference was not credible for chuck. The canonical dinner now includes braising water and explicitly requires a 90–120 minute covered braise until genuinely fork-tender before potato/onion. The displayed reference time is 150 minutes.
3. **Punjabi egg curry** — the intended rice side existed in the meal description but not in canonical grocery truth. The current two-person formulation now includes 100 g dry basmati and a rice step.
4. **Thai red chicken & pumpkin curry** — the intended modest rice side is now explicit at 100 g dry jasmine for two people and appears in the cooking flow/grocery truth.
5. **Household safety endpoint** — poultry and ground-meat canonical thermometer endpoints now use the locally conservative Singapore household rule of ≥75°C. Fish remains 63°C; whole-cut beef remains 63°C with the relevant rest/tenderness distinction.

The rest of the 41 prep objects and 36 dinners remain canonical Home Meals formulations after this pass. Some are close references; others are deliberately source-anchored household adaptations. `home_formulation` does not mean unresearched: it means the reusable Home object is not being misrepresented as one universal traditional recipe.

## 3. kcal / nutrition truth

### Current dinners

Every one of the 36 current dinners now has a rounded **reference kcal per person** plus one of four meal-weight labels:

- `light`
- `balanced`
- `hearty`
- `rich`

The UI shows these values as **reference energy estimates with ±15% uncertainty**. They are useful now for choosing and balancing meals, but they are intentionally not labelled as calibrated household nutrition.

Why: many dinners contain a stored prep component. A trustworthy kcal density for that component depends on the actual finished output of the cooked household batch. Until Josh/G record that output, pretending that evaporation/reduction had a fixed yield would create false precision.

### Prep components

Two nutrition paths remain explicit:

- most cooked/paste/sauce components: **measured output required** before exact kcal per stored working portion can be calculated;
- `CLEAR`, `DARK`, `DASHI`, `K-STOCK`: **finished-food proxy required**, because solids are strained/discarded and raw ingredient summation overstates what ends up in the liquid.

Once measured output and authoritative ingredient/product bindings exist, the existing nutrition engine calculates whole-recipe and per-serving nutrition deterministically. The reference kcal layer does not replace that engine.

## 4. Meal classification model

`light / balanced / hearty / rich` is useful, but it should be one axis rather than the entire category system.

### Meal weight

- **Light** — normally intended to land at or below roughly 500 kcal/person.
- **Balanced** — everyday middle lane, normally roughly 500–700 kcal/person.
- **Hearty** — substantial meal, normally roughly 700–900 kcal/person.
- **Rich** — intentionally indulgent/energy-dense, often above roughly 900 kcal/person.

These are planning lanes. Phase 2 evidence may move a recipe after its formulation and kcal are verified.

### Other useful axes

Each future recipe can also carry:

- occasion: breakfast / lunch / dinner;
- cuisine / region;
- format: curry, wok, noodles, rice bowl, soup, eggs, sandwich, wrap, salad, traybake, roast, braise, pasta, etc.;
- prep strategy: no-base / mother / mid / booster / pantry-sauce / hybrid;
- effort/time lane;
- primary protein/vegetarian identity;
- cooking method/equipment;
- pantry dependency;
- household history/readiness/favourite state once live.

This supports questions such as “give me a light Chinese dinner with no prep”, “something hearty but under 30 minutes”, or “breakfast using only fridge staples” without forcing the catalogue into one hierarchy.

## 5. Pantry foundations

`data/pantry-foundations-v3.ts` introduces the missing architectural layer between freezer prep and raw ingredients.

It currently plans/tracks 30 flavour foundations, including:

- Chinese light soy, dark soy, oyster sauce, Shaoxing wine, sesame oil, Chinkiang vinegar, hoisin, chilli oil/crisp;
- fish sauce, tamarind, palm sugar, kecap manis, belacan, coconut milk/coconut water;
- Japanese soy, mirin, sake, white miso;
- gochujang, doenjang and Korean soy;
- Worcestershire, Dijon, wholegrain mustard, rice vinegar, hot sauce, chipotle-adobo, red-wine vinegar and balsamic.

Phase 2 will bind exact brand/product nutrition or sodium only where the app needs that precision. A bottle of dark soy remains a pantry foundation; it does not become a freezer mid simply for architectural symmetry.

## 6. Next 100 recipe directions

The locked planning catalogue lives in `data/recipe-expansion-plan-v3.tsv`.

It contains **exactly 100 unique future directions**, does not duplicate any of the current 36, and includes **Butter Chicken**.

### Portfolio shape

- **15 Chinese directions**
- 10 Indian
- 8 Thai
- 10 Malaysia / Singapore / Indonesia
- 6 Vietnamese
- 8 Japanese
- 8 Korean
- 8 Middle Eastern / Mediterranean
- 8 Italian / European
- 6 Mexican / Latin
- 13 additional breakfast/lunch/everyday directions

### Prep architecture across the 100

- **32 no-base** directions
- **25 pantry-sauce** directions
- 21 mid-led directions
- 14 mother-led directions
- 5 hybrids
- 3 booster-led directions

This is deliberate. More than half of the expansion can work without requiring another freezer base.

### Occasion coverage

- 78 dinner
- 12 breakfast
- 10 lunch

### Meal-weight intent

- 12 light
- 33 balanced
- 35 hearty
- 20 rich

### Chinese expansion examples

The 15 Chinese directions include Mapo Tofu, Kung Pao Chicken, Black Pepper Beef, Tomato & Egg Stir-fry, Char Siu Pork, Char Siu Chicken, Steamed Fish with Ginger & Scallion, Ginger-Scallion Chicken, Sweet & Sour Chicken, Garlic Aubergine, Dan Dan Noodles, Beef Chow Fun, Chicken Chow Mein, Egg Fried Rice and Salt & Pepper Prawns.

This group deliberately uses pantry sauces heavily rather than inventing a base for each dish.

### Butter chicken

Butter Chicken is planned against the existing **MAKHANI** mid. Phase 2 will decide the exact two-person protein/marinade/cream/butter/fenugreek formulation and reference kcal against current high-quality Indian sources. No new butter-chicken-specific base is assumed at planning stage.

## 7. Phase 2 research contract

The 100 planning records are **not live recipes yet**. No planned item becomes selectable in the household catalogue until it passes the research contract below.

For every candidate, Phase 2 will lock:

1. **Identity** — what dish we are actually trying to make and whether it is close-reference, household-adapted or cuisine-inspired.
2. **Source set** — current high-quality culinary source(s), technique source where needed, and safety source where applicable.
3. **Two-person formulation** — exact direct ingredients, amounts, basis and any explicit starch/side.
4. **Prep relationship** — mother/mid/booster use only when it genuinely saves work and preserves the dish; otherwise pantry-sauce or no-base.
5. **Method** — equipment, ordering, heat, approximate time, visual/texture endpoints and failure cues.
6. **Safety** — relevant thermometer target, cross-contamination/storage constraints and what camera appearance cannot prove.
7. **Energy/nutrition** — reference kcal first; deterministic calibrated kcal/macros when ingredient binding + measured prep outputs support it.
8. **Meal taxonomy** — meal weight, occasion, format, cuisine, effort and useful planning tags.
9. **Procurement** — ingredient aliases, pantry state vs exact quantity, specialist-item flag and practical JB/SG sourcing where useful.
10. **Visuals** — only after the formulation is locked: find/licence a suitable image or generate a dish-faithful image when needed.
11. **Regression** — add to food truth, recipe truth, grocery/stock consumption, safety and catalogue audits before it becomes live.

Research should proceed in coherent cuisine/technique batches rather than 100 isolated one-off prompts. Chinese pantry sauces, for example, should be researched as a shared flavour system so soy/oyster/Shaoxing/vinegar usage stays consistent across recipes.

## 8. Quality gates

Two new permanent audits are part of `npm run audit:data`:

- `audit-culinary-reaudit-v3.cjs` protects the 41/36 re-audit corrections and the 36 kcal references;
- `audit-recipe-expansion-v3.cjs` protects the 100-item plan, Butter Chicken, Chinese breadth, no-base/pantry-sauce breadth, meal-weight lanes and valid component/pantry references.

The next-100 TSV is therefore planning truth, but not cooking truth. Phase 2 can change a candidate's exact ingredients, kcal, preparation relationship or weight class when research justifies it; it should not silently turn an unresearched candidate into a live recipe.

## 9. AI runtime review

The current voice path already uses `gpt-live-1` with browser WebRTC and delegates household-dependent reasoning to the deterministic Home backend. That remains the right architecture.

The text Ask Home path remains behind the deterministic v12 context, structured output validation and confirmation-before-mutation contract. GPT-6 Astra is a suitable future default for the hardest planning/research work because accuracy matters more here than high-volume token cost, but this culinary pass does not require a model migration to make the food truth correct.

## 10. Phase boundary

**Phase 1 is complete when CI and deployment are green on the final head containing this plan.**

At that point:

- the existing 41 prep objects / 36 meals remain live and re-audited;
- kcal reference + meal-weight data exists for all current meals;
- pantry foundations exist as a first-class planning layer;
- exactly 100 future recipe directions are locked;
- no future recipe pretends to have detailed ingredients, exact kcal or imagery before Phase 2 research.

Phase 2 is then a truth-building exercise, not another brainstorming exercise.
