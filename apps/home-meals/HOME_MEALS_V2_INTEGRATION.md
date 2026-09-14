# Home Meals v2/v12 integration status

Status: **CUTOVER COMPLETE**
Updated: 2026-09-14

This file records the current frontend/runtime integration state. It preserves the migration rules from the earlier handoff but no longer describes the old v11 provider as production reality.

## Current rule: no legacy quantity assumptions in active UI

Current screens must not read `portionMl`, `batchYield`, `outputMl`, `remainingMl`, `neededMl`, `shortMl` or `parentMotherIds` as food truth.

Use the v2 export surface:

```ts
import { ... } from "@/data/food-v2-index";
```

Canonical prep stock is unit-aware:

```ts
{ qty: 180, unit: "g" }
{ qty: 450, unit: "ml" }
{ qty: 4, unit: "count" }
```

Never convert g to ml for display or arithmetic.

## Provider cutover

The approved v3 UI now runs on the **v12 household runtime**.

The old v11 household sync runtime has been retired. Current Kitchen, Prep, Prep Day, Plan/groceries, Recipe/Cook/Cooking, Home readiness, Ask Home/Scan confirmations and household sync all use the current unit-safe contracts.

Legacy data may still be read by migration/archive code so old household history can be preserved safely. It must not become a second current state source.

## Migration state

When historical v11 data is encountered:

- ratings, notes, recipe versions, history and favourites are preserved where safely mappable;
- ambiguous legacy component stock is archived, not silently converted;
- ambiguous legacy prep batches are archived, not silently converted;
- ambiguous legacy ingredient quantities are archived, not silently reinterpreted;
- canonical v12 quantity stock is rebuilt only from explicit current observations/confirmation;
- migration warnings are presented as a Kitchen reconciliation task rather than pretending archived values are current stock.

Never label archived quantities as current stock.

## Prep component presentation

Use `prepComponentViewV2()` or equivalent current DTOs.

The exact underlying quantity/unit remains canonical, e.g.:

- `GOLD · 180 g`
- `CLEAR · 450 ml`
- `JP-CURRY · 75 g`

But the normal household production UX is **working-portion first**, not a laboratory weigh-in.

### Prep production flow

1. cook to the structured cue;
2. cool/store safely;
3. divide into useful standardized working portions;
4. tell Home how many working portions were actually stored;
5. v12 records confirmed stock using the component's canonical working quantity/unit;
6. optional real measurements may be stored later as household calibration evidence.

Do **not** invent the total physical yield of a recipe. Do not require Josh/G to weigh the entire pot simply to use the app.

For child prep such as LAKSA or WOK-B/WOK-W, the production relationship uses explicit `madeFrom` semantics. Parent quantity is charged when the child prep is produced; dinner does not charge the parent again.

`usedWith` is not a physical dependency and must never be treated as one.

## Recipes

`canonicalDinnerFormulationsV2` is the quantitative two-person recipe layer.

It contains exact formulation quantities, prep dependencies, equipment and structured cooking steps. Household-only observations such as actual cook time, preferred seasoning, or actual physical yield remain unknown until observed.

Use `recipeVariantsV2` for explicit choices such as:

- no rice / half rice;
- protein branches;
- lettuce-wrap bulgogi;
- alcohol-free cacciatore/ragù;
- potatoes vs pasta;
- tortillas vs rice.

Do not render ambiguous legacy strings as one nutrition-bearing choice.

## Kitchen / groceries / cooking

Use `ingredient-engine-v2.ts` and current food-engine helpers for:

- exact ingredient demand;
- recipe availability;
- shopping shortfall;
- prep shortfall;
- exact consumption after cooking;
- FIFO component use.

Water is excluded from shopping. Canonical ingredient forms with different units remain separate stock identities; the app never invents mass-volume conversions.

Cooking consumes the same canonical quantities used by planning. A failed reconciliation must not silently become partial stock consumption. History-only logging is an explicit separate action.

## Nutrition

Do not expose provisional research calorie numbers as final household truth.

The deterministic nutrition layer requires sufficient ingredient/product evidence, a defined serving basis and suitable cooked/prep yield/density evidence. If a dependency is missing, show nutrition as unavailable/not calibrated rather than asking AI to estimate it.

Strained stocks such as CLEAR/DARK/DASHI/K-STOCK require an analyzed finished-food proxy rather than naïvely summing nutrients from discarded bones/aromatics.

## Safety / camera

Safety targets come from `food-safety-v2.ts`.

Live Vision may assess:

- browning;
- reduction;
- oil separation;
- surface caramelisation;
- texture;
- obvious scorching;
- conservative visible inventory/receipt cues.

Vision must not certify internal meat/fish safety. Inventory proposals require confirmation. Where applicable the cooking UI pairs visual cues with structured thermometer/safety targets.

## Ask Home

Ask Home receives deterministic v12 household context and may explain/rank valid results. It must not invent:

- Kitchen/freezer quantities;
- physical yields;
- calories/macros;
- allergens;
- expiry;
- safety temperatures;
- unvalidated substitutions;
- Josh/G preference history.

Straightforward household arithmetic is precomputed. The model is used where ambiguity, planning or explanation actually benefits from reasoning. Mutations remain confirmation-gated and validated before application.

## Realtime voice

Realtime voice uses the same truth contract. It handles low-latency conversation and delegates household-dependent planning/arithmetic/state work to the backend rather than guessing.

## Couple memory

Josh/G evidence remains separate. One comment is not automatically a permanent preference. Research confidence and household approval remain separate axes.

## Shared persistence

Railway Postgres is the active shared Josh + G backend.

Current behaviour includes:

- private household session;
- optimistic versioning;
- explicit join/concurrent conflict states;
- active-cooking remote-update deferral;
- failed-write recovery without silent local-state loss.

## Current release gate

The v2/v12 integration is accepted only when the same commit passes:

- `npm ci` from the committed lockfile;
- `npm run typecheck`;
- `npm run audit:data` including household journey, private AI, release infrastructure, v3/v12 cutover and product completion;
- `npm run build`;
- Chromium Playwright acceptance across the full catalogue and canonical responsive checkpoints;
- Railway production deploy + healthcheck;
- production configuration/status checks.

See `HOME_MEALS_MASTER_IMPLEMENTATION_ADDENDUM_V12.md` and `QA-ACCEPTANCE-ADDENDUM_2026-09-14.md` for the current supersessions of stale master-plan/QA wording.
