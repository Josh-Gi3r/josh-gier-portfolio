# Home Meals — Phase 2 Research Completion V5

Status: **RESEARCH COMPLETE — 100 / 100 FORMULATION LOCKED**
Date: 2026-09-14

This completion record is additive to the accepted Home Meals v3/v12 product and the culinary verification ledger. It closes the **research/formulation** phase for the 100 planned expansion recipes. It does **not** silently make those recipes live in Cook/Plan.

## Household cook-scale truth

- Typical diners: **2**.
- Canonical default cook batch: **4 servings**.
- Supported smaller cook: **3 servings**.
- Normal default outcome: two portions eaten + two leftover portions.
- Wok/grill/fry geometry is allowed to require multiple physical batches even when the ingredient contract represents one four-serving cook.
- Strong seasoning, oil, acid, slurry and cooking liquid are reviewed recipe-by-recipe rather than blindly doubled from older two-serving research.

The pre-existing 36 live dinners were rebased to this policy across recipe display, cooking quantities, grocery demand, ingredient readiness, prep demand/readiness, cook stock consumption and Ask Home context before the 100-recipe research continued.

## Research completion

| Wave | Scope | Locked |
|---|---|---:|
| 1A + 1B | Chinese | 15 / 15 |
| 2 | Indian | 10 / 10 |
| 3A | Thai | 8 / 8 |
| 3B | Malaysia / Singapore / Indonesia | 10 / 10 |
| 3C | Vietnamese | 6 / 6 |
| 4A | Japanese | 8 / 8 |
| 4B | Korean | 8 / 8 |
| 5A | Middle Eastern / Mediterranean | 8 / 8 |
| 5B | Italian / European | 8 / 8 |
| 5C | Mexican / Latin | 6 / 6 |
| 6 | Everyday breakfast / lunch | 13 / 13 |
| **Total** |  | **100 / 100** |

The aggregate research registry is `data/phase2-research-registry-v5.ts`.

## What FORMULATION LOCKED means

Every record now carries:

- explicit dish identity and Home-adaptation status;
- four-serving ingredient formulation in `g | ml | count` where meaningful;
- explicit reusable-prep relationship, or explicit no-base / pantry-sauce choice;
- pantry dependencies;
- cooking order, equipment and important visual/texture endpoints;
- household-scale capacity guidance where technique changes at four servings;
- relevant food-safety targets;
- allergens and substitution notes;
- rounded reference kcal/person with uncertainty rather than false calibrated precision;
- culinary/source evidence;
- image brief for later visual production;
- `formulation_locked` status.

Exact household nutrition remains behind the existing measured-yield / ingredient-label truth boundary. Physical prep yields and Josh/G taste preferences are not invented.

## Material architecture decisions discovered during research

Research was allowed to correct the original 100-row planning assumptions rather than force them.

Examples:

- **Butter Chicken** uses standalone `MAKHANI`, not GOLD.
- Chicken Tikka Masala stays distinct from Butter Chicken and uses `GOLD + RED`, not MAKHANI.
- Dan Dan Noodles stays pantry-sauce/direct rather than forcing DOUBAN.
- Tom Kha uses direct galangal + lemongrass + makrut rather than the Home LE booster.
- Prik King uses `THAI-R` but stays a dry curry without coconut milk.
- Hainanese Chicken Rice generates its own fresh poaching liquor and does not require CLEAR.
- Beef Rendang uses `RENDANG + LE`; it does not double-charge REMPAH because RENDANG already physically contains that parent.
- Chicken Satay remains no-base with fresh marinade + separately cooked peanut sauce.
- Vietnamese Lemongrass Chicken uses direct lemongrass rather than LE, because LE contains galangal.
- Chicken Bánh Mì does not use NUOC; nước chấm is not a universal Vietnamese sandwich sauce.
- Japanese Shioyaki remains no-base and does not use TERI.
- Dakgalbi and Spicy Pork Bulgogi use direct gochujang/gochugaru marinades rather than forcing the Home GOCHU finishing sauce.
- Carbonara remains egg + cheese + guanciale emulsion with **no cream** and no base.
- Mushroom Risotto genuinely earns `DUX + CLEAR`, while most direct European meals do not need prep components.
- Chicken Enchiladas use `RED + CHIPOTLE`; fajitas/tacos/quesadillas stay direct.
- Grilled Cheese + Tomato Soup uses RED; the rest of the everyday breakfast/lunch set is intentionally direct/no-base.

These corrections are the reason research precedes live promotion.

## Shared pantry/technique research layers

The cuisine research is not 100 isolated recipes. Shared truth layers now cover:

- Chinese soy/oyster/Shaoxing/vinegar/velveting/wok logic;
- Indian MAKHANI/KORMA/GOLD/SAAG/tadka and raw-kidney-bean safety;
- Thai fish sauce/tamarind/palm sugar/coconut/NPP/THAI-R/herb logic;
- Malaysian kecap manis, belacan, coconut rice, kerisik, KARI/ASAM/SAMBAL and **Malaysian cooking caramel / kicap pekat** as distinct from kecap manis;
- Vietnamese fish sauce, fresh lemongrass, NUOC, nước màu, coconut water, pickles and vermicelli/bánh-mì assembly;
- Japanese DASHI/soy/mirin/sake/JP-CURRY/rice/karaage/shioyaki/yakisoba technique;
- Korean gochujang/doenjang/K-STOCK/kimchi/soy/sesame/gochugaru/dangmyeon/bibimbap logic;
- Middle Eastern/Mediterranean tahini/hummus/za'atar/sumac/kofta/falafel/couscous/halloumi logic;
- Italian/European pasta-water emulsions, Pecorino, guanciale, RED/DUX/CLEAR boundaries, aglio e olio and frittata technique;
- Mexican tortillas/fajita sear/taco meat/quesadilla/ranchero/beans/enchilada logic;
- everyday egg, toastie/melt, Caesar/BLT, tomato-soup, breakfast-burrito and meal-salad technique.

## Repo truth

Phase 2 research data lives under `apps/home-meals/data/phase2-*-v5.ts` plus the matching shared pantry/technique research files.

Wave-specific repo-native audits exist for Chinese, Indian, Thai, Malaysia/Singapore/Indonesia, Vietnamese, Japanese, Korean, Middle Eastern/Mediterranean, Italian/European, Mexican/Latin and Everyday research. `scripts/audit-phase2-completion-v5.cjs` validates the aggregate 100-recipe registry against the original 100-row plan, the four-serving contract, reference kcal/evidence/image-brief coverage and prep/pantry references.

**Home Meals intentionally does not use GitHub Actions.** The Home Meals workflow was removed, and the repo-native audit family contains a guard that fails if that workflow path is recreated.

## Current product boundary

- Existing live catalogue: **36 recipes**, now on the four-serving runtime policy.
- Phase 2 expansion: **100 / 100 formulation locked**.
- Phase 2 expansion live in Cook/Plan: **0 / 100**.
- Final images for the new 100: **not generated yet by design**.
- Household calibrated nutrition/taste: remains learned from real use.

## Next phase: Live Promotion

Research is no longer the bottleneck. The next controlled phase is to promote researched recipes into the actual Home Meals product in coherent batches:

1. bind/extend canonical ingredient IDs and aliases;
2. add deterministic grocery, pantry, prep and stock-consumption contracts;
3. bind allergens/safety/reference nutrition to product surfaces;
4. produce or source dish-faithful hero imagery from the locked image briefs;
5. promote recipes into Cook/Plan/Ask Home/history/readiness;
6. extend route/browser/mobile acceptance to the expanded catalogue;
7. validate repo-native audits/build and Railway deployment;
8. only then mark each recipe `LIVE`.

No additional recipe brainstorming is required before that work starts.
