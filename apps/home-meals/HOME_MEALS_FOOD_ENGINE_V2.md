# Home Meals Food Engine v2

This document is the implementation contract for the non-visual Home Meals food system while the frontend is being rebuilt separately.

## Governing truth rule

Home Meals stores a value as fact only when it is one of:

1. **Source verified** — a directly supported external fact such as a food-safety temperature.
2. **Formulation locked** — a deliberate Home Meals recipe decision such as `GOLD 120 g` in a two-person curry.
3. **Derived** — arithmetic from known inputs.
4. **Household measured** — observed in Josh + G's kitchen.
5. **Household approved** — explicitly accepted after cooking/eating.

Everything else remains unknown.

In particular, an unmeasured cooked batch does **not** get an invented target yield, portion count or nutrient density.

## Canonical quantity model

- `g` for dense pastes, cooked aromatics, roux, concentrated sauces and marinades where mass is the reliable household measure.
- `ml` for stocks and genuinely pourable sauces.
- `count` for discrete units.

No implicit g/ml conversion is permitted.

## Component graph

`madeFrom` means a parent component is physically consumed when the child component is produced.

`usedWith` means two components are commonly combined but neither is contained in the other.

Dinner stock deduction must never charge both a child and a `madeFrom` parent unless the dinner explicitly consumes an additional parent quantity.

## v12 household migration

Legacy v11 component stock is deliberately not converted automatically. Old values were universally stored as ml even for foods that are now correctly mass-based.

Migration therefore:

- preserves ratings, notes, recipe versions, week plan, history, favourites and ingredient stock;
- archives legacy component stock and legacy ml-only prep batches;
- starts v12 canonical prep stock at zero unless Josh/G explicitly recount or measure it;
- surfaces a migration warning rather than silently changing `120 ml GOLD` into `120 g GOLD`.

## Nutrition

Nutrition is deterministic, not an LLM task.

Ingredient binding → component formulation → measured finished component yield → nutrient density → recipe usage → whole dinner → per-serving/variant.

If a component yield is unmeasured, exact recipe nutrition is blocked. Packaged foods with materially variable labels should bind the actual household product where possible.

## Food safety

The deterministic layer owns temperatures and storage policy. Vision can assess browning, reduction, oil separation and surface condition but cannot certify microbial safety.

## Planner and Ask Home

Hard constraints first. Preferences second.

The deterministic layer owns quantities, availability, FIFO, prep demand, grocery deltas, nutrition, validated substitutions, safety temperatures, dates and household ratings/history.

AI owns language understanding, ranking among valid candidates, explanation and conversational guidance. It never invents stock, calories, yields, allergens, expiry or safety.

## Frontend boundary

The visual layer should consume stable view models and never depend on legacy `portionMl`/`batchYield` assumptions. The v2 engine is intentionally being completed without restyling or replacing frontend work.
