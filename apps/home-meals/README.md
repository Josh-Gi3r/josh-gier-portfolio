# Home Meals · Phase 1

Private mobile-first household food OS for Josh + G, intended for `meals.josh-gier.com`.

> Temporary source staging only. Home Meals is a separate project and this branch must never be merged into the portfolio. It will move to a dedicated `home-meals` repository before production deployment.

## Product architecture

Home Meals is built around a freezer-first physical cooking system rather than isolated recipes:

**Mother base → mid-base / direction → booster → fresh finisher → protein / vegetables / carb → cooking method**

The mother-base library is deliberately broad enough to support a long-running menu without becoming a collection of twenty near-duplicate sauces. Phase 1 targets eight genuinely distinct mother bases, a directional mid-base library, small booster cubes, and fresh finishers.

## What Phase 1 includes

- Full product shell: Home, Cook, Prep, Kitchen, Plan, Learn
- Persistent Ask Home UI with fixture-based household reasoning
- Recipe library, search/filter, recipe detail and functioning cooking stepper/timer
- Expanded mother-base + mid-base knowledge architecture
- Coded/interactive meal transformation, cube-scale and freezer infographics
- Kitchen inventory controls persisted to localStorage
- Weekly meal-plan swapping and derived demo shopping list
- Camera/photo upload experience with simulated vision results
- PWA metadata/manifest and responsive mobile navigation
- Placeholder visual system designed to be replaced by generated photography without redesign

## Phase 2 connection points

- OpenAI vision for fridge/freezer/receipt/prep interpretation
- Realtime voice for hands-free cooking
- Postgres persistence and household profiles
- Real inventory deduction, purchase history and consumption estimates
- Recipe versioning + separate Josh/G ratings
- Object storage policy for intentionally retained images

## Run

```bash
npm install
npm run dev
```
