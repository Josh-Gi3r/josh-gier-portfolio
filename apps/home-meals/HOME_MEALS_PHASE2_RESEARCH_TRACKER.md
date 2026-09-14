# Home Meals — Phase 2 Research Tracker

Status: **COMPLETE — 100/100 FORMULATION LOCKED**
Started: 2026-09-14
Research acceptance head: `e6c0dad3d1017de0db5a7c0c63876328a8158379`
Railway acceptance deployment: `8176f5e1-7879-4118-b4eb-2bc466b69112` — **SUCCESS**

This is the execution ledger for the 100-recipe expansion defined in `HOME_MEALS_CULINARY_REAUDIT_AND_100_RECIPE_PLAN.md` and `data/recipe-expansion-plan-v3.tsv`.

The research/formulation phase is complete. The 100 new recipes remain deliberately separate from the existing live catalogue until the controlled Live Promotion phase. `FORMULATION_LOCKED` does **not** mean `LIVE`.

## Household cook-scale rule

- Typical diners: **2**.
- Canonical default cook batch: **4 servings**.
- Supported smaller cook: **3 servings**.
- Normal default outcome: two portions eaten + two leftover portions.
- Runtime recipe, grocery, prep-readiness and stock-consumption truth uses the four-serving policy.
- Scaling is not a blind 2× multiplier. Bulk protein/starch/vegetables usually scale close to linearly; oils, strong seasonings, aromatics, slurry/liquid and physical pan capacity are reviewed separately.
- Crowded wok, grill, fry, omelette and tray recipes explicitly split into multiple physical batches when needed.

## Final progress

- Planned expansion: **100**
- Formulation locked: **100 / 100**
- Live from Phase 2: **0 / 100**
- Household calibrated: **0 / 100**
- Existing live catalogue: **36 dinners**
- Existing canonical prep catalogue: **41 prep objects**

## Wave tracker

| Wave | Scope | Planned | Locked | Live | Status |
|---|---|---:|---:|---:|---|
| 1A + 1B | Chinese | 15 | 15 | 0 | FORMULATION LOCKED |
| 2 | Indian | 10 | 10 | 0 | FORMULATION LOCKED |
| 3A | Thai | 8 | 8 | 0 | FORMULATION LOCKED |
| 3B | Malaysia / Singapore / Indonesia | 10 | 10 | 0 | FORMULATION LOCKED |
| 3C | Vietnamese | 6 | 6 | 0 | FORMULATION LOCKED |
| 4A | Japanese | 8 | 8 | 0 | FORMULATION LOCKED |
| 4B | Korean | 8 | 8 | 0 | FORMULATION LOCKED |
| 5A | Middle Eastern / Mediterranean | 8 | 8 | 0 | FORMULATION LOCKED |
| 5B | Italian / European | 8 | 8 | 0 | FORMULATION LOCKED |
| 5C | Mexican / Latin | 6 | 6 | 0 | FORMULATION LOCKED |
| 6A + 6B | Everyday breakfast / lunch | 13 | 13 | 0 | FORMULATION LOCKED |
| **Total** |  | **100** | **100** | **0** | **RESEARCH COMPLETE** |

## Research truth now present for every recipe

Every Phase 2 record has:

- explicit dish identity and Home-adaptation status;
- a four-serving ingredient formulation in `g`, `ml` or `count` where measurement is meaningful;
- explicit prep relationship or an explicit no-base / pantry-sauce decision;
- pantry dependencies;
- cooking order, equipment, cues and failure-sensitive technique;
- four-serving capacity guidance where pan geometry matters;
- relevant food-safety targets;
- allergen and substitution notes;
- rounded reference kcal/person with uncertainty, not false calibrated precision;
- culinary/source evidence;
- a dish-faithful image brief;
- `formulation_locked` status.

The aggregate research registry is `data/phase2-research-registry-v5.ts`. The completion record is `HOME_MEALS_PHASE2_RESEARCH_COMPLETION_V5.md`.

## Material architecture corrections preserved

Research corrected initial planning assumptions instead of forcing recipes into existing prep architecture:

- Butter Chicken uses standalone `MAKHANI`, not GOLD.
- Chicken Tikka Masala stays distinct and uses `GOLD + RED`, not MAKHANI.
- Dan Dan Noodles stays pantry/direct rather than forcing DOUBAN.
- Tom Kha uses direct galangal + lemongrass + makrut rather than LE.
- Prik King uses `THAI-R` but remains a dry curry without coconut milk.
- Hainanese Chicken Rice generates its own poaching liquor and does not require CLEAR.
- Beef Rendang uses `RENDANG + LE` and does not double-charge REMPAH.
- Chicken Satay remains no-base with fresh marinade and separate peanut sauce.
- Vietnamese Lemongrass Chicken uses direct lemongrass rather than LE.
- Chicken Bánh Mì does not use NUOC.
- Japanese Shioyaki remains no-base and does not use TERI.
- Dakgalbi and Spicy Pork Bulgogi keep direct gochujang/gochugaru marinades rather than forcing GOCHU.
- Carbonara remains egg + cheese + guanciale, with no cream and no base.
- Mushroom Risotto genuinely uses `DUX + CLEAR`.
- Chicken Enchiladas use `RED + CHIPOTLE`; fajitas, tacos and quesadillas stay direct.
- Grilled Cheese + Tomato Soup uses RED; the rest of the everyday set is intentionally mostly direct/no-base.

## Permanent truth boundaries

- Do not convert grams to millilitres without an explicit measured conversion.
- Do not invent physical prep yields.
- Do not label reference kcal as calibrated household nutrition.
- Do not infer internal food safety from appearance.
- Brand-sensitive sodium, allergen and nutrition values remain label-dependent.
- A pantry bottle is not promoted into a freezer component merely for architectural symmetry.
- A Home adaptation must be named as a Home adaptation.
- Josh/G taste and household calibration remain learned from real use rather than fabricated.
- `FORMULATION_LOCKED` does not make a recipe selectable in Cook/Plan.
- Home Meals intentionally does **not** use GitHub Actions. Validation is repo-native plus Railway deployment evidence.

## Acceptance evidence

At research acceptance head `e6c0dad3d1017de0db5a7c0c63876328a8158379`, Railway deployment `8176f5e1-7879-4118-b4eb-2bc466b69112` succeeded after:

- catalogue, food-truth, food-system, intelligence and household journey audits;
- household API, private AI, sync recovery and accessibility audits;
- culinary re-audit and serving-policy audit;
- all 11 cuisine/wave Phase 2 audit families;
- aggregate `audit-phase2-100-v5.cjs`, which passed **100/100 FORMULATION LOCKED · 0/100 LIVE**, exact expansion-plan parity, all-four-serving contracts, evidence/kcal/image/cook-scale coverage, resolved prep references, and unchanged 36-live-dinner / 41-prep boundaries;
- release-infrastructure, v3/v12 cutover and product-completion audits;
- Next.js production compilation, TypeScript validation, static-page generation and production start.

## Phase 2 worklog closure

### Chinese — 15/15
Shared Chinese soy/vinegar/Shaoxing/oyster/doubanjiang/chilli-oil and wok/velveting/roast/steam truth locked. Wave 1A was rebased from old two-serving research to the four-serving household policy; Wave 1B was researched directly at four servings.

### Indian — 10/10
MAKHANI/KORMA/GOLD/SAAG/tadka boundaries locked, including Butter Chicken, distinct Tikka Masala architecture and raw kidney-bean safety.

### Thai — 8/8
Fish sauce/tamarind/palm sugar/coconut/NPP/THAI-R/direct-herb logic locked, including pantry-direct Pad Thai and corrected Tom Kha.

### Malaysia / Singapore / Indonesia — 10/10
Kecap manis, cooking caramel, belacan, coconut rice, kerisik, KARI/ASAM/SAMBAL, chicken-rice stock, satay and squid timing locked.

### Vietnamese — 6/6
Fish sauce, direct lemongrass, NUOC/nước chấm, caramel, coconut-water braise, pickles, vermicelli and bánh-mì assembly locked.

### Japanese — 8/8
DASHI, Japanese soy/mirin/sake, JP-CURRY, karaage, shioyaki, yakisoba and rice/egg technique locked.

### Korean — 8/8
Kimchi, gochujang, doenjang, K-STOCK, soy/sesame, dangmyeon, direct marinades and rolled-omelette geometry locked. The final Korean type defect in optional Japchae egg metadata was corrected before accepted deployment.

### Middle Eastern / Mediterranean — 8/8
Tahini/hummus, za'atar, sumac, kofta, falafel, couscous and halloumi logic locked.

### Italian / European — 8/8
Pasta-water emulsions, Pecorino/guanciale, RED/DUX/CLEAR boundaries, aglio e olio and frittata technique locked.

### Mexican / Latin — 6/6
Tortillas, fajita sear, taco meat, quesadilla, ranchero/RED, beans and RED+CHIPOTLE enchilada logic locked.

### Everyday breakfast / lunch — 13/13
Egg geometry, toastie/melt, Caesar/BLT, tomato soup, breakfast burrito and meal-scale salad technique locked.

## Next phase — Controlled Live Promotion

Research is no longer the bottleneck. The next phase is to promote the 100 researched recipes into the actual product in coherent batches: bind canonical ingredient identities and aliases; add deterministic grocery/stock/safety/allergen/reference-nutrition contracts; generate dish-faithful hero imagery from the locked briefs; expose recipes in Cook/Plan/Ask Home/history/readiness; extend route/browser/mobile acceptance; validate repo-native audits/build and Railway; then mark each promoted recipe `LIVE`.
