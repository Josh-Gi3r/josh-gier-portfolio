# Home Meals

Private, mobile-first home cooking system for Josh + G.

Home Meals connects the dinners they actually want to eat with reusable prep, Kitchen inventory, weekly planning, groceries, cooking guidance and household memory.

## Product model

Current food universe:

- **8 mothers**
- **26 mids**
- **7 boosters**
- **36 current dinners**

The app is not a generic recipe site. It is a shared kitchen notebook + smart fridge door + personal sous-chef with memory.

## Food truth v2

The canonical non-visual food engine now lives behind:

```ts
@/data/food-v2-index
```

Key rules:

- food quantities are unit-aware: `g`, `ml`, or `count`;
- no implicit g ↔ ml conversions;
- `madeFrom`, `usedWith`, and `unlocks` are different relationships;
- made-from parents are consumed when the child prep is produced, not charged again at dinner;
- cooked prep does not receive an invented batch yield;
- a batch becomes Kitchen stock only after its actual finished output is weighed/measured;
- nutrition is deterministic and remains unavailable when ingredient/product bindings or measured component density are missing;
- allergens and safety targets come from structured data, not AI guesses;
- camera may assess visual cooking state but may not certify internal meat/fish safety;
- Josh/G household observations are separate from research/source confidence.

See:

- `HOME_MEALS_FOOD_ENGINE_V2.md`
- `HOME_MEALS_V2_INTEGRATION.md`
- `data/food-truth-v2.ts`
- `data/prep-formulations-v2.ts`
- `data/recipe-formulations-v2.ts`
- `data/household-v12.ts`

## Frontend transition

The current visible UI still mounts the legacy v11 provider while the separate UI/UX track is being rebuilt. A parallel unit-safe v12 provider and sync layer are already implemented.

Do **not** write gram-based v2 values into the old v11 ml-only component store.

Frontend cutover happens only after Kitchen, Prep, Plan, Cook and confirmation surfaces consume the new quantity/view-model contracts. The migration is deliberately conservative: old ml-only component stock and ambiguous legacy ingredient stock are archived for reconciliation rather than silently converted.

## Household calibration

Research can lock formulations and technique. Only the actual kitchen can prove physical yield and household preference.

Batch flow:

```text
make → cool safely → weigh/measure → confirm → log exact batch stock
```

Dinner calibration can capture actual cook time, finished weight, plate weights, leftovers and Josh/G ratings. A component may be considered household-calibrated only from repeated actual observations, not from a research target.

## Deterministic vs AI responsibility

Deterministic engine owns:

- quantities and units;
- stock / FIFO;
- prep demand and shortages;
- shopping deltas;
- validated substitutions/variants;
- nutrition arithmetic;
- allergens;
- safety temperatures;
- cook history and household ratings.

AI owns:

- natural-language understanding;
- explanation and ranking among valid options;
- conversational cooking guidance;
- conservative interpretation of camera results;
- combining household preferences with structured truth.

AI must never invent inventory, yield, calories/macros, allergens, expiry, food temperature or household history.

## Development

From `apps/home-meals`:

```bash
npm install
npm run typecheck
npm run audit:data
npm run build
```

`audit:data` includes the legacy regression audit plus the v2 food-truth and full food-system audits.

A dedicated GitHub Actions workflow runs typecheck, data audits and the production build for Home Meals changes.
