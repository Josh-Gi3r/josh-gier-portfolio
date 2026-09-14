# Home Meals — Phase 2 Research Tracker

Status: **IN PROGRESS — 25/100 FORMULATION LOCKED**
Started: 2026-09-14
Baseline before serving correction: `42ebfcfe5852135a94bf29b1e956e07382299627`

This is the execution ledger for the 100-recipe expansion defined in `HOME_MEALS_CULINARY_REAUDIT_AND_100_RECIPE_PLAN.md` and `data/recipe-expansion-plan-v3.tsv`.

It does not replace the accepted v3/v12 product. Planned recipes remain non-live until they pass the Phase 2 promotion contract.

## Household cook-scale rule

- Typical diners: **2**.
- Canonical default cook batch: **4 servings**.
- Supported smaller cook: **3 servings**.
- Normal default outcome: two portions eaten + two leftover portions.
- Old two-serving formulation records are retained only as research/provenance where needed. Runtime recipe, grocery, prep-readiness and stock-consumption truth must use the four-serving policy.
- Scaling is not a blind 2× multiplier. Bulk protein/starch/vegetables usually scale close to linearly; oils, strong seasonings, aromatics, slurry/liquid and wok technique are reviewed separately.
- Crowded wok recipes must be cooked in multiple physical batches when required even though the ingredient contract represents one four-serving household cook.

## Promotion contract

A candidate may move from `PLANNED` to `FORMULATION_LOCKED` only after:

- dish identity and adaptation status are explicit;
- current high-quality culinary references are recorded;
- a **four-serving default formulation** is explicit in g/ml/count where measurement is meaningful, with 3-serving support where appropriate;
- mother/mid/booster use is justified rather than forced;
- pantry foundations are explicit and consistent with the shared cuisine system;
- cooking order, equipment, visual endpoints and common failure cues are recorded;
- relevant food-safety endpoints are explicit;
- reference kcal/person is recorded as an estimate, with exact/calibrated nutrition kept behind ingredient + measured-yield truth;
- allergens and substitutions are represented without pretending they are equivalent when they are not;
- grocery/ingredient identities are unambiguous;
- batch-capacity constraints are explicit for wok/roast/steam methods when four servings materially change technique;
- an image brief exists, but final imagery is not produced before formulation lock.

`FORMULATION_LOCKED` does **not** mean `LIVE`. Live promotion is a separate integration/release step.

## Batch operating rule

Default research batch: **up to 10 recipes**, while preserving cuisine/technique coherence. Never cross into the next cuisine wave merely to fill a quota.

## Overall progress

- Planned expansion: **100**
- Formulation locked: **25 / 100**
- Live from Phase 2: **0 / 100**
- Household calibrated: **0 / 100**

## Wave tracker

| Wave | Scope | Planned | Locked | Live | Status |
|---|---|---:|---:|---:|---|
| 1A | Chinese pantry + techniques + Chinese recipes 1–10 | 10 | 10 | 0 | FORMULATION LOCKED · REBASED TO 4 |
| 1B | Chinese recipes 11–15 | 5 | 5 | 0 | FORMULATION LOCKED |
| 2 | Indian | 10 | 10 | 0 | FORMULATION LOCKED |
| 3A | Thai | 8 | 0 | 0 | IN PROGRESS |
| 3B | Malaysia / Singapore / Indonesia | 10 | 0 | 0 | PENDING |
| 3C | Vietnamese | 6 | 0 | 0 | PENDING |
| 4A | Japanese | 8 | 0 | 0 | PENDING |
| 4B | Korean | 8 | 0 | 0 | PENDING |
| 5A | Middle Eastern / Mediterranean | 8 | 0 | 0 | PENDING |
| 5B | Italian / European | 8 | 0 | 0 | PENDING |
| 5C | Mexican / Latin | 6 | 0 | 0 | PENDING |
| 6A | Everyday breakfast/lunch 1–10 | 10 | 0 | 0 | PENDING |
| 6B | Everyday breakfast/lunch 11–13 | 3 | 0 | 0 | PENDING |

## Wave 1 Chinese accepted recipes

1. Mapo tofu
2. Kung pao chicken
3. Black pepper beef
4. Tomato & egg stir-fry
5. Char siu pork
6. Char siu chicken
7. Steamed fish with ginger & scallion
8. Ginger-scallion chicken
9. Sweet & sour chicken
10. Garlic aubergine
11. Dan dan noodles
12. Beef chow fun
13. Chicken chow mein
14. Egg fried rice
15. Salt & pepper prawns

Wave 1A source research originated in `data/phase2-chinese-recipes-v4.ts`; the accepted four-serving research view is `data/phase2-chinese-recipes-v5.ts`. Wave 1B lives in `data/phase2-chinese-wave1b-v5.ts`. All 15 remain research truth rather than live catalogue objects.

## Wave 2 Indian accepted recipes

1. Butter chicken · murgh makhani
2. Paneer makhani
3. Dal tadka
4. Rajma masala · rajma chawal
5. Chicken korma
6. Chicken tikka masala
7. Keema matar
8. Palak paneer
9. Aloo gobi
10. Masala omelette

The shared Indian component/pantry semantics live in `data/indian-pantry-research-v5.ts`; the ten four-serving formulations live in `data/phase2-indian-recipes-v5.ts`.

Material research corrections are explicit:

- Butter Chicken uses standalone **MAKHANI only** and does not inherit GOLD.
- Paneer Makhani also uses MAKHANI without adding an onion-tomato base.
- North Indian Chicken Korma uses **KORMA only** and remains tomato-free at the prep layer.
- Chicken Tikka Masala does **not** use MAKHANI. It uses a smaller GOLD dose plus neutral RED to preserve its onion-forward, more textured identity rather than collapsing into Butter Chicken.
- Dal Tadka uses a restrained GOLD shortcut and still requires a fresh tadka.
- Rajma carries explicit dried-kidney-bean safety; a low-temperature slow cooker is not accepted as the only raw-bean cooking step.
- Palak Paneer is spinach-led with SAAG plus only a restrained GOLD support.
- Aloo Gobi is dry/semi-dry and receives only a small late GOLD shortcut after the potato has largely softened.
- Masala Omelette remains genuinely no-base and is cooked as multiple omelettes rather than one overcrowded eight-egg slab.

## Shared cuisine foundations

`data/chinese-pantry-research-v4.ts` establishes the Chinese soy/vinegar/wine/oyster/chilli-oil/doubanjiang and wok/velveting/roast/steam rules.

`data/indian-pantry-research-v5.ts` establishes MAKHANI/KORMA/GOLD/SAAG boundaries, kasuri methi, garam masala, fresh tadka, paneer handling and raw kidney-bean safety.

## Truth boundaries

- Do not convert grams to millilitres without an explicit measured conversion.
- Do not invent physical prep yields.
- Do not label reference kcal as calibrated household nutrition.
- Do not infer internal safety from appearance.
- Brand-sensitive sodium/allergen/nutrition values remain label-dependent.
- A pantry bottle is not promoted into a freezer component merely for architectural symmetry.
- A Home adaptation must be named as a Home adaptation.
- `FORMULATION_LOCKED` does not make a recipe selectable in Cook/Plan; live promotion requires its own catalogue/grocery/stock/safety/image integration and release acceptance.
- Home Meals intentionally does **not** use GitHub Actions. Validation uses repo-native audits/build logic and Railway deployment evidence.

## Current live-system serving rebase status

The serving-scale correction has been applied to the existing live system rather than only future research:

- 36 live recipe truth records expose four servings;
- ingredient demand, shopping, readiness and ingredient consumption default to four servings;
- prep demand, readiness and FIFO consumption default to reviewed four-serving quantities;
- cook completion reconciles four-serving stock;
- recipe and cooking screens render four-serving runtime quantities;
- Ask Home receives the two-diners/four-serving/leftovers rule;
- explicit starch/side quantities were rebased;
- a 3-serving option remains supported by the deterministic scaling layer;
- legacy two-serving formulations remain provenance, not runtime quantity truth;
- repo-native audits fail if live runtime truth regresses to two servings or if a Home Meals GitHub Actions workflow is recreated.

## Next research batch — Wave 3A Thai

1. Pad Thai with prawns
2. Tom yum goong
3. Tom kha gai
4. Thai omelette · khai jiao
5. Chicken larb
6. Prik king tofu & green beans
7. Thai cashew chicken
8. Massaman chicken

Wave 3A starts by locking a coherent Thai pantry/technique system around fish sauce, tamarind, palm sugar, coconut milk, curry paste, makrut lime, Thai basil/holy basil, toasted rice powder, dried shrimp/peanuts and high-heat wok/noodle handling before individual recipe acceptance.

## Worklog

### 2026-09-14 — Phase 2 start

- Began with shared cuisine foundations before individual recipe locking.
- Source families include specialist Chinese/Indian cooking references plus official SFA/FDA/USDA safety evidence where applicable.

### 2026-09-14 — Serving correction

- Replaced the incorrect assumption that two diners means a two-serving cook.
- Introduced the default four-serving household policy with a supported three-serving smaller cook.
- Rebased live ingredient/grocery/prep/cook/UI/assistant quantity paths without blindly doubling oils, seasonings or other nonlinear inputs.
- Retained old two-serving records as provenance so prior culinary research remains inspectable rather than being silently rewritten.
- Added repo-native serving and food-system regression audits and an explicit guard that Home Meals GitHub Actions stay absent.

### 2026-09-14 — Chinese Wave 1 completion

- Rebased recipes 1–10 to four-serving research truth with capacity guidance.
- Researched and locked recipes 11–15 directly at four servings.
- Added the Chinese v5 audit covering all 15 planned Chinese recipes, source/kcal/method/pantry contracts and the no-GitHub-Actions rule.

### 2026-09-14 — Indian Wave 2 completion

- Added shared MAKHANI/KORMA/GOLD/SAAG/tadka/kidney-bean research rules.
- Researched all 10 Indian candidates directly as four-serving household formulations.
- Added a permanent Indian v5 audit that protects Butter Chicken, the Butter Chicken vs Tikka Masala architecture, KORMA identity, raw kidney-bean safety and no-base Masala Omelette.
- Progress moved to **25/100 FORMULATION LOCKED, 0/100 LIVE**.
