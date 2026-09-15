# Home Meals — Integrated Food & Product Red-Team V8

**Status:** current integrated acceptance contract  
**Date:** 2026-09-15  
**Scope:** 41 prep objects + 136 live recipes = **177 food objects**, plus canonical ingredient identity, nutrition reference, planner/state and user-facing truth.

This pass is a reconciliation/red-team over the finished system, not a third rewrite of the food library. Existing culinary research and V6/V7 gates remain evidence; V8 asks whether those truths still agree when the entire live graph is connected.

## Accepted food architecture

- **7 core bases:** RED, BLOND, GOLD, SAMBAL, REMPAH, CLEAR, DARK.
- **1 optional foundation:** ONION, the deep caramelised-onion formulation.
- **26 mids & sauces.**
- **7 boosters.**
- **136 live recipes:** 36 foundation recipes + 100 promoted Phase 2 recipes.

ONION remains a valid formulation, route and future capability but is **not** a maintained core base. Ordinary fresh onion is used throughout the recipe catalogue; the optional object is specifically a long-cooked mahogany/jammy onion batch. V8 found no current live recipe that genuinely requires that prep profile, so Home must not force it into food merely to justify the graph.

## Household quantity contract

Production batch, finished output, storage packet and recipe requirement are distinct.

```text
cook sensible household formulation
→ cool/store safely
→ measure actual finished g/ml output
→ derive full V6 storage packets + exact remainder
→ record exact Kitchen stock
```

No source recipe, container size or raw ingredient sum is allowed to invent Josh/G's physical finished yield.

## Planning contract

Physical stock and maintenance intent are separate facts:

- **Have now** = what is physically in fridge/freezer.
- **Our prep** = what Josh/G want to maintain.

Week lifecycle is explicit: `unplanned → suggested → confirmed`.

The rich Home UI stays populated before confirmation, but labels those meals as **Idea for tonight / A week Home could build / Preview week**. Only a confirmed week becomes **Tonight / This week** and can drive Shop mode or Prep Day.

Planner basis is selectable: **Have now / Our prep / Both / Freely**. When the household permits extra prep, the planner may introduce at most one extra prep identity beyond the selected basis.

## Food corrections locked by V8

- Phase 2 ingredient aliases that represented the same physical ingredient were reconciled into canonical V7 identities rather than splitting household stock.
- Live V6 energy calculation now carries ingredient `basis` and notes into the resolver, preventing fresh noodles from being costed as dry noodles.
- Butter Chicken, Chicken Korma and Chicken Tikka Masala consume the existing measured **GG** booster instead of shopping a parallel ginger-garlic-paste identity.
- Massaman Beef's underlying two-serving foundation was corrected so the V4 four-serving runtime no longer doubles an already meal-scale quantity. Its four-serving runtime now targets roughly 700 g beef + 400 ml coconut milk, with rice as part of the meal.
- Beef Rendang was rebalanced after multi-source review: V8 uses 700 g beef, 300 ml coconut milk and 60 g kerisik for four while retaining measured RENDANG + LE and the dry reduction endpoint.
- Thịt kho uses 750 g pork for four, matching the reviewed Vietnamese per-person range.
- Malaysian kari ayam uses a meal-scale 750 g chicken batch and a restrained coconut quantity.
- Hainanese Chicken Rice keeps the whole-bird technique but uses 320 g dry rice for four rather than 400 g.

Additional high-end checks used Rasa Malaysia and Nyonya Cooking for rendang, RecipeTin Eats for Massaman Curry, and Hungry Huy for thịt kho. Rich dishes remain rich; V8 uses outlier review to find modelling/formulation errors rather than forcing food into a calorie target.

## Machine-readable acceptance

`data/integrated-food-redteam-v8.ts` produces one ledger row per food object. Release acceptance requires zero `RESEARCH_AGAIN` rows.

`scripts/audit-integrated-redteam-v8.cjs` gates 41/41 prep objects, 136/136 live recipes, 177/177 ledger rows, 373 canonical ingredient identities, zero identity collisions, zero parent/child prep double-charges, exactly ONION as the zero-live-consumer optional foundation, 7 core bases, 15/15 current numeric extremes reviewed, measured-output semantics, the week lifecycle, separated Have now / Our prep, the image-led Prep library and the absence of Home Meals GitHub Actions.

## Release gate

From `apps/home-meals`:

```bash
npm ci
npm run typecheck
npm run audit:data
npm run build
npm run test:e2e
```

The browser gate covers the full 136-recipe live catalogue, all recipe and cooking routes, prep routes, core responsive widths, lifecycle truth and two-device sync/recovery. Production closure requires Railway to report success for the exact accepted `main` SHA.

The only acceptable remaining unknowns after software release are **DEVICE** facts (real phone permissions/hardware) and **HOUSEHOLD** facts (actual products, measured cooked outputs, taste/rating history). Home records those facts when observed; it never fabricates them.
