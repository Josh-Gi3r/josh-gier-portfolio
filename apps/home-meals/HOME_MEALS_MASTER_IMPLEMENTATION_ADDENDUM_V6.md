# Home Meals — Master Implementation Addendum V6

Status: **CURRENT NUMERIC / PORTION / NUTRITION CONTRACT**
Date: 2026-09-15
Applies to: `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`, `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md`, and `HOME_MEALS_PRODUCT_SPEC.md`

This addendum is additive. It does not redesign Home Meals or replace the v3/v12 household product. It supersedes only stale quantity, prep-portion and nutrition wording that predates the V6 rebase.

## 1. Household cook scale

- Typical diners: **2**.
- Canonical default cook: **4 servings**.
- Supported smaller cook: **3 servings**.
- Normal default outcome: two portions eaten and two leftover portions.
- Four-serving formulations are researched as four-serving cooks. Strong seasoning, oil, acid, liquid, slurry and pan/wok geometry are not blindly doubled from older two-serving formulas.

## 2. Three different quantities must never be conflated

Every reusable prep object has three distinct quantity concepts:

1. **Production batch** — the sensible amount Josh + G make in one prep session.
2. **Storage packet / block / dose** — a practical stored unit, normally useful for one four-serving cook or a simple fraction/multiple where the food is genuinely concentrated.
3. **Exact recipe requirement** — the canonical `g`, `ml` or `count` a specific recipe consumes.

A storage packet is not an assumed batch yield. A silicone cavity's volume is not food mass. Grams and millilitres are never silently converted.

Human-facing examples may say:

- `1 GOLD meal packet · 240 g`
- `½ GOLD packet · 120 g`
- `2 CLEAR stock blocks · 800 ml`
- `1 THAI-G dose · 55 g`

Exact quantity remains the arithmetic truth underneath.

## 3. Production workflow

New prep production uses measured finished output:

> make a sensible household batch → cool/store safely → weigh or measure the actual finished output → divide into full V6 packets + labelled remainder → record exact Kitchen stock

Home must not infer finished yield from raw ingredients, source recipes or container volume.

The product may suggest a sensible target rotation such as three to five future cooks, but the actual number of packets comes from the measured finished output.

## 4. Packet hierarchy

The 41 prep objects remain a library/rotation, not a requirement to stock all 41 simultaneously.

Storage kinds are:

- `meal-packet`
- `stock-block`
- `booster-dose`
- `fridge-portion`
- `pantry-dose`

Small 15–60 g units are valid only where the prep is genuinely concentrated enough for a whole four-serving cook or a deliberate fraction of one. Mothers and substantial mids should not be represented as dozens of tiny cubes merely because a mould exists.

## 5. Current V6 acceptance

The deterministic V6 gate verifies:

- **41 / 41** prep packet policies;
- **41 / 41** prep energy methods;
- **136 / 136** recipe reference-energy records;
- **100 / 100** researched Phase 2 recipes operationally reconciled while remaining not-live;
- measured-output production;
- exact packet + remainder Kitchen stock;
- four-serving nutrition arithmetic;
- no GitHub Actions workflow for Home Meals.

At accepted V6 implementation `441e1e3ebec1b9d8c89ee790d5eaa8b24c454116`, the reference kcal range is **185–1455 kcal/person**. The highest-energy meals are surfaced rather than normalised toward a target. Reference nutrition is an estimate with provenance and uncertainty, not laboratory analysis.

## 6. Nutrition truth

Home Meals now has two nutrition levels.

### Reference nutrition

Available before household calibration when the recipe has a defensible reference path. Hierarchy:

1. exact product nutrition label when bound;
2. authoritative analysed/generic food-composition entry;
3. ingredient composition plus recipe/yield/retention methodology;
4. published finished-food proxy where raw-input summation is inappropriate;
5. documented fat-uptake/rendering/edible-yield assumptions for frying, draining or bone-in foods.

Reference nutrition carries provenance, confidence and uncertainty.

### Household-calibrated nutrition

A higher-truth state using the actual products Josh + G buy, actual measured finished prep output and relevant observed cooking losses/yields.

Measured finished prep output upgrades kcal density because Home can calculate:

> ingredient kcal → measured finished batch weight/volume → kcal per g/ml → kcal per storage packet → kcal contribution to each recipe

Stocks/broths and other extraction-sensitive foods may continue using analysed finished-food proxies where raw ingredient summation would be misleading.

## 7. Relationship and consumption truth remains unchanged

- `madeFrom` is a physical prep-production dependency.
- `usedWith` is a pairing, not a production dependency.
- parent prep consumed to make a child is charged when the child is produced, not again when the dinner consumes the child.
- planning, prep demand, Kitchen stock and cooking consume the same canonical quantities.

## 8. Phase 2 recipe boundary

The additional 100 recipes are **100 / 100 formulation-locked** at the four-serving policy and have V6 prep/nutrition operational overlays.

They remain **0 / 100 live** until Controlled Live Promotion binds each recipe into the production catalogue, grocery/stock/safety/allergen surfaces, imagery, routes, planning, Ask Home/history and browser acceptance.

Research completeness must never be mistaken for live-product completeness.

## 9. Release process

Home Meals does **not** use GitHub Actions.

Release evidence is repo-native and Railway based:

1. repo-native deterministic audits;
2. TypeScript;
3. Next.js production build;
4. browser/Playwright acceptance when the route surface changes;
5. Railway deployment of the exact accepted `main` SHA;
6. runtime health/status verification.

The absence of GitHub Actions is deliberate and protected by repository audits.

## 10. Superseded wording

This document supersedes:

- `HOME_MEALS_PRODUCT_SPEC.md` §3.4 where it says production is recorded by counting old working portions;
- `HOME_MEALS_PRODUCT_SPEC.md` §19 where reference nutrition is treated as unavailable until full household calibration;
- `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md` §1 where old working-portion-first production is described;
- `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md` §5 where all pre-calibration nutrition is treated as unavailable;
- older completion documents only to the extent they predate this V6 numeric rebase.

All unrelated product, design, privacy, sync, safety, camera, voice, accessibility and household-state requirements remain in force.
