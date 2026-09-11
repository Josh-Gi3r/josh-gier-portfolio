# Home Meals · V1

Private, mobile-first household food operating system for Josh + G, intended for `meals.josh-gier.com`.

## Product state

V1 is usable without the Phase 2 AI stack. The authoritative content is the researched freezer-first foundation and meal library, not the original UI fixture data.

### Foundation

- 6 mother bases: RED, GOLD, REMPAH, SAMBAL, DARK, BLOND
- 15 directional mid-bases
- 11 booster portions
- measured 15 / 30 / 60 / 90 ml freezer language
- First Run split into two realistic sessions rather than manufacturing the full 32-component library at once
- First Run grocery list plus Full Library restock list
- guided, persistent prep-day mode
- visual cooking cues, storage rules and JB/SG notes
- source / tutorial links on prep component pages
- 6 mother hero images, 24 mother process images and 4 system/prep photographs

### Meals

- 36 researched two-person meals across Indian, Malaysian/SEA, Thai, Chinese-style, Japanese, Korean, European/Mediterranean/Middle Eastern and Mexican-ish lanes
- exact foundation modules + fresh ingredients
- why each meal belongs in the system
- balance / health rationale
- source benchmark for technique
- complete meal photography library
- search/filter, recipe detail, ratings and cooking-mode timer/stepper
- first operating week + fresh top-up checklist
- valid-combination Meal Builder: does not invent arbitrary sauce/protein pairings

### Household state

- foundation freezer counts persisted locally
- one-tap First Run inventory seeding
- lightweight fridge and pantry counts
- persistent grocery and prep checklists
- Ask Home V1 grounded in the researched foundation and cookbook
- camera surface accepts real photos; interpretation remains clearly simulated in V1

## Main routes

- `/` — daily operating Home
- `/prep` — foundation hub
- `/prep/groceries` — Foundation Shop
- `/prep/day` — guided prep sessions
- `/prep/[slug]` — mother detail / process story
- `/prep/mids` and `/prep/boosters` — modifier libraries
- `/cook` — researched cookbook
- `/cook/[slug]` — recipe detail
- `/cook/[slug]/cook` — hands-friendly cooking mode
- `/cook/builder` — valid-combination builder
- `/plan` — first week + fresh top-up
- `/kitchen` — freezer / fridge / pantry state
- `/learn` — visual operating manual
- `/scan` — V1 camera / scan surface

## Phase 2 connection points

- live vision for fridge/freezer/receipt/prep interpretation
- realtime voice while cooking
- household Postgres persistence / multi-device sync
- automatic inventory deduction and receipt ingestion
- consumption prediction / use-soon logic
- richer recipe version history and preference learning

## Deployment

Railway project: `home-meals`
Service: `home-meals-web`
Root directory: `apps/home-meals`
Source branch: `home-meals-content-v1`

## Local run

```bash
npm install
npm run dev
```
