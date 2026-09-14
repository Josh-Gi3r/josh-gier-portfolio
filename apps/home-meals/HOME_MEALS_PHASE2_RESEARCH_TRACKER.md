# Home Meals — Phase 2 Research Tracker

Status: **IN PROGRESS**
Started: 2026-09-14
Baseline: `42ebfcfe5852135a94bf29b1e956e07382299627`

This is the execution ledger for the 100-recipe expansion defined in `HOME_MEALS_CULINARY_REAUDIT_AND_100_RECIPE_PLAN.md` and `data/recipe-expansion-plan-v3.tsv`.

It does not replace the v2 food-truth contracts or the accepted v3/v12 product. Planned recipes remain non-live until they pass the Phase 2 promotion contract.

## Promotion contract

A candidate may move from `PLANNED` to `FORMULATION_LOCKED` only after:

- dish identity and adaptation status are explicit;
- current high-quality culinary references are recorded;
- a two-person formulation is explicit in g/ml/count where measurement is meaningful;
- mother/mid/booster use is justified rather than forced;
- pantry foundations are explicit and consistent with the shared cuisine system;
- cooking order, equipment, visual endpoints and common failure cues are recorded;
- relevant food-safety endpoints are explicit;
- reference kcal/person is recorded as an estimate, with exact/calibrated nutrition kept behind ingredient + measured-yield truth;
- allergens and substitutions are represented without pretending they are equivalent when they are not;
- grocery/ingredient identities are unambiguous;
- an image brief exists, but final imagery is not produced before formulation lock.

`FORMULATION_LOCKED` does **not** mean `LIVE`. Live promotion is a separate integration/release step.

## Batch operating rule

Default research batch: **up to 10 recipes**, while preserving cuisine/technique coherence. Never cross into the next cuisine wave merely to fill a quota.

## Wave tracker

| Wave | Scope | Planned | Locked | Live | Status |
|---|---|---:|---:|---:|---|
| 1A | Chinese pantry + techniques + Chinese recipes 1–10 | 10 | 0 | 0 | IN PROGRESS |
| 1B | Chinese recipes 11–15 | 5 | 0 | 0 | PENDING |
| 2 | Indian | 10 | 0 | 0 | PENDING |
| 3A | Thai | 8 | 0 | 0 | PENDING |
| 3B | Malaysia / Singapore / Indonesia | 10 | 0 | 0 | PENDING |
| 3C | Vietnamese | 6 | 0 | 0 | PENDING |
| 4A | Japanese | 8 | 0 | 0 | PENDING |
| 4B | Korean | 8 | 0 | 0 | PENDING |
| 5A | Middle Eastern / Mediterranean | 8 | 0 | 0 | PENDING |
| 5B | Italian / European | 8 | 0 | 0 | PENDING |
| 5C | Mexican / Latin | 6 | 0 | 0 | PENDING |
| 6A | Everyday breakfast/lunch 1–10 | 10 | 0 | 0 | PENDING |
| 6B | Everyday breakfast/lunch 11–13 | 3 | 0 | 0 | PENDING |

## Wave 1A candidate list

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

## Wave 1A shared research requirements

Before locking individual recipes, establish a consistent Chinese pantry/technique model for:

- Chinese light soy vs dark soy;
- oyster sauce;
- Shaoxing wine;
- toasted sesame oil;
- Chinkiang black vinegar vs white/red rice vinegar;
- hoisin;
- Pixian/la doubanjiang;
- chilli oil/crisp where used;
- meat slicing and velveting;
- staged high-heat wok cooking and overcrowding control;
- roast/glaze handling for char siu;
- steaming and hot-oil finishing;
- SFA household meat/poultry safety and existing Home Meals fish safety policy.

## Truth boundaries

- Do not convert grams to millilitres without an explicit measured conversion.
- Do not invent physical prep yields.
- Do not label recipe-blog nutrition as exact household nutrition.
- Do not infer internal safety from appearance.
- Brand-sensitive sodium/allergen/nutrition values remain label-dependent.
- A pantry bottle is not promoted into a freezer component merely for architectural symmetry.
- A Home adaptation must be named as a Home adaptation.

## Worklog

### 2026-09-14 — Phase 2 start

- Refreshed `main`; baseline remains `42ebfcfe5852135a94bf29b1e956e07382299627`.
- Began Wave 1A with the shared Chinese pantry/technique foundation before individual recipe locking.
- Initial source family: The Woks of Life Chinese pantry/ingredient glossaries and technique/recipe references; Made With Lau for Cantonese restaurant/home technique; SFA/USDA safety references where applicable.
