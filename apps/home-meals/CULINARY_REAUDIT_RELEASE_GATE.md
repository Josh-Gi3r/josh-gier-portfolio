# Home Meals — Culinary Re-audit Phase 1 Release Gate

Date: 2026-09-14

This marker closes the implementation/planning slice defined in `HOME_MEALS_CULINARY_REAUDIT_AND_100_RECIPE_PLAN.md` and intentionally triggers the normal Home Meals CI after the one-time migration workflow was removed.

Release acceptance requires this exact code line to pass:

- TypeScript;
- the complete `audit:data` chain, including `audit-culinary-reaudit-v3.cjs` and `audit-recipe-expansion-v3.cjs`;
- production Next.js build;
- Chromium Playwright acceptance;
- Railway deployment + healthcheck.

Phase 1 accepted scope on this line:

- 8 mothers + 26 mids + 7 boosters re-audited;
- 36 live dinners re-audited and corrected where needed;
- reference kcal/person + light/balanced/hearty/rich meal-weight data for all 36 live dinners;
- pantry foundations introduced as a first-class planning layer;
- exactly 100 future recipe directions planned, including Butter Chicken, Chinese breadth, breakfast/lunch/direct-meal breadth, no-base meals and pantry-sauce meals;
- planned future recipes remain out of the live catalogue until Phase 2 verifies their exact formulation, method, safety, nutrition and visuals.
