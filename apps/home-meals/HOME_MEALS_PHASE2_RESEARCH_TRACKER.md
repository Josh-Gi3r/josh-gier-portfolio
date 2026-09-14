# Home Meals — Phase 2 Research Tracker

Status: **IN PROGRESS — 43/100 FORMULATION LOCKED**
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
- Formulation locked: **43 / 100**
- Live from Phase 2: **0 / 100**
- Household calibrated: **0 / 100**

## Wave tracker

| Wave | Scope | Planned | Locked | Live | Status |
|---|---|---:|---:|---:|---|
| 1A | Chinese pantry + techniques + Chinese recipes 1–10 | 10 | 10 | 0 | FORMULATION LOCKED · REBASED TO 4 |
| 1B | Chinese recipes 11–15 | 5 | 5 | 0 | FORMULATION LOCKED |
| 2 | Indian | 10 | 10 | 0 | FORMULATION LOCKED |
| 3A | Thai | 8 | 8 | 0 | FORMULATION LOCKED |
| 3B | Malaysia / Singapore / Indonesia | 10 | 10 | 0 | FORMULATION LOCKED |
| 3C | Vietnamese | 6 | 0 | 0 | IN PROGRESS |
| 4A | Japanese | 8 | 0 | 0 | PENDING |
| 4B | Korean | 8 | 0 | 0 | PENDING |
| 5A | Middle Eastern / Mediterranean | 8 | 0 | 0 | PENDING |
| 5B | Italian / European | 8 | 0 | 0 | PENDING |
| 5C | Mexican / Latin | 6 | 0 | 0 | PENDING |
| 6A | Everyday breakfast/lunch 1–10 | 10 | 0 | 0 | PENDING |
| 6B | Everyday breakfast/lunch 11–13 | 3 | 0 | 0 | PENDING |

## Accepted research — Chinese (15)

Mapo tofu; Kung pao chicken; Black pepper beef; Tomato & egg stir-fry; Char siu pork; Char siu chicken; Steamed fish with ginger & scallion; Ginger-scallion chicken; Sweet & sour chicken; Garlic aubergine; Dan dan noodles; Beef chow fun; Chicken chow mein; Egg fried rice; Salt & pepper prawns.

Accepted four-serving research lives in `data/phase2-chinese-recipes-v5.ts` and `data/phase2-chinese-wave1b-v5.ts`. Shared pantry/technique semantics live in `data/chinese-pantry-research-v4.ts`.

Material decisions include Dan Dan staying pantry-sauce rather than forcing DOUBAN; dry Cantonese chow fun/chow mein carrying explicit wok-capacity rules; fried rice being meal-scaled; and salt & pepper prawns remaining a dry no-base fry.

## Accepted research — Indian (10)

Butter chicken · murgh makhani; Paneer makhani; Dal tadka; Rajma masala · rajma chawal; Chicken korma; Chicken tikka masala; Keema matar; Palak paneer; Aloo gobi; Masala omelette.

Shared Indian semantics live in `data/indian-pantry-research-v5.ts`; formulations live in `data/phase2-indian-recipes-v5.ts`.

Material decisions include MAKHANI-only Butter Chicken/Paneer Makhani; KORMA-only Chicken Korma; GOLD+RED Chicken Tikka Masala instead of collapsing it into Butter Chicken; restrained GOLD in Dal/Palak/Aloo Gobi; explicit raw-kidney-bean safety in Rajma; and no-base Masala Omelette.

## Accepted research — Thai (8)

Pad Thai with prawns; Tom yum goong; Tom kha gai; Thai omelette · khai jiao; Chicken larb; Prik king tofu & green beans; Thai cashew chicken; Massaman chicken.

Shared Thai semantics live in `data/thai-pantry-research-v5.ts`; formulations live in `data/phase2-thai-recipes-v5.ts`.

Material decisions include direct pantry Pad Thai; NPP as the genuine nam-prik-pao mid for Tom Yum and Thai Cashew Chicken; direct galangal/lemongrass/makrut for Tom Kha rather than LE; dry-curry THAI-R Prik King without coconut milk; base-free larb with khao khua; and THAI-R + MASS Massaman.

## Accepted research — Malaysia / Singapore / Indonesia (10)

Nasi goreng kampung; Mee goreng mamak; Hainanese chicken rice; Ayam masak merah; Beef rendang; Ikan asam pedas; Kari ayam Malaysia; Nasi lemak · Home weeknight version; Chicken satay; Sambal sotong.

Shared semantics live in `data/malaysia-pantry-research-v5.ts`; four-serving formulations live in `data/phase2-malaysia-recipes-v5.ts`. Malaysian cooking caramel / kicap pekat is now represented separately from kecap manis in `data/pantry-foundations-v3.ts`.

Material decisions include:

- Nasi Goreng Kampung remains direct/pantry with belacan + ikan bilis + kangkung rather than forcing SAMBAL.
- Mee Goreng Mamak keeps its own chilli + dried-shrimp + dhal + peanut paste and uses Malaysian cooking caramel; no one-off freezer mid is created.
- Hainanese Chicken Rice corrects the initial plan: it **does not require CLEAR**. The whole chicken creates the fresh poaching liquor used for the rice and soup.
- Ayam Masak Merah uses **RED + SAMBAL** while preserving turmeric-browned chicken and fresh onion/ginger.
- Beef Rendang uses **RENDANG + LE** only; it does not double-charge REMPAH because RENDANG physically contains that parent. Kerisik and the tender-then-dry reduction remain dinner-specific.
- Ikan Asam Pedas uses **ASAM** plus dinner-time tamarind and fresh herbs.
- Kari Ayam Malaysia uses **KARI** plus chicken marinade, potatoes, onion, lemongrass, curry leaves and coconut at dinner.
- Nasi Lemak uses **SAMBAL** as its only prep dependency; coconut rice, ikan bilis, peanuts, egg and cucumber stay distinct.
- Chicken Satay remains no-base with a fresh aromatic marinade and separately cooked peanut sauce.
- Sambal Sotong uses **SAMBAL**, but all sauce reduction happens before squid is added for a brief finish.

## Current live-system serving rebase status

The serving-scale correction applies to the existing live system, not only future research:

- 36 live recipe truth records expose four servings;
- ingredient demand, shopping, readiness and ingredient consumption default to four servings;
- prep demand, readiness and FIFO consumption default to reviewed four-serving quantities;
- cook completion reconciles four-serving stock;
- recipe and cooking screens render four-serving runtime quantities;
- Ask Home receives the two-diners/four-serving/leftovers rule;
- explicit starch/side quantities were rebased;
- a 3-serving option remains supported by the deterministic scaling layer;
- old two-serving formulations remain provenance, not runtime quantity truth;
- repo-native audits protect the serving policy and intentionally fail if a Home Meals GitHub Actions workflow is recreated.

## Truth boundaries

- Do not convert grams to millilitres without an explicit measured conversion.
- Do not invent physical prep yields.
- Do not label reference kcal as calibrated household nutrition.
- Do not infer internal safety from appearance.
- Brand-sensitive sodium/allergen/nutrition values remain label-dependent.
- A pantry bottle is not promoted into a freezer component merely for architectural symmetry.
- A Home adaptation must be named as a Home adaptation.
- `FORMULATION_LOCKED` does not make a recipe selectable in Cook/Plan; live promotion requires catalogue/grocery/stock/safety/image integration and release acceptance.
- Home Meals intentionally does **not** use GitHub Actions. Validation uses repo-native audits/build logic and Railway deployment evidence.

## Next research batch — Wave 3C Vietnamese

1. Vietnamese lemongrass chicken
2. Bò lúc lắc · shaking beef
3. Thịt kho · caramel pork & eggs
4. Vietnamese caramel fish
5. Bún chả-style pork bowl
6. Chicken bánh mì

Shared research must lock Vietnamese fish sauce, caramel/sugar technique, fresh lemongrass, nước chấm architecture, quick high-heat beef, pork-braise coconut water, pickles/herbs/noodles and bánh mì assembly before individual recipe acceptance.

## Worklog

### 2026-09-14 — Serving correction

- Replaced the incorrect assumption that two diners means a two-serving cook.
- Introduced the default four-serving household policy with a supported three-serving smaller cook.
- Rebased live ingredient/grocery/prep/cook/UI/assistant paths without blindly doubling oils, seasonings or other nonlinear inputs.
- Added repo-native serving and food-system regression audits and a permanent guard that Home Meals GitHub Actions stay absent.

### 2026-09-14 — Phase 2 research progress

- Chinese Wave 1: **15/15 formulation locked**.
- Indian Wave 2: **10/10 formulation locked**, including Butter Chicken.
- Thai Wave 3A: **8/8 formulation locked**.
- Malaysia / Singapore / Indonesia Wave 3B: **10/10 formulation locked**.
- Progress: **43/100 FORMULATION LOCKED, 0/100 LIVE**.
