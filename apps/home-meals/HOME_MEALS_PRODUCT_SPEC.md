# Home Meals — Product Blueprint

## 0. Product truth
Home Meals is Josh + G's private mobile-first home cooking app. It is not a public recipe website, not a SaaS dashboard, not a food blog, and not a culinary encyclopedia.

The product exists to make eating at home easier, more fun, more organized, and better over time.

It connects six things that must never become separate products:
1. recipes we actually want to eat;
2. reusable prep infrastructure;
3. what is actually in the kitchen;
4. what we plan to eat;
5. what we need to buy;
6. what we learned after cooking it.

The app should feel like a warm shared home app for a couple. The deep food architecture stays underneath the interface.

## 1. Product promise
Home Meals should be able to answer, at any moment:
- What are we eating tonight?
- What are we eating this week?
- What do we already have?
- What needs using soon?
- What should we buy?
- What should we prep?
- Which bases are low?
- What can this base become?
- What did we think of this recipe last time?
- Which version did G prefer?
- What should we change next time?

The app is successful when Josh or G can open it for 10–30 seconds and know the next useful action.

## 2. Audience
Exactly two primary users:
- Josh
- G

No public-user abstraction in V1. No onboarding funnel. No generic personas. No B2B or creator features.

## 3. Product personality
Warm, domestic, tactile, visual, slightly playful, never childish.

Feels like:
- a beautiful shared kitchen notebook;
- a very smart fridge door;
- a couple's home app;
- a personal sous-chef that remembers things.

Does not feel like:
- Notion;
- a recipe blog;
- a BI dashboard;
- an enterprise operating system;
- a culinary textbook;
- a giant landing page.

### Copy rules
Use short domestic language.
Prefer:
- Tonight
- This week
- Use soon
- We have enough
- Make this Sunday
- Low on GOLD
- G loved this
- Better with more chilli

Avoid visible internal jargon like:
- infrastructure
- operating system
- architecture
- dependency graph
- canonical model

Those may exist in code and documentation, not in the everyday UI.

## 4. Mobile-first interaction contract
Primary viewport: 390 px wide phone.
Secondary: tablet.
Desktop is an expanded version of the mobile app, never the design source.

### Mobile rules
- Bottom navigation always available: Home · Cook · Prep · Kitchen · Plan.
- Ask Home is the central persistent action above the nav.
- Camera action sits beside Ask Home.
- Primary actions must be thumb reachable.
- No giant page titles that consume the first screen.
- No editorial hero section unless it contains an immediate household action.
- No content block should require more than 2–3 short paragraphs before an action.
- Horizontal rails are allowed only when they are obviously swipeable.
- Every major screen should expose useful state before explanatory content.
- Learning content appears contextually inside the task where possible.

## 5. The linked food system

### 5.1 Eight mother bases
These are permanent high-leverage prep foundations:
1. RED — neutral tomato
2. BLOND — Italian soffritto
3. GOLD — North Indian bhuna masala
4. SAMBAL — sambal tumis
5. REMPAH — Malay/Nyonya aromatic paste
6. CLEAR — light chicken stock
7. DARK — reduced brown stock / jus
8. ONION — deeply caramelised onion

A mother base earns permanent status because it:
- saves substantial repetitive labour;
- freezes well;
- unlocks many genuinely different dinners;
- remains broad enough to support several directions.

### 5.2 Twenty-six mid-bases
The mid layer multiplies the mothers or stands alone where forcing a mother underneath would make no culinary sense.

#### Indian
1. MAKHANI — GOLD
2. SAAG — GOLD
3. KORMA — GOLD + ONION

#### Malaysian / Nyonya / Singaporean
4. RENDANG — REMPAH
5. LAKSA — REMPAH
6. KARI — standalone
7. ASAM-PEDAS — standalone

#### Thai
8. THAI-G — standalone
9. THAI-R — standalone
10. NAM-PRIK-PAO — CLEAR
11. KRAPOW — standalone

#### Vietnamese
12. NUOC-CHAM — fridge mid / standalone

#### Chinese
13. WOK-B — CLEAR
14. WOK-W — CLEAR
15. CHAR-SIU — standalone
16. DOUBAN — CLEAR
17. GINGER-SCALLION — CLEAR / DARK

#### Japanese
18. DASHI — standalone
19. TERI — standalone
20. JP-CURRY — ONION + CLEAR

#### Korean
21. K-ANCHOVY — standalone
22. GOCHU — standalone

#### Middle Eastern / North African
23. HARISSA — RED

#### Mexican
24. CHIPOTLE — RED

#### Italian / European
25. PESTO — standalone
26. DUX — BLOND + DARK

### 5.3 Mid qualification rule
A mid earns a permanent slot only if it:
- unlocks at least three distinct dinners;
- is meaningfully different from existing mids;
- benefits from being made ahead, frozen, or fridge-held.

Quick fresh sauces that lose quality in the freezer remain fresh finishers, not mids.

### 5.4 Food graph
The graph is many-to-many.

Recipe -> 0..n mothers + 0..n mids + fresh ingredients + finishers + method.

Examples:
- Chicken korma -> GOLD + ONION + KORMA.
- Curry laksa -> REMPAH + LAKSA + CLEAR.
- Japanese curry -> ONION + CLEAR + JP-CURRY.
- Mushroom risotto -> BLOND + DARK + DUX + CLEAR.
- Shakshuka -> RED + HARISSA.
- Tom yum -> CLEAR + NAM-PRIK-PAO + fresh lemongrass/galangal/lime.

Standalone mids are valid. The app must never invent a mother relationship merely to make the diagram look tidy.

## 6. Canonical household state
There is one state graph. No screen gets its own fake copy of groceries, prep, or inventory.

### 6.1 Recipe
- id
- title
- cuisine
- image
- serving size
- mothers[]
- mids[]
- boosters/finishers[]
- normalized ingredients[] {ingredientId, quantity, unit}
- cooking method
- estimated time
- difficulty
- version
- source references
- instructions
- visual cues
- optional tutorial video
- Josh rating
- G rating
- household notes
- cook history
- status: placeholder / researched / household-approved / favourite / retired

### 6.2 Mother / mid prep component
- id / code
- name
- parent mother ids
- batch yield
- portion format
- storage format
- freezer/fridge life
- current stock
- prep recipe
- critical visual cue
- meals unlocked[]
- last-prepped date
- next suggested prep quantity

### 6.3 Ingredient
- id
- name
- category
- default unit
- location: fridge/freezer/pantry
- quantity when useful
- simple state when exact quantity adds no value: Plenty / Some / Low / Out
- use-soon date / priority
- price history later

### 6.4 Weekly plan
Seven recipe IDs, one per dinner slot.

### 6.5 Monthly pool
A curated set of recipes for the month:
- favourites
- not-had-recently
- new tests
- emergency meals
- weekend meals

### 6.6 Prep batch
- date
- component id
- quantity produced
- portion size
- notes

### 6.7 Cook event
- recipe id
- date
- version
- consumed prep components
- consumed ingredients
- notes
- actual time
- rating prompt state

## 7. Product loop
This loop is the product and every screen must support it:

Discover / invent recipe
→ approve into Our Recipes
→ monthly pool
→ weekly plan
→ compare against kitchen stock
→ generate groceries
→ shop / scan receipt
→ update kitchen
→ calculate prep gaps
→ prep bases / mids / freezer modules
→ update freezer stock
→ cook
→ consume stock
→ Josh + G rate
→ notes / version improvement
→ next plan becomes smarter

## 8. Screen system

### 8.1 HOME — "What are we doing?"
Purpose: 10-second household answer screen.

Above the fold:
1. friendly greeting / household identity;
2. Tonight card with meal image, time, and "we have everything" / "missing 2 things";
3. Ask Home quick prompt;
4. use-soon warning if relevant.

Below:
5. swipeable This Week rail;
6. Prep next card: only if something is actually low;
7. Kitchen pulse: fridge / freezer / pantry summary;
8. one friendly household insight such as "G rated this 5★ last time".

No mother-base library on Home.
No architecture explanations on Home.

### 8.2 COOK — "Our recipes"
Purpose: living personal cookbook.

Default sections:
- Favourites
- Quick tonight
- Recently cooked
- New to try
- By cuisine
- From what we have

Each recipe card shows:
- image
- title
- time
- Josh + G rating when available
- tiny mother/mid chips only when useful
- favourite/new/repeat state

Recipe detail:
- hero image
- Why we like it / last note
- ingredients
- linked prep components
- method
- visual cues
- source/tutorial
- version history
- Start cooking

Cooking mode:
- one step at a time
- large type
- screen-awake-friendly
- timers
- Ask Home available
- camera prep check available
- finish meal -> consume stock -> rating prompt

### 8.3 PREP — "Make future dinners easier"
Purpose: the foundation of the home system.

Priority order:
1. This week's prep requirement.
2. If covered, show a celebratory "You're covered" state.
3. Low-stock foundations.
4. Base library.
5. Mid-base map / multiplier explorer.
6. Recent prep batches.
7. Prep guides.

Prep must never begin with eight giant informational cards.

#### Core-base library presentation
Compact visual shelf of eight mother bases with:
- code
- image / illustrated cube
- portions on hand
- status: Good / Low / Make soon
- dinners unlocked

Tap -> full prep recipe.

#### Mid explorer
Interactive many-to-many map.
Tap a mother -> mids animate outward.
Tap a mid -> compatible mothers + example dinners appear.
Tap a dinner -> recipe.

The point is to make the multiplication visible and fun.

#### Prep-day mode
- choose "Prep this week" or "Stock-up session"
- calculates only required batches
- orders tasks by equipment and cook time
- interactive checklist
- running timeline
- cooling / portioning / labelling steps
- batch completion writes freezer inventory

### 8.4 KITCHEN — "What do we have?"
Purpose: simple household truth, not warehouse management.

Top:
- Fridge
- Freezer
- Pantry
- Scan kitchen

Fridge:
- use soon first
- proteins
- dairy
- vegetables
- simple quantity states

Freezer:
- mother stock visual
- mid stock visual
- proteins
- rice/carbs
- batch dates

Pantry:
- only track decision-relevant items

Visual language:
- bars/rings only where they communicate "low / fine / plenty"
- no spreadsheet table as primary UI

### 8.5 PLAN — "This week"
Purpose: choose meals, then automatically create the week around them.

Top:
- 7-day visual strip
- tap or drag to swap
- each meal image visible

Then:
- Use soon
- Top up
- Shopping list
- Prep generated from the week
- This month's pool
- household rating pulse

When any meal changes:
- groceries recalc immediately;
- prep recalc immediately;
- use-soon recommendations refresh.

### 8.6 ASK HOME
Purpose: one conversational entrance into the same household state.

Persistent center button.

Modes:
- text
- voice later
- camera

Quick actions:
- What can we cook tonight?
- What should we use soon?
- What should we buy?
- What should we prep?
- Show meals from what we have.

Camera modes:
- fridge
- freezer
- receipt
- ingredient
- prep check
- meal scan

The UI should not expose mode selection unless useful; AI can infer later.

## 9. Visual design system

### 9.1 Overall aesthetic
Warm cream background, deep kitchen green, food photography, serif display type + clean sans body, rounded cards, tactile shadows, handwritten accent used sparingly.

### 9.2 Couple personality
Use Josh / G initials or avatars in:
- ratings
- notes
- "G loved this" moments
- shared weekly planning

Do not plaster avatars everywhere.

### 9.3 Card hierarchy
Only four card types:
1. Action card — something to do now.
2. Meal card — recipe / plan item.
3. Stock card — something we have / need.
4. Guide card — contextual learning.

Avoid endless card variants.

## 10. Coded infographic system
These are product components, not decoration.

### 10.1 Base multiplier map
Interactive graph:
Mother -> mids -> example dinners.
Nodes animate open/closed.
Supports multi-parent mids with connecting lines.

### 10.2 Dinner-unlock counter
When selecting a mother or mid, animate:
"RED + HARISSA unlocks 8 dinner directions"
"GOLD + ONION + KORMA unlocks 4"

### 10.3 Freezer stock wheel
Eight mother segments around a freezer icon.
Segment size/status reflects portions on hand.
Low stock pulses gently.

### 10.4 Prep pipeline
Animated horizontal/vertical sequence:
Chop -> cook -> cue -> cool -> portion -> label -> freeze.
Each mother can highlight its own current step.

### 10.5 Cube / puck scale
True proportional silhouettes for 30 / 60 / 90 / 150 / 200 / 250 ml.
Used inside recipes and prep detail.

### 10.6 Weekly dependency view
Seven planned meals at top.
Lines flow down to shared mothers/mids.
This makes reuse visible: e.g. three meals all pull GOLD.

### 10.7 Grocery delta graphic
Planned demand -> minus kitchen stock -> buy.
Used as a tiny animated explainer in Plan, not a wall of text.

### 10.8 Recipe evolution timeline
v1 -> Josh/G notes -> v2 -> latest rating.
Used only when a recipe has history.

## 11. Motion system
Motion must make state changes understandable.

Use:
- spring card expansion;
- count-up/down on inventory;
- ingredient check-off micro-animations;
- week swap transition;
- graph node expansion;
- prep timeline progress;
- successful batch "stock added" animation;
- cooking step slide transition;
- rating star response;
- gentle Ask Home dock pulse when it has a useful suggestion.

Avoid:
- continuous decorative animation;
- parallax landing-page effects;
- autoplay video backgrounds;
- motion that slows kitchen use.

## 12. Generated visual asset plan
Use generated photography / infographic art only where it adds meaning.

Needed classes:
- mother-base hero / process imagery;
- selected mid-base imagery as they are approved;
- recipe photography only after recipe graph is approved;
- freezer organization reference;
- prep-day workstation;
- grocery haul / ingredient family images;
- use-soon ingredient crops.

Do not generate an image for every placeholder recipe.

## 13. Content states
### Placeholder
Graph relationship is valid, but detailed recipe/content is unfinished.
UI must label it clearly.

### Researched
Recipe/mid has exact quantities, method, source, JB/SG sourcing, storage, and visual cues.

### Household approved
Josh + G have cooked it at least once and kept it.

### Favourite
Explicitly marked.

### Retired
Kept in history but not proposed by default.

## 14. V1 scope
Must work now:
- mobile shell
- Home
- Cook
- Prep
- Kitchen
- Plan
- Ask Home text surface
- 8 mothers
- 26 mids in the graph
- weekly plan
- derived groceries
- derived prep
- stock updates
- cooking consumption
- separate ratings
- history
- placeholders clearly labelled
- coded infographics listed above at least in first functional form

Reserved / simulated:
- real camera recognition
- receipt OCR
- realtime voice
- server persistence

## 15. Acceptance tests

### Product feel
- On 390 px, first screen never reads like a marketing website.
- Home gives a useful household answer in under 5 seconds.
- Prep answers "what should we prep" before teaching the base system.
- Plan shows seven meals visually before any explanatory copy.
- No screen exposes internal product jargon as headline copy.

### Linkage
1. Change one planned meal.
2. Grocery quantities change.
3. Prep requirements change.
4. Complete a prep batch.
5. Freezer stock rises.
6. Prep gap falls.
7. Cook a meal.
8. Linked mother/mid/ingredients decrement.
9. Josh + G rate separately.
10. Recipe history shows the cook + rating.
11. Reload and local state persists.

### Architecture integrity
- No duplicate independent grocery data.
- No duplicate independent prep demand data.
- No recipe references a prep component that does not exist in the graph.
- No mid claims a mother parent that the research does not support.
- Placeholder content cannot masquerade as researched.

## 16. Build order
1. Canonical data + 8/26 graph.
2. Mobile shell + Ask Home dock.
3. Home.
4. Plan.
5. Prep.
6. Kitchen.
7. Cook + cooking mode.
8. Coded infographic library.
9. Motion pass.
10. Visual asset integration.
11. Full household-cycle QA on mobile.
12. Desktop adaptation.

This document is the source of truth. New product decisions are additive unless explicitly superseded.