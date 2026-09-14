# Home Meals — Phase 2 Research Tracker

Status: **IN PROGRESS — 10/100 FORMULATION LOCKED**
Started: 2026-09-14
Baseline: `42ebfcfe5852135a94bf29b1e956e07382299627`
Latest accepted research head before this tracker-only update: `0fcbcbc61901cd5d3a49145020044f763e95b91f`

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

## Overall progress

- Planned expansion: **100**
- Formulation locked: **10 / 100**
- Live from Phase 2: **0 / 100**
- Household calibrated: **0 / 100**

## Wave tracker

| Wave | Scope | Planned | Locked | Live | Status |
|---|---|---:|---:|---:|---|
| 1A | Chinese pantry + techniques + Chinese recipes 1–10 | 10 | 10 | 0 | FORMULATION LOCKED · CI + RAILWAY GREEN |
| 1B | Chinese recipes 11–15 | 5 | 0 | 0 | NEXT |
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

## Wave 1A accepted recipes

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

The formulation-locked records live in `data/phase2-chinese-recipes-v4.ts`. They are research truth, not yet live catalogue records.

## Wave 1A shared Chinese pantry / technique foundation

`data/chinese-pantry-research-v4.ts` establishes one shared research model for:

- Chinese light soy vs dark soy;
- oyster sauce;
- Shaoxing wine;
- toasted sesame oil;
- Chinkiang black vinegar vs white/rice vinegar;
- hoisin;
- Pixian/la doubanjiang;
- chilli oil/crisp;
- staged high-heat wok cooking;
- meat slicing/recipe-specific velveting;
- char-siu roast/glaze hygiene;
- fish steaming and hot-oil finishing;
- Home Meals safety endpoints.

Material planning corrections from the shared research are represented in the locked recipe objects rather than silently preserving the original brainstorm:

- Mapo tofu no longer carries generic light-soy/dark-soy/Chinkiang assumptions; its identity is centred on DOUBAN/Pixian doubanjiang, Sichuan pepper and chilli.
- Kung pao uses rice vinegar in the locked formulation rather than automatically using Chinkiang.
- Tomato & egg remains genuinely no-base and does not get generic soy sauce added merely because it is Chinese.
- Ginger-scallion chicken is locked as a gentle Cantonese-style poached chicken that makes meaningful use of the existing GS-OIL mid.
- Sweet & sour chicken and garlic aubergine use the appropriate rice/red-rice-vinegar lane rather than generic Chinkiang substitution.
- CHAR-SIU remains a reusable mid for pork and chicken, with raw-contact marinade/glaze safety explicitly controlled.

## Truth boundaries

- Do not convert grams to millilitres without an explicit measured conversion.
- Do not invent physical prep yields.
- Do not label recipe-blog nutrition as exact household nutrition.
- Do not infer internal safety from appearance.
- Brand-sensitive sodium/allergen/nutrition values remain label-dependent.
- A pantry bottle is not promoted into a freezer component merely for architectural symmetry.
- A Home adaptation must be named as a Home adaptation.
- `FORMULATION_LOCKED` does not make a recipe selectable in Cook/Plan; live promotion requires its own catalogue/grocery/stock/safety/image integration and release acceptance.

## Next research batch — Wave 1B

1. Dan dan noodles
2. Beef chow fun
3. Chicken chow mein
4. Egg fried rice
5. Salt & pepper prawns

Wave 1B should reuse the Chinese pantry/technique foundation, extending it only where the next five introduce genuinely new shared truth.

## Worklog

### 2026-09-14 — Phase 2 start

- Refreshed `main`; baseline was `42ebfcfe5852135a94bf29b1e956e07382299627`.
- Began Wave 1A with the shared Chinese pantry/technique foundation before individual recipe locking.
- Initial source family: The Woks of Life Chinese pantry/ingredient glossaries and technique/recipe references; Made With Lau for Cantonese restaurant/home technique; SFA/USDA safety references where applicable.

### 2026-09-14 — Wave 1A formulation lock

- Added `data/chinese-pantry-research-v4.ts` with 10 researched shared pantry records plus Chinese technique rules.
- Added `data/phase2-chinese-recipes-v4.ts` with exact two-person formulations, prep/pantry relationships, cooking endpoints, safety targets, allergens, substitutions, reference kcal/person, provenance and image briefs for the first 10 Chinese recipes.
- Added permanent `scripts/audit-phase2-chinese-v4.cjs` regression coverage and included it in `npm run audit:data`.
- Kept the 10 recipes out of the live catalogue; research truth is deliberately separated from live promotion.
- Accepted research head `0fcbcbc61901cd5d3a49145020044f763e95b91f`: Home Meals CI passed typecheck, all data/food/Phase-2 audits, production build and full Chromium browser acceptance; Railway deployment status was SUCCESS.
- Wave 1A is therefore accepted as **10/10 FORMULATION LOCKED, 0/10 LIVE**.
