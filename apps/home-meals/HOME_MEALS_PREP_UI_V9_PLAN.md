# Home Meals — Prep UI V9 Execution Plan

Status: implementation pass
Date: 2026-09-15
Baseline: V8 accepted product and food truth

## Objective

Make Prep dramatically easier to browse and operate on a 390 px phone without changing V8 food, stock, planning, nutrition or household semantics.

The redesign is additive. It preserves:

- 7 core bases + optional ONION;
- 26 mids & sauces + 7 boosters;
- 41 prep objects and 136 live recipes;
- `Have now` as physical stock and `Our prep` as maintenance intent;
- week lifecycle `unplanned → suggested → confirmed`;
- planning modes Have now / Our prep / Both / Freely;
- V6 measured finished output → storage packets + exact remainder;
- current V12 household state, sync, Ask Home, Vision and Voice.

## Product hierarchy

Prep should answer, in order:

1. What do we need to prep next?
2. What prep do we choose to maintain?
3. What prep do we physically have now?
4. What else exists in the capability library?

The library is discovery, not the page's dominant task.

## Workstreams

### V9-01 — Prep next

Replace compact dependency rows with large food-led task cards showing:

- prep image;
- code and household-facing name;
- core/mid/booster type;
- exact shortfall or covered state;
- storage packet/dose context;
- direct Make/Open action.

### V9-02 — Our prep

Use a large horizontal rail on phones so roughly 1.2 cards remain visible. Each card exposes:

- large food photography;
- prep identity;
- physical-stock status;
- current-week status;
- pause action.

Keep `Plan around our prep` as a direct planning transition.

### V9-03 — Have now

Keep inventory operational rather than promotional, but increase visual and touch clarity. Preserve packet-accurate add/remove controls and keep physical stock independent of active repertoire.

### V9-04 — Prep library

Demote the previous four-card marketing-style library block to one coherent `Browse prep library` hero. The expanded library then provides category navigation and large visual cards.

Replace the diagonal sliced-collage treatment with a coherent organised prep-table image.

### V9-05 — Mids & sauces

Replace row-dominant 44–52 px thumbnail browsing with:

- large `This week` cards;
- visual core-base relationship browsing;
- large related-mid rail;
- two-column standalone and full-library card grids;
- direct add/pause repertoire controls.

ONION must not appear as one of the seven core-base relationship filters.

### V9-06 — Responsive/accessibility acceptance

Protect:

- no horizontal document overflow at canonical widths;
- minimum practical touch targets;
- accessible names for interactive controls;
- first-run starter flow;
- stock packet steppers;
- existing route and household-state behaviour.

## Visual asset direction

Use warm, premium domestic editorial food photography. Category imagery should show an organised prep system with realistic variation between frozen blocks, jars, sauces, stocks and concentrated doses. Do not imply every prep is an identical cube.

Initial V9 assets:

- overall Prep Library organised spread;
- Core Bases organised spread.

Existing individual prep heroes remain authoritative for each prep object and continue to be used throughout cards/details.

## Acceptance boundary

This pass is complete when the new Prep and Mids routes are live, V8 arithmetic/state behaviour is unchanged, the release build remains green, and production serves the accepted commit without route/image regressions.
