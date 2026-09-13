# Home Meals v2 frontend integration handoff

This file is for the UI/UX implementation track. It intentionally describes **data contracts and migration states**, not visual design.

## Do not use legacy quantity assumptions in new UI

New screens must not read `portionMl`, `batchYield`, `outputMl`, `remainingMl`, `neededMl`, `shortMl` or `parentMotherIds` as food truth.

Use the v2 export surface:

```ts
import { ... } from "@/data/food-v2-index";
```

Canonical prep stock is `Quantity`:

```ts
{ qty: 180, unit: "g" }
{ qty: 450, unit: "ml" }
```

Never convert g to ml for display or arithmetic.

## Provider cutover

Current production UI still mounts `HouseholdStateProvider` because existing screens are written against the v11 numeric/ml contract.

A parallel `HouseholdStateV12Provider` already exists. Cut over only after the consuming screens have been migrated.

Recommended cutover order:

1. Kitchen
2. Prep
3. Prep Day
4. Plan / groceries
5. Recipe / Cook / Cooking
6. Home readiness surfaces
7. Ask Home / Scan confirmations
8. Household sync
9. Replace provider in `app/layout.tsx`

This order avoids a partially migrated app writing grams into an old ml-only store.

## Migration state

When v11 data exists:

- ratings, notes, recipe versions, history and favourites are preserved;
- legacy component stock is archived, not silently converted;
- legacy prep batches are archived, not silently converted;
- legacy ingredient quantities are archived, not silently reinterpreted;
- canonical v12 stock starts at zero until Josh/G recount or measure it;
- show the migration warnings as a simple Kitchen reconciliation task.

Never label archived quantities as current stock.

## Prep component presentation

Use `prepComponentViewV2()` or equivalent DTOs.

The view should display the canonical quantity/unit exactly. Examples:

- `GOLD · 180 g`
- `CLEAR · 450 ml`
- `JP-CURRY · 75 g`

Do not display an invented `14 portions` after prep. A batch becomes stock only after its real cooled output is weighed/measured.

### Prep Day completion

Required flow:

1. cook to the structured cue;
2. cool safely;
3. weigh/measure the finished preparation;
4. user enters observed output;
5. confirm;
6. `createMeasuredPrepBatchV2()` / v12 state logs that output.

For child prep such as LAKSA, the production transaction consumes its explicit `madeFrom` parent input at child-production time. Dinner does not charge the parent again.

## Recipes

`canonicalDinnerFormulationsV2` is the quantitative two-person recipe layer.

It contains exact formulation quantities, prep dependencies, equipment and structured cooking steps. Fields such as `actualFinishedWeightG`, `actualServings` and `actualCookMinutes` deliberately remain null until observed in the household.

Use `recipeVariantsV2` for explicit choices such as:

- no rice / half rice;
- chicken vs beef/pork branches;
- lettuce-wrap bulgogi;
- alcohol-free cacciatore/ragù;
- potatoes vs pasta;
- tortillas vs rice.

Do not render legacy strings such as `chicken or beef` as one nutrition-bearing choice.

## Kitchen / groceries

Use `ingredient-engine-v2.ts` for:

- exact ingredient demand;
- recipe availability;
- shopping shortfall;
- exact consumption after cooking.

Water is excluded from shopping. Canonical ingredient forms with different units remain separate stock identities; the app never invents mass-volume conversions.

## Nutrition

Do not expose provisional research calorie numbers as final household truth.

The deterministic nutrition engine requires:

1. ingredient nutrient binding (FDC or manufacturer label);
2. actual measured component output for cooked prep;
3. component nutrient density;
4. recipe direct ingredients + prep usage + chosen variant.

If a dependency is missing, show nutrition as unavailable/pending rather than asking AI to estimate it.

Strained stocks such as CLEAR/DARK/DASHI/K-STOCK require an analyzed finished-food proxy rather than naïvely summing nutrients from discarded bones/aromatics.

## Safety / camera

Safety targets come from `food-safety-v2.ts`.

Vision may assess:

- browning;
- reduction;
- oil separation;
- surface caramelisation;
- obvious scorching.

Vision must not certify internal meat/fish safety. Where applicable the cooking UI should pair a visual cue with a thermometer target.

## Ask Home

Ask Home may explain and rank deterministic results. It must not invent:

- Kitchen/freezer quantities;
- yields;
- calories/macros;
- allergens;
- expiry;
- safety temperatures;
- substitutions not in the approved graph;
- Josh/G preference history.

Mutations remain confirmation-gated. `ask-actions-v2.ts` applies only confirmed v12 proposals.

## Couple memory

Use separate Josh/G evidence. One comment is not a permanent preference. `household-memory-v2.ts` currently requires repeated evidence before a preference becomes eligible for automatic adaptation.

Research confidence and household approval are separate axes.

## Final cutover gate

Do not replace the active provider until:

- every visible component quantity is unit-aware;
- Prep Day accepts measured output;
- Plan and Kitchen use v2 demand/stock;
- cooking uses exact v2 consumption;
- Scan cannot write gram values into legacy ml stock;
- Ask mutations use v12 canonical units;
- household sync is pointed at `home-meals-household-v12`;
- `npm run typecheck`, `npm run audit:data`, and `npm run build` pass.
