# Home Meals — Phase 1 Acceptance Record

Date: 12 September 2026

This file records the acceptance work for the private Josh + G Home Meals build. It is evidence, not a second product brief. The canonical product contract remains `HOME_MEALS_MASTER_IMPLEMENTATION_PLAN.md`.

## Tested product state

Primary tested application commit before this record: `e36f8be06926644189774948fd82b10cbe3db942`.

Production target:
- `https://meals.josh-gier.com`
- Railway service `home-meals-web`
- branch `home-meals-content-v1`

## Acceptance A — GOLD chicken curry

Validated in a real browser against production with controlled household state.

Recipe truth:
- GOLD: 120 ml
- Ginger-garlic: 15 ml
- Chicken: 400 g
- Coriander: 15 g
- Basmati rice: 2 portions

Validated loop:
1. Recipe showed the exact same quantities used by Plan and Kitchen.
2. Cooking drawer showed the oldest dated freezer batch to use first.
3. Cooking completion consumed exact logged quantities.
4. GOLD FIFO was correct: the older 60 ml batch was depleted before the newer batch, leaving 60 ml from the newer batch after a 120 ml recipe demand.
5. Dinner history was written.
6. Rating and note controls persisted.
7. Under-stock test was truthful: when only 60 ml GOLD or 200 g chicken was logged, the post-dinner receipt showed the actual deduction and separately showed the larger recipe requirement. Home did not invent inventory use.

## Acceptance B — mixed-cuisine week with standalone + multi-parent prep

Week used for the browser acceptance run:
- Thai green chicken
- Mustard mushroom chicken
- Sambal udang
- Beef & broccoli
- Curry laksa
- Miso salmon
- Harissa chicken traybake, then swapped to gochujang chicken

Coverage:
- standalone mid: THAI-G / Thai green curry paste
- multi-parent mid: DUX / Duxelles, built from BLOND + DARK

Observed before the swap from an empty but checked kitchen:
- 32 grocery gaps
- 11 prep top-ups

Observed after the Sunday swap:
- 29 grocery gaps
- 12 prep top-ups
- weekly state changed to `gochujang-chicken`

Shopping acceptance:
- all missing shopping items were checked in Shopping mode
- Finish shopping wrote 26 positive ingredient-stock records
- the active shopping gaps then cleared from the finished basket state

Prep Day acceptance:
- first-run work correctly split into two sessions rather than one marathon
- 2 prep sessions completed
- 12 batch jobs completed
- cook → cool → portion + label → freeze + log stock all completed
- 12 dated freezer batch records were created
- DUX stock after prep: 240 ml
- THAI-G stock after prep: 240 ml

Cooking acceptance:
- Thai green chicken consumed 30 ml THAI-G, leaving 210 ml
- cook history wrote `thai-green-chicken`
- Josh 5★ persisted
- note persisted: “Keep the curry bright, add extra basil next time.”
- note was adopted as household v2
- recipe reload showed the persisted v2 and note

## Ask Home acceptance

Verified against household state:
- Tonight
- Ready now
- Quick / under 30 minutes
- No-rice dinner request
- Groceries
- Pantry levels
- Prep shortfalls
- Use-soon food
- Favourites
- Last dinner
- Week plan
- FIFO / oldest freezer batch
- Freezer-life guide using the stored component guide rather than an invented duration

Component matching intentionally ignores unsafe one-letter code substring matches.

## Camera / Scan acceptance

Current production behaviour is intentionally truthful:
- camera and photo-library capture work
- Fridge, Freezer and Pantry photos remain visual references while the user explicitly confirms stock
- Receipt mode requires manual confirmation of items
- Prep mode links back to actual recipe/base cues
- Meal photos are disposable unless explicitly saved
- saved dinner photos are compressed to a bounded device budget
- no OCR, ingredient recognition or doneness recognition is claimed while no vision backend is connected

## Responsive + interaction audit

Core routes were crawled at the canonical checkpoints, including:
- 360
- 375
- 393
- 412
- 430
- 768
- 820
- 1024
- 1280
- 1440 px

Core routes covered:
- Home
- Cook
- Builder
- Recipe
- Cooking
- Prep
- Mother detail
- Mids
- Prep Day
- Kitchen
- Plan
- Scan
- Learn

Latest audit results after the final touch fixes:
- HTTP 200 on tested routes
- no document-level horizontal overflow
- no page-level JavaScript errors in the acceptance crawls
- primary interactive controls meet the 44 px minimum in the tested routes
- mobile text inputs use 16 px where browser zoom would otherwise be triggered
- desktop page authority is 1180 px at the 1280 px checkpoint
- Home food hero image is above its background and below the shade/content stack
- Recipe food hero uses the same explicit image → shade → copy stack
- Ask Home / camera / mic controls no longer cover the Prep navigation label
- reduced-motion mode disables active transitions/animations in the tested shell
- keyboard Tab traversal reaches the main navigation and input controls

## Failure-state checks

Validated:
- empty first-kitchen state
- no-use-soon state
- low / out pantry levels
- under-stocked cooking receipt
- storage-write failure shows the “Changes aren’t saving on this device” warning
- invalid/oversized Scan photo paths are guarded
- offline core navigation works after the service worker is installed and controlling the page
- service worker core cache was refreshed after the major product/layout passes

## Design-system cleanup

The legacy cascade remains in the repository only as historical rollback material. It is no longer active.

`app/globals.css` now imports only the compiled active design-system files under:

`app/styles/final/`

This preserves the resolved production cascade while removing the previous active stack of dozens of overlapping pass stylesheets.

## Honest current boundaries

These are not presented as completed capabilities:
- household state is device-local `localStorage`; there is no real Josh + G cross-device cloud sync yet
- Ask Home is deterministic household reasoning; there is no server LLM connected
- camera capture is real, but computer vision / receipt OCR / doneness recognition is not connected
- voice input uses browser SpeechRecognition where available; there is no realtime conversational voice backend

Those require backend persistence and/or model credentials and are intentionally not faked in Phase 1.
