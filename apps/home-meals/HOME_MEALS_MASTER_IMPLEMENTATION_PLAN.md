# Home Meals — Master Implementation Plan

Status: canonical build contract for the private Josh + G mobile app.

This document overrides ad-hoc UI decisions. If code, copy, layout, data, or interaction conflicts with this document, the code is wrong until the plan is intentionally amended.

## 1. Product truth
Home Meals is a private mobile-first home app for Josh + G. It helps us keep recipes, plan meals, shop, prep, track the kitchen, cook, rate meals, and improve recipes over time.

It is not a recipe website, food blog, SaaS dashboard, culinary publication, AI demo, or public product.

Primary loop:
Our recipes -> monthly pool -> week plan -> kitchen stock -> groceries -> prep -> cook -> Josh/G ratings + notes -> improved recipe -> future plans.

Prep is foundational: 8 mother bases + researched mids + other prep modules support many recipes. The food architecture must stay truthful, but the everyday UI uses normal home language.

## 2. Users and environment
Primary users: Josh and G only.
Primary device: 390 px phone width.
Secondary phone widths: 360, 375, 393, 412, 430 px.
Tablet checkpoints: 768, 820 px.
Desktop checkpoints: 1024, 1280, 1440 px.
The phone design is canonical. Tablet/desktop expand the mobile app; they do not become a separate website.

Typical contexts:
- standing in the kitchen with one hand free;
- shopping in a supermarket;
- planning together on the sofa;
- checking freezer stock;
- cooking with wet or occupied hands;
- rating dinner after eating.

## 3. Quality bar
No screen is done until:
- primary action is obvious within 2 seconds;
- no important interaction is below 44x44 CSS px unless it is part of a larger tappable parent;
- base body text >= 15 px; secondary text >= 13 px; utility labels >= 11 px; exceptions require justification;
- no document-level horizontal overflow at any checkpoint width;
- no giant dead whitespace caused by fixed heights or spacer logic;
- no internal engineering words in normal UI;
- no decorative section whose only purpose is to explain the product;
- all state-changing actions have clear success feedback;
- all routes have empty, normal, low-stock/missing, and error-safe states where relevant;
- keyboard focus and screen-reader labels exist on interactive controls;
- prefers-reduced-motion is respected;
- touch scrolling and horizontal rails use snap where helpful and never trap page scroll;
- every visible number is derived from one household state or clearly labelled demo/placeholder;
- every recipe dependency uses quantity, not just presence.

## 4. Responsive contract
### 4.1 360–430 px phones
- content side padding: 16 px minimum, 20 px preferred;
- bottom app bar: fixed, safe-area aware, 64–72 px tall;
- Ask Home control: 56–64 px; does not cover nearby nav labels;
- page top area: 56–88 px, not landing-page scale;
- max one large hero per task screen; hero only when it contains the current action or current meal;
- horizontal rails show at least 1.8 cards to imply swipe;
- full-width buttons >= 48 px tall;
- modal/sheet actions reachable above keyboard and safe area.

### 4.2 Tablet
- 2-column layouts only where both columns remain task-relevant;
- bottom nav remains unless viewport >= 900 px and side navigation materially improves use;
- task order remains identical to phone.

### 4.3 Desktop
- max content width 1180 px;
- no stretched mobile cards over huge widths;
- lists become grids where useful;
- primary app navigation may become side/top app chrome, but route order and terminology stay identical.

## 5. Design language
Warm, domestic, tactile, slightly playful, never childish.

Foundation:
- warm cream background;
- dark kitchen green for strong actions/status;
- food photography where it helps recognition;
- display serif only for short titles, never long body copy;
- clean sans for all functional text;
- rounded cards with restrained shadows;
- subtle handwritten/accent treatment used only for rare personal notes, never system labels;
- colour of each prep component remains functional.

Card taxonomy is limited to:
1. Action card — do something now.
2. Meal card — recipe/plan item.
3. Stock card — have/need/use-soon.
4. Guide card — contextual help.
No new card type without a reason.

## 6. Motion and haptic contract
Motion explains state. It does not decorate continuously.

### Motion tokens
- tap response: 90–140 ms;
- card/sheet transition: 180–260 ms;
- route/content entrance: 220–320 ms max;
- stock/count change: 180–240 ms;
- cooking step slide/fade: 180–220 ms;
- graph expansion: 240–360 ms;
- success confirmation: 300–450 ms then settles.
Use transform + opacity where possible. Avoid layout-janking height animation on long content.

### Haptic-capable interactions
Web haptics are progressive enhancement only. Implement a helper using `navigator.vibrate` when available; no-op elsewhere. Never block an action if unavailable.
- 10–20 ms: checkbox, rating star, nav confirmation;
- 20–30 ms: meal swap, batch completion, stock +/-;
- double short pulse: cook completed / prep session completed;
- no haptic on scroll, hover, passive animation, or repeated typing.
On platforms without vibration support, use visual press/success feedback only.

## 7. Copy contract
Tone: normal household language, concise, warm, specific.

Use:
- Tonight
- This week
- Use soon
- Need to buy
- Prep this week
- We have enough
- GOLD is low
- Make 1 batch
- G gave this 5★ last time
- Josh: more chilli next time
- 2 portions needed · 1 left

Ban from normal UI:
- infrastructure
- architecture
- dependency / dependency graph
- canonical
- shared state
- food graph / wired graph
- operating system
- multiplier architecture
- V1 preview / phase 2 language
- AI guess / AI slop commentary
- marketing slogans that add no utility

Recipe subtitles describe the food, not the code relationship.
Buttons are verbs: Cook, Swap, Add to week, Make batch, Done, Save note, Scan fridge.

## 8. Canonical data model
No page owns its own version of inventory, groceries, prep, ratings, or recipe notes.

### 8.1 Recipe
- id
- title
- cuisine
- image
- servings
- prepComponents[]: {componentId, quantity, unit/portionMl}
- ingredients[]: {ingredientId, quantity, unit}
- finishers[] if not inventory-tracked
- method
- time
- difficulty
- source references
- steps[]
- visual cues[]
- status: researched | household-approved | favourite | test | retired
- version
- householdNotes[] {author, text, date}
- ratings {josh, g}
- cookHistory[]

### 8.2 Prep component
Kinds: mother | mid | booster | stock | finisher-prep.
- id/code/name
- parent component IDs where applicable
- batch recipe and yield
- standard portion size(s)
- storage location/life
- current stock in normalized portion units or ml
- last-prepped date
- example/approved recipes
- doneness cues

### 8.3 Ingredient
- id/name/category
- fridge/freezer/pantry
- base unit
- exact quantity where decision-useful
- Plenty/Some/Low/Out state where exact quantity is not worth maintaining
- use-soon priority/date when known

### 8.4 Derived values
Weekly ingredient demand = exact sum of recipe ingredient quantities.
Groceries = weekly demand - current kitchen inventory.
Weekly prep demand = exact sum of recipe prep-component quantities.
Prep this week = weekly prep demand - current component stock.
Cooking consumes exactly the same recipe quantities used by planning.
No `one linked component = one portion` shortcut.

## 9. Food architecture
Permanent mothers: RED, BLOND, GOLD, SAMBAL, REMPAH, CLEAR, DARK, ONION.

Mid layer is many-to-many and may also contain standalone mids. Current researched mid list is the approved candidate set, but a permanent mid only displays as fully active once its recipe content and actual meal coverage are supported.

The UI must distinguish:
- researched and ready;
- test/placeholder;
- not yet linked to enough household recipes.
It must never imply all 26 mids are equally mature if they are not.

## 10. Global app shell
Bottom nav order is fixed:
Home · Cook · Prep · Kitchen · Plan.
Ask Home sits centrally above the nav.
Camera is accessible from Ask Home and Kitchen; optional separate quick button only if it does not clutter the app bar.

### Nav behaviour
- active item has colour + icon state, not just tiny text colour;
- tap target >= 52x52;
- bottom safe-area padding respected;
- current route preserved where useful when returning from a sheet;
- haptic short pulse on supported devices.

### Ask Home sheet
- opens as bottom sheet on phone, centred panel on desktop;
- immediate quick actions: Tonight, Use soon, Groceries, Prep;
- message history for session;
- input composer >= 48 px;
- no fake voice state; microphone may open same sheet until realtime voice exists;
- no claims of live vision until live vision exists.

## 11. HOME route `/`
Purpose: answer “what are we doing?” in under 10 seconds.

Above first viewport:
1. compact household header;
2. Tonight meal card with image, title, time, stock status, Cook and Swap;
3. one compact urgency row: use-soon OR missing groceries OR prep gap, highest priority only;
4. Ask Home dock/nav visible.

Below:
5. This week swipe rail;
6. compact Kitchen pulse with Fridge / Freezer / Pantry summary;
7. recent memory: last cooked + ratings/note when available.

Remove from Home:
- full mother-base visualization;
- product slogans;
- explanatory architecture copy;
- duplicated Prep/Kitchen information.

Empty states:
- no plan: “Pick this week’s dinners” -> Plan;
- no ratings/history: “Cook something and we’ll remember what worked.”

## 12. COOK route `/cook`
Purpose: our living cookbook.

Top:
- title “Our recipes”;
- search;
- “From what we have” action.

Sections when not searching:
- Favourites (only if any);
- Quick;
- Recently cooked (only if any);
- New to try/test;
- By cuisine filters;
- All recipes.

Recipe cards:
- image, title, time, rating/favourite state;
- prep codes secondary, never dominant;
- minimum tappable card height 92 px list / 180 px visual card.

Filters:
- 44 px tall chips;
- horizontally scrollable/snap on phone;
- current selection obvious.

## 13. BUILDER `/cook/builder`
Purpose: answer “what can we make from what we have?”

Replace giant result catalogue with:
- segmented mode: By prep / By ingredient / Ready now;
- selected mother/mid chips;
- result count;
- top 6 results ranked by stock coverage/time/household rating;
- “Show all” expands intentionally;
- each result compact.
No generic warning about “AI guessing”.

## 14. RECIPE `/cook/[slug]`
Top:
- back;
- image;
- title, time, servings;
- last Josh/G rating and note if any;
- Cook button >= 52 px;
- Add/swap into week action.

Body order:
1. ingredients with exact quantities;
2. prep components with exact amounts and stock status;
3. method steps;
4. visual cues;
5. source/tutorial folded under “Reference”;
6. household history, ratings, notes/version.

Test recipe wording: “Not cooked by us yet.” Nothing about graph wiring.

## 15. COOKING MODE `/cook/[slug]/cook`
Phone-first full-screen task mode.
- suppress normal content clutter;
- keep Ask Home accessible;
- large step text >= 24 px;
- step progress;
- Back / Next >= 52 px;
- optional timers per step when applicable;
- ingredients/prep drawer, not permanently taking vertical space;
- keep screen awake where API available;
- Finish deducts exact stock, logs cook, then opens rating prompt;
- success feedback + optional double haptic.
No generic fallback recipe text for incomplete recipes; incomplete recipe cannot enter final cooking mode without an explicit test warning.

## 16. PREP `/prep`
Purpose: foundation and weekly prep command centre.

Order:
1. This week: exact prep shortfalls with quantities;
2. low-stock warning only if relevant;
3. 8 mothers compact shelf;
4. recent batches/history;
5. mids explorer;
6. contextual portion/storage guide.

Do not stack all infographics on the main page.
The base multiplier map belongs in the mids explorer/help, not as mandatory scroll content every visit.

Mother shelf card:
- code/name;
- portions left;
- Good / Low / Out;
- “used by X planned meals” if relevant;
- tap opens mother.

## 17. MOTHER DETAIL `/prep/[slug]`
Order:
1. stock + exact batch action;
2. measured recipe;
3. cooking/doneness cues;
4. portion/storage;
5. linked mids;
6. recipes using it;
7. reference.

“Make batch” opens confirmation with yield and updates stock only after confirmation.
Process imagery/cues optional, but copy remains concise and actionable.

## 18. MIDS `/prep/mids`
Purpose: discover/use prep multipliers without reading a directory.

Top:
- search;
- filters: cuisine / parent mother / standalone;
- interactive mother -> mid -> dishes explorer;
- compact result list.

Do not render 26 full-width 87–90 px directory cards in one long unfiltered page by default.
Show 8–12 relevant items; filters/search reveal others.
Maturity/status badge when not yet household-linked.

## 19. MID DETAIL `/prep/mids/[slug]`
Order:
1. name/parents/stock;
2. what it is in one sentence;
3. exact batch recipe;
4. method/cues;
5. storage;
6. actual recipes connected in Home Meals;
7. source/reference.
Do not claim “unlocks X” unless actual recipe records support the number.

## 20. PREP DAY `/prep/day`
Modes:
- This week;
- Stock-up session.

This week mode:
- exact required quantities;
- task order optimized by cook/cool/equipment time;
- each job opens details;
- 52 px completion control;
- progress bar;
- cool/portion/label/freeze tasks included;
- completion writes exact batch yield and date.

If no prep needed: compact success state + go back. No long page.

## 21. KITCHEN `/kitchen`
Tabs: Fridge · Freezer · Pantry.
Each tab control >= 44 px.

Fridge:
- Use soon first;
- proteins, veg, dairy;
- default state labels Plenty/Some/Low/Out;
- exact quantity only where maintained.

Freezer:
- 8 mothers compact stock;
- mids stock searchable/filterable;
- proteins/carb modules later;
- last-prepped/batch dates when available.

Pantry:
- decision-relevant items only.

Stock edit:
- +/- >= 44 px or tap item opens stepper sheet;
- count change animates and optional haptic.

## 22. PLAN `/plan`
Purpose: choose week, see consequences.

Order:
1. seven-day meal strip;
2. tap a day opens swap bottom sheet — no 18 px inline `<select>`;
3. Use soon;
4. groceries with real checkboxes >= 44 px row;
5. prep generated by the week;
6. monthly meal pool;
7. weekly ratings/history only when meaningful.

Meal swap sheet:
- search;
- favourites / quick / new;
- results show image, time, rating, stock coverage;
- choosing meal closes sheet, updates week, groceries, prep with one state transition/haptic.

## 23. SCAN `/scan`
Until live vision exists:
- allow taking/selecting photos;
- allow user-confirmed/manual interpretation only;
- no fake detected ingredient counts presented as AI truth;
- clearly offer “Add these manually” or “Use placeholder demo” only in dev mode;
- receipt/photo storage optional; no claim of recognition.
Prep check should link to recipe/base visual cues rather than fake analysis.

## 24. HELP `/learn*`
Not primary navigation.
Contextual guides only.
Each guide is a concise visual reference, not another website.
Readable type, large controls.
No “shared state” terminology.

## 25. Infographics
Functional set:
- Base -> mid -> recipes explorer;
- weekly reuse/dependency map;
- portion scale;
- prep pipeline;
- grocery demand minus stock;
- recipe evolution timeline;
- freezer stock bars/segments.

Rules:
- only show when it helps the current decision;
- labels >= 12 px on phone;
- interactive nodes >= 44 px;
- reduced-motion fallback;
- never create a 500+ px dead visualization when a compact bar/shelf communicates better.

## 26. State feedback and errors
Every mutation has:
- pressed state;
- optimistic or immediate visual change;
- success confirmation where destructive/meaningful;
- error fallback if persistence fails.

Specific:
- grocery checked: strike/check + subtle haptic;
- stock +/-: count animation;
- make batch: confirmation sheet -> stock added toast;
- meal swap: sheet closes -> day card crossfade -> groceries/prep counts animate;
- finish cooking: double haptic when supported -> rating sheet;
- save note: “Saved” inline confirmation;
- scan upload fail: retry/remove photo.

## 27. Accessibility
- semantic buttons/links;
- form labels;
- visible focus;
- colour never sole status cue;
- WCAG AA contrast for text;
- font zoom to 200% without loss of function;
- reduced motion;
- alt text for meaningful food/process images, empty alt for decorative crops;
- no essential information only inside hover.

## 28. Performance/PWA
- route JS kept modest;
- food images lazy-loaded below fold;
- current/tonight image prioritized;
- image aspect sizes declared to avoid layout shift;
- offline shell for last-known plan/recipes desirable after core UX;
- localStorage migration/versioning until server persistence arrives;
- no console errors in acceptance run.

## 29. Haptic/interaction helper
Implement one helper e.g. `feedback(kind)`:
- `tap` 10 ms;
- `change` 20 ms;
- `success` [20, 50, 20];
- respects reduced motion/optional user preference;
- only calls `navigator.vibrate` when supported.

## 30. Implementation phases
A. Truth layer
- unify recipe graph with all researched meal content;
- exact prep quantities;
- complete normalized ingredient quantities;
- canonical IDs for mothers/mids/boosters/finishers;
- fix plan/prep/grocery/cooking arithmetic;
- no duplicate parallel data sources.

B. Copy layer
- inventory every visible string;
- rewrite to domestic language;
- remove engineering/marketing/fake-AI language.

C. Interaction layer
- global shell, haptic helper, sheets, toast, modal, swap flow, stock editing, batch confirmation, cooking completion/rating.

D. Visual layer
- replace accumulated CSS stack with one active design system;
- rebuild mobile screens route by route;
- no image generation required.

E. Validation loops
Loop on 360/375/390/412/430 phone, 768 tablet, 1024/1280 desktop:
1. route crawl;
2. screenshot inspection;
3. touch-target measurement;
4. text-size audit;
5. overflow audit;
6. copy audit;
7. action matrix test;
8. state flow test;
9. console/network errors;
10. reduced motion + keyboard/focus.
Repeat until no blocker/major issue remains.

## 31. Acceptance scenario A
Fresh week:
- choose 7 meals;
- verify exact ingredient demand;
- verify exact prep demand;
- groceries subtract kitchen stock correctly;
- prep subtracts freezer stock correctly;
- swap one dinner and verify both recalc;
- check groceries;
- log/make required batch;
- cook Monday;
- exact prep and ingredients decrement;
- rating prompt appears;
- save Josh/G ratings + note;
- reload; state persists;
- Home/Plan/Cook reflect history.

## 32. Acceptance scenario B
Different cuisine-heavy week:
Repeat scenario with different mothers/mids, including one standalone mid and one multi-parent mid. This catches hard-coded assumptions.

## 33. Definition of done
Home Meals is done for this phase only when:
- the calculations are food-truthful;
- the mobile app is pleasant and fast to use;
- every active route follows the copy/design contract;
- no control is undersized;
- no active route leaks legacy terminology/data;
- all primary actions work end to end;
- screenshot and interaction audits pass across target sizes;
- Railway production build is green;
- meals.josh-gier.com serves the verified commit.
