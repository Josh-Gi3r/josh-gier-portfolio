# Home Meals

Private, mobile-first home cooking system for Josh + G.

Home Meals connects the dinners they actually want to eat with reusable prep, Kitchen inventory, weekly planning, groceries, cooking guidance, household memory, camera and voice.

## Product model

Current live food universe:

- **7 core bases**
- **1 optional caramelised-onion foundation (ONION)**
- **26 mids & sauces**
- **7 boosters**
- **136 live recipes**: the original 36 plus all 100 Phase 2 recipes

The app is not a generic recipe site. It is a shared kitchen notebook + smart fridge door + personal sous-chef with memory.

## Current runtime

The approved v3 UI is fully cut over to the **v12 household state** and the current unit-aware food system.

There is no active legacy v11 household sync runtime and no ml-only compatibility layer in current UI/catalogue arithmetic. Legacy migration/archive logic may read historical state, but it must never be reintroduced as current product truth.

The current numeric contract is defined by `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V6.md`.

Key rules:

- food quantities are unit-aware: `g`, `ml`, or `count`;
- no implicit g ↔ ml conversions;
- `madeFrom` and `usedWith` are different relationships;
- made-from parents are consumed when the child prep is produced, not charged again at dinner;
- cooked prep does not receive an invented batch yield;
- **production batch, storage packet and exact recipe requirement are three different quantities**;
- new prep production is recorded from **actual measured finished output**, then split into full V6 storage packets plus an exact remainder;
- container capacity is only a fit guide and never establishes food mass;
- a small freezer dose is used only where the food is genuinely concentrated enough for a normal four-serving cook or a deliberate fraction of one;
- planning, groceries, prep and cooking all consume the same exact canonical recipe quantities;
- reference nutrition may be shown when it has a defensible methodology/provenance path, but it is not labelled household-calibrated nutrition;
- allergens and safety targets come from structured data, not AI guesses;
- camera may assess visible cooking state but may not certify internal meat/fish safety;
- Josh/G household observations are separate from research/source confidence.

Reading order:

1. `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`
2. `HOME_MEALS_PRODUCT_SPEC.md`
3. `HOME_MEALS_INTEGRATED_REDTEAM_V8.md` — current integrated food/product acceptance
4. `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md`
5. `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V6.md` — supersedes stale quantity/portion/nutrition wording only
6. `HOME_MEALS_PORTION_NUTRITION_REBASE_V6.md`
7. `HOME_MEALS_PHASE2_RESEARCH_COMPLETION_V5.md`
8. `HOME_MEALS_CULINARY_VERIFICATION.md`

Implementation authority includes:

- `data/food-truth-v2.ts`
- `data/prep-formulations-v2.ts`
- `data/recipe-formulations-v2.ts`
- `data/prep-portioning-v6.ts`
- `data/prep-energy-v6.ts`
- `data/recipe-energy-v6.ts`
- `data/phase2-operational-v6.ts`
- `data/household-v12.ts`

## Household truth and calibration

Research can lock formulations and technique. Only real household use can prove physical finished yield and taste preference.

Prep flow:

```text
make sensible household batch
→ cool/store safely
→ weigh or measure actual finished output
→ divide into full storage packets + labelled remainder
→ record exact Kitchen stock
```

For normal sauces/pastes, measured finished output can later upgrade the energy density of that household batch. Stocks/broths and other extraction-sensitive foods may continue to use analysed finished-food proxies where raw ingredient summation would be misleading.

Dinner calibration can capture actual cook time, notes, Josh/G ratings and future household observations. Household calibration only advances from real observations, not from a research target.

## Nutrition

Home Meals distinguishes two levels:

- **Reference nutrition** — methodology-based estimate from product labels, authoritative food-composition data, recipe calculation, yield/retention factors or documented proxies. It carries confidence/uncertainty.
- **Household-calibrated nutrition** — higher-truth nutrition using Josh/G's actual products, measured finished prep output and relevant observed cooking losses/yields.

The current V6 graph covers **41 / 41 prep objects and 136 / 136 recipe energy references**. Reference values are useful for meal planning but are not laboratory analysis.

## Kitchen, planning and cooking

Fresh Kitchen state is **unknown**, not silently empty. Josh/G can confirm an empty Kitchen in one action, start from zero and add what exists, or use Vision and confirm proposed changes.

The planner uses the same household truth as Kitchen and Cooking:

- physical prep stock (“Have now”);
- active prep maintenance repertoire (“Our prep”);
- planning basis: stock / repertoire / both / free;
- explicit week lifecycle: preview → suggested → confirmed;
- exact known stock;
- qualitative pantry state;
- use-soon food;
- recent meal history;
- cuisine repetition;
- favourites and separate Josh/G ratings;
- weekday cooking effort;
- prep reuse and useful repertoire expansion.

Cooking consumes the same exact quantities used by planning. A failed stock reconciliation never silently becomes a partial deduction; a deliberate history-only log is a separate explicit path.

## Ask Home, Vision and Voice

Deterministic engine owns quantities, units, stock/FIFO, prep demand, shopping deltas, validated substitutions, reference/calibrated nutrition arithmetic, allergens, safety targets, cook history, ratings and notes.

AI owns natural-language understanding, explanation/ranking among valid options, ambiguous meal-planning trade-offs, conversational cooking guidance and conservative interpretation of camera results.

Straightforward arithmetic is precomputed and supplied to the model. State changes are proposals and require confirmation. AI must never invent inventory, physical yield, calibrated nutrition, allergens, expiry, food temperature or household history.

## Shared household persistence

Railway Postgres is the shared Josh + G household backend with:

- private household session;
- optimistic versioning;
- explicit conflict handling;
- active-cooking remote-update deferral;
- failed-write recovery without silent state loss;
- local/session browser storage only for migration/offline/session resilience, not as a second authoritative household database.

## Development and release gates

From `apps/home-meals`:

```bash
npm ci
npm run typecheck
npm run audit:data
npm run build
npm run test:e2e
```

Home Meals intentionally uses **no GitHub Actions**. The absence of the Home Meals workflow is regression-gated.

`audit:data` includes the catalogue, food-truth, food-system, intelligence, household journey/API/privacy/sync, culinary/Phase 2, V6 portion/nutrition, V7 live promotion, the V8 177-object integrated red-team, release infrastructure, v3/v12 cutover and product-completion gates.

Browser/Playwright acceptance remains the route/responsive regression surface when route/product coverage changes. Production is Railway `home-meals-web` from `main`, root `apps/home-meals`, at `meals.josh-gier.com`.

## Completion boundary

The V8 integrated release is complete only when repo-native audits, TypeScript, the production build, browser acceptance and Railway deployment agree on the same accepted `main` SHA. All 100 Phase 2 recipes have passed the controlled promotion gate and are live.

Remaining non-software facts may be marked only as:

- **DEVICE** — behaviour requiring Josh/G's real phone/browser permissions or hardware;
- **HOUSEHOLD** — taste, actual observed prep yield, actual household products and long-term preferences only real use can create.

Engineering must capture those facts cleanly rather than fabricate them.
