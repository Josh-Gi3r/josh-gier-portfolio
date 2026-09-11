# Home Meals — Canonical Product Spec

## Audience
Private household app for Josh + G. Not a SaaS product, not a public recipe site, not a content publication.

## Product promise
Home Meals helps us decide what to eat, remember our recipes, know what is at home, buy only what is missing, prep only what the week needs, cook from the phone, and remember what we liked.

## Tone
Warm, domestic, friendly, visual, mobile-first. The architecture stays under the hood. The UI should feel like a useful shared home app rather than a culinary dashboard.

## Primary navigation
Home · Cook · Prep · Kitchen · Plan
Persistent Ask Home + camera entry.

## Canonical food architecture
### 8 mother bases
RED · BLOND · GOLD · SAMBAL · REMPAH · CLEAR · DARK · ONION

### 16 mid-bases
MAKHANI · SAAG · KORMA · RENDANG · LAKSA · THAI-G · THAI-R · WOK-B · WOK-W · TERI · JP-CURRY · GOCHU · HARISSA · CHIPOTLE · PESTO · DUX

Mid-bases are many-to-many multipliers. Examples: KORMA = GOLD + ONION; LAKSA = REMPAH + CLEAR; JP-CURRY = ONION + CLEAR; DUX = BLOND + DARK. Standalone mids remain standalone when forcing a mother below them would not improve the food.

## Source-of-truth graph
Recipe -> mother requirements + mid requirements + normalized ingredients + method + recipe content + rating/history.
Weekly plan -> 7 recipe IDs.
Shopping -> summed weekly ingredient demand minus Kitchen ingredient stock.
Prep -> summed weekly mother/mid demand minus freezer component stock.
Cook event -> deduct recipe components and ingredients, write history.
Ratings -> Josh and G separately, tied to recipe and later recipe version.

No page may maintain an independent copy of groceries, prep demand or meal dependencies.

## Core flows
### Weekly planning
1. Select/swap 7 real recipes.
2. Grocery list recalculates immediately.
3. Prep queue recalculates immediately.
4. Household inventory remains the only stock source.

### Grocery
1. Requirements come from the current week.
2. Existing Kitchen stock is subtracted.
3. List is grouped by Fresh / Protein / Dairy / Pantry.
4. Camera/receipt confirmation will later update the same Kitchen state.

### Prep
1. Current week produces component demand.
2. Freezer stock is subtracted.
3. Only shortages become prep jobs.
4. Completing a batch increases that component's freezer stock by its defined batch yield.
5. Library bases/mids can exist without becoming this week's prep list.

### Cooking
1. Recipe shows exact linked components and fresh ingredients.
2. Cooking mode walks through the approved method.
3. Finish meal deducts component + ingredient stock and creates history.
4. Josh and G rate separately.

## Screen responsibilities
### Home
Tonight; this week; grocery attention; prep attention; base stock; Ask Home.

### Cook
Personal approved/placeholder recipe library. Every card displays the actual linked mother/mid codes. Builder is constrained to approved graph combinations.

### Prep
This week's prep first. Mother library second. Many-to-many mother-to-mid graph third. Never show all prep components as an instruction to make them all.

### Kitchen
Mother stock; mid stock; lightweight ingredient stock. Quantities exact when useful, otherwise future Plenty/Some/Low/Out.

### Plan
Seven dinners; meal swap; derived prep; derived groceries; household ratings.

### Ask Home
Answers from the same plan, stock and graph. No generic recipe hallucination.

## Content states
approved = recipe has linked dependencies and researched/household method.
placeholder = dependency graph is valid but exact method/content is intentionally unfinished.
No placeholder may pretend to be approved.

## V1 acceptance test
1. Swap a planned meal.
2. Verify groceries and prep both change.
3. Log a prep batch.
4. Verify freezer stock changes and prep shortage disappears/reduces.
5. Cook a planned meal.
6. Verify linked components and ingredients decrement.
7. Rate meal separately for Josh and G.
8. Verify rating appears in Plan/history context.
9. Reload browser and verify state persists locally.
10. Confirm all five primary screens work at mobile width without exposing legacy six-base/booster data.

## Deferred but architecturally reserved
Real camera recognition, receipt parsing, voice/realtime, persistent Postgres household state, recipe versioning, automatic use-by dates, cost history, monthly pool intelligence, Dashi/Korean anchovy stock/asam-pedas expansion, deeper mid-base research.
