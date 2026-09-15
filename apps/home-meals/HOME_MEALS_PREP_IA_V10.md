# Home Meals — Prep Information Architecture V10

**Status:** implementation contract  
**Date:** 2026-09-15

V10 replaces the V9 Prep presentation without changing V8 food truth, V12 household state, V7 live recipes, V6 measured-output semantics, or the 41 canonical prep objects.

## Product decision

Prep is a category navigator first, not a mixed inventory/library/dashboard page.

The primary mobile hierarchy is:

1. **Prep → Browse / Ours / This week**
2. **Browse → category card**
3. **Category → large food cards**
4. **Food card → existing detail / make flow**

This follows progressive disclosure: choose the job, then the family, then the food. The UI must not expose all 41 objects before the household has chosen a category.

## Browse categories

The Prep Browse landing uses large one-column card buttons on phone:

- **Core bases** — exactly the seven `coreMotherIdsV7` foundations.
- **Mid bases & pastes** — canonical mids with form `paste`, `cooked-base`, `roux`, or `stock`.
- **Sauces & condiments** — canonical mids with form `sauce`, `marinade`, or `condiment`.
- **Boosters** — the seven canonical boosters.
- **Common prep** — a convenience shortcut view across real tiers: ONION, GG, G, CH, LE, PESTO and DUX.

Common prep is not a new food tier and does not change arithmetic. It is intentionally allowed to cross-list existing objects for faster household navigation.

ONION must never return to the Prep landing as a standalone category card. Its canonical truth remains unchanged; it appears inside Common prep and continues to use its existing detail route.

## Ours

Ours owns two separate facts:

- **Our prep** = the maintenance repertoire Josh + G choose.
- **Have now** = physical recorded stock.

Both use visual cards. Editing stock remains exact and packet-aware. Toggling a prep item never silently changes physical stock.

## This week

Only a confirmed week creates prep jobs. Suggested/unplanned weeks remain preview-only.

- shortages use large one-column task cards;
- covered prep may use a denser two-column grid;
- Prep Day remains the execution flow.

## Mobile card contract

- landing category cards are large, whole-card tap targets;
- family pages use two large cards per row at ordinary 375–430 px phone widths;
- very narrow widths may fall back to one column;
- important controls retain at least ~42–46 px rendered height, with existing global accessibility guardrails still applying;
- food photography is the primary recognition cue; status metadata is secondary.

## Release protection

`scripts/audit-prep-ui-v10.cjs` protects the category-first route, the five category entries, the seven-core derivation, the mid/sauce form split, the Common shortcut composition, absence of standalone ONION navigation, and the large-card CSS contract.
