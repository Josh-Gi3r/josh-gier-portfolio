# Home Meals

Private, mobile-first home cooking system for Josh + G.

Home Meals connects the dinners they actually want to eat with reusable prep, Kitchen inventory, weekly planning, groceries, cooking guidance, household memory, camera and voice.

## Product model

Current food universe:

- **8 mothers**
- **26 mids**
- **7 boosters**
- **36 current dinners**

The app is not a generic recipe site. It is a shared kitchen notebook + smart fridge door + personal sous-chef with memory.

## Current runtime

The approved v3 UI is fully cut over to the **v12 household state** and current food-truth v2 model.

There is no active legacy v11 household sync runtime and no ml-only compatibility layer in current UI/catalogue arithmetic. Legacy migration/archive logic may read historical state, but it must never be reintroduced as current product truth.

The canonical non-visual food engine is exposed through:

```ts
@/data/food-v2-index
```

Key rules:

- food quantities are unit-aware: `g`, `ml`, or `count`;
- no implicit g ↔ ml conversions;
- `madeFrom` and `usedWith` are different relationships;
- made-from parents are consumed when the child prep is produced, not charged again at dinner;
- cooked prep does not receive an invented batch yield;
- the normal prep flow is **working-portion first**: make the formulation, divide/store useful standardized portions, and record how many portions were actually stored;
- exact canonical quantity stays underneath for planning/cooking arithmetic without forcing Josh/G to weigh an entire pot;
- nutrition remains unavailable until its ingredient/product, serving and retained-yield assumptions are sufficiently evidenced/calibrated;
- allergens and safety targets come from structured data, not AI guesses;
- camera may assess visible cooking state but may not certify internal meat/fish safety;
- Josh/G household observations are separate from research/source confidence.

See:

- `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`
- `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md`
- `HOME_MEALS_FOOD_ENGINE_V2.md`
- `HOME_MEALS_V2_INTEGRATION.md`
- `HOME_MEALS_CULINARY_VERIFICATION.md`
- `data/food-truth-v2.ts`
- `data/prep-formulations-v2.ts`
- `data/recipe-formulations-v2.ts`
- `data/household-v12.ts`

## Household truth and calibration

Research can lock formulations and technique. Only real household use can prove physical yield and taste preference.

Prep flow:

```text
make → cool/store safely → divide into useful working portions → confirm portions stored → Kitchen stock
```

If Josh/G choose to measure an actual output, that observation may be stored as household evidence. The product does not require a whole-pot weigh-in and never invents a physical yield from source recipes.

Dinner calibration can capture actual cook time, notes, Josh/G ratings and future household observations. Household calibration only advances from real observations, not from a research target.

## Kitchen, planning and cooking

Fresh Kitchen state is **unknown**, not silently empty. Josh/G can confirm an empty Kitchen in one action, start from zero and add what exists, or use Vision and confirm proposed changes.

The planner uses the same household truth as Kitchen and Cooking:

- active prep repertoire;
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

Deterministic engine owns:

- quantities and units;
- stock / FIFO;
- prep demand and shortages;
- shopping deltas;
- validated substitutions/variants;
- nutrition availability/arithmetic when evidence exists;
- allergens;
- safety targets;
- cook history, ratings and notes.

AI owns:

- natural-language understanding;
- explanation and ranking among valid options;
- ambiguous meal-planning trade-offs;
- conversational cooking guidance;
- conservative interpretation of camera results.

Straightforward arithmetic is precomputed and supplied to the model. Complex/ambiguous reasoning may use the configured higher-intelligence model. Realtime voice prioritizes low latency and delegates household-dependent work to the backend.

AI must never invent inventory, yield, calories/macros, allergens, expiry, food temperature or household history. State changes are proposals and require confirmation.

`store:false` on OpenAI requests is intentional for this private two-person household app; each request receives the deterministic household context it needs rather than relying on persisted model reasoning as household truth.

## Shared household persistence

Railway Postgres is the shared Josh + G household backend.

- private household session;
- optimistic versioning;
- explicit conflict handling;
- active-cooking remote-update deferral;
- failed-write recovery without silent state loss;
- local/session browser storage used only for migration/offline/session resilience, not as a second authoritative household database.

## Development and release gates

From `apps/home-meals`:

```bash
npm ci
npm run typecheck
npm run audit:data
npm run build
npm run test:e2e
```

`audit:data` runs catalogue, food-truth, food-system, intelligence, household-journey, private-AI, release-infrastructure, v3/v12 cutover and product-completion audits.

Home Meals CI uses Node 24, the committed npm lockfile, production build and Chromium Playwright acceptance. The browser suite covers the complete 136-route catalogue and all canonical responsive checkpoints on representative routes.

Production is Railway `home-meals-web` from `main`, root `apps/home-meals`, at `meals.josh-gier.com`.

## Completion boundary

Software is complete only when code, audits, browser acceptance, CI, Railway deployment and release documentation agree on the same accepted commit.

Remaining facts may be marked only as:

- **DEVICE** — behaviour that requires Josh/G's real phone/browser permissions or hardware;
- **HOUSEHOLD** — taste, actual observed prep yield/usable portions and long-term preferences that only real use can create.

Those are not values engineering should fabricate to make the app appear complete.
