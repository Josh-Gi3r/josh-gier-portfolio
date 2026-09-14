# Home Meals — Product Blueprint

Status: current implementation contract
Updated: 2026-09-14

## 0. Product truth

Home Meals is Josh + G's private, mobile-first household cooking system. It is not a public recipe website, SaaS dashboard, food blog, calorie tracker or AI chat wrapper.

Its job is to make eating at home easier, more enjoyable and more organised over time by connecting:

- the dinners Josh + G actually want;
- reusable prep that genuinely saves work;
- the food and prep actually recorded in Kitchen;
- weekly planning and groceries;
- what was cooked recently;
- ratings, notes and household learning;
- text, voice and camera interaction with the same underlying household truth.

The product should answer one question within roughly 10–30 seconds:

> What is the next useful thing for us to do?

Governing product principle:

> **Home Meals should expose love, food and the next useful action. The machinery stays underneath.**

Visual principle:

> **Keep the brain, rebuild the body.**

Phone is canonical. 390 px remains a key acceptance width.

---

## 1. Core household loop

The complete loop is:

1. discover or invent dinners;
2. approve dinners into the household repertoire;
3. choose the active prep repertoire;
4. build the week;
5. compare weekly demand with recorded Kitchen truth;
6. generate groceries and prep gaps;
7. shop or scan purchases;
8. update Kitchen;
9. make only the prep the week actually needs;
10. cook;
11. reconcile stock only when recorded Kitchen truth is sufficient;
12. record the meal in History;
13. rate, note, photograph or version the dinner;
14. use that history to make the next plan less repetitive and more personal.

The loop must work even if the household maintains only a small subset of the total prep library.

---

## 2. First-run truth

Unknown is not the same as empty.

On first use, after the private Josh + G household connection is established, Home offers three truthful starts:

- **Kitchen is empty** — explicitly confirm zero stock across tracked food and prep;
- **Start from zero and add what we have** — begin from confirmed zero, then add only what is actually present;
- **Show Home** — use the camera as a reference, with confirmation before state changes.

The user must never be forced to mark dozens of individual items Out just to establish an empty kitchen.

`kitchenReady=false` means Kitchen has not been established yet. A confirmed empty kitchen is `kitchenReady=true` with zero stock.

---

## 3. Food architecture

### 3.1 Canonical catalogue

Current food system:

- **8 core mothers**;
- **26 mids & sauces**;
- **7 boosters**;
- **36 saved dinners**.

The 41 prep components are a **capability library, not a setup checklist**.

### 3.2 Active prep repertoire

The household has an explicit active prep set.

Starter choices include:

- **Start small:** GOLD + SAMBAL + RED;
- **Balanced:** GOLD + SAMBAL + RED + REMPAH + CLEAR;
- **All core bases:** all eight mothers, while mids and boosters remain demand-led;
- **Custom:** any household-selected subset.

Home should prefer dinners supported by the active set and explain the smallest useful addition when more variety is requested.

Example:

> Adding CLEAR unlocks several more dinners.

Not:

> You still need to complete the remaining prep system.

### 3.3 Relationship truth

Prep relationships use three distinct concepts:

- `madeFrom` — parent prep is physically consumed when making the child;
- `usedWith` — components pair in a dinner but neither is automatically consumed while producing the other;
- standalone — component has no prep parent.

The UI must never collapse these into one generic parent/child relationship.

### 3.4 Working portions

The household-facing prep UX is **working-portion first**.

Examples:

- GOLD: one working portion is 60 g;
- CLEAR: one working portion is 120 ml;
- MASS: one working portion is 7 g.

Exact g/ml/count remains underneath for deterministic arithmetic. The user does not need to weigh the entire finished pot just to use Home Meals.

When prep is made, Home asks how many usable working portions were stored and records the equivalent canonical quantity.

No assumed batch yield or fixed portions-per-batch may be stored as physical household truth.

---

## 4. Truth contract

Home may store or state something as fact only when it comes from one of these states:

- `SOURCE_VERIFIED`;
- `FORMULATION_LOCKED`;
- `DERIVED`;
- `HOUSEHOLD_MEASURED`;
- `HOUSEHOLD_APPROVED`.

Otherwise it is `UNKNOWN`.

Operational rule:

> **If Home cannot know it from a reliable external source, deterministic calculation or actual Josh/G observation, Home does not store it as fact.**

Research defines how to make it. Mathematics defines what follows from known data. The kitchen defines physical reality. Josh + G define whether it is good.

Forbidden as invented truth:

- assumed finished batch yield;
- assumed household serving size;
- exact household nutrition from unmeasured or unlabelled inputs;
- exact expiry dates not supported by a relevant source or product label;
- household taste preferences not observed;
- visual confirmation of safe internal meat/fish temperature.

---

## 5. Recipe system

The 36 dinners are a dynamic household repertoire, not a static cookbook.

Recipe discovery supports:

- For us;
- Cuisine;
- By prep;
- Recent;
- Not lately;
- Never cooked;
- Favourites;
- Quick;
- Ready now;
- All.

A recipe page should expose, in human order:

1. what the dinner is;
2. readiness from recorded Kitchen truth;
3. prep used;
4. ingredients;
5. method;
6. visual and safety cues;
7. Josh/G ratings, notes and versions;
8. relevant household history.

Canonical food arithmetic and safety remain underneath the presentation layer.

---

## 6. Meal memory

Every cooked dinner may create a history event with timestamp and optional variant.

Derived household intelligence includes:

- cook count;
- last cooked date;
- days since last cooked;
- cooked in the last 7/14/30 days;
- never cooked;
- recent cuisine mix;
- forgotten favourites;
- Josh rating;
- G rating;
- household notes and recipe versions.

This intelligence feeds both recipe discovery and planning.

Home should be able to answer naturally:

- “What haven’t we eaten in a month?”
- “We already had Thai twice this week.”
- “What do we both rate highly that we haven’t had lately?”
- “Show me something new.”

---

## 7. Weekly planner

The planner uses deterministic household signals before language-model reasoning.

Important signals:

- active prep fit;
- recorded ingredient/prep readiness;
- use-soon food;
- recent-meal penalty;
- cuisine repetition;
- favourites;
- Josh/G ratings;
- prep reuse across the week;
- weekday cooking-time cost;
- explicit household constraints.

The planner may suggest a dinner outside the active prep set only when the value is clear and the extra prep is explicit.

“Build it for us” should favour a varied, practical week rather than seven individually high-scoring but repetitive meals.

---

## 8. Kitchen

Kitchen has three user-facing areas:

- Fridge;
- Freezer;
- Pantry.

Kitchen truth may be exact or qualitative.

Exact tracked quantities use canonical `g`, `ml` or `count` where genuinely known.

Qualitative pantry truth remains:

- Out;
- Low;
- Some;
- Plenty.

A qualitative level may never be silently converted into grams or millilitres.

Freezer prep is shown as practical working portions, with older recorded batches first.

---

## 9. Groceries

Groceries are derived from the current plan and recorded Kitchen truth.

Conceptually:

> weekly ingredient demand − recorded stock = grocery shortfall

Exact shortfalls are used only where Home genuinely knows exact quantities. Qualitative pantry items remain qualitative restock decisions.

Shopping completion may add confirmed purchased amounts back into Kitchen.

---

## 10. Cooking and stock reconciliation

Cooking is a guided, large-target, mobile flow with:

- one clear step at a time;
- optional timers;
- visual cues;
- thermometer targets where safety requires them;
- screen wake lock where available;
- swipe/voice-friendly navigation.

At completion there are two honest outcomes:

### Stock reconciled

If recorded Kitchen truth fully supports the recipe, Home consumes the exact recorded prep/ingredient quantities and records the meal.

### History only

If recorded Kitchen truth does not fully support the recipe, Home records the meal in History **without silently or partially inventing stock deductions**.

The UI must make that distinction explicit.

---

## 11. Ratings, notes, versions and photos

Josh and G rate independently.

Recipe notes preserve author and timestamp.

A useful note may be promoted into the next household recipe version.

Meal photos are household memory, not evidence of food safety.

---

## 12. Ask Home

Ask Home is the conversational interface to the same household state, not a separate chatbot.

The language model receives deterministic context containing:

- Kitchen state;
- current week;
- active prep repertoire;
- prep/grocery shortfalls;
- recipe readiness;
- meal history and cuisine recency;
- ratings/favourites/notes;
- FIFO prep batches;
- validated substitutions;
- truth rules.

The model explains and navigates truth; it does not redo hidden food arithmetic.

Supported confirmed mutations include:

- change one planned day;
- replace the whole seven-day plan;
- update an exact ingredient;
- update prep stock;
- mark/unmark use soon;
- add a note;
- favourite/unfavourite;
- change active prep repertoire;
- confirm an empty kitchen.

AI state changes are proposals until the user confirms them.

---

## 13. Camera

Camera modes:

- Fridge;
- Freezer;
- Pantry;
- Receipt;
- Prep;
- Meal.

The camera can help identify food, propose inventory changes and describe visible cooking cues.

It may not:

- silently mutate Kitchen;
- invent an exact quantity when the photo cannot support one;
- prove safe internal temperature from appearance.

Vision configuration is checked without submitting an empty inference request.

---

## 14. Voice

Voice uses OpenAI Live over WebRTC when supported, with fallback speech recognition where available.

Anything that depends on current Kitchen, Plan, prep, groceries, ratings or meal history delegates to the deterministic household backend before answering.

Voice state changes follow the same confirmation requirement as text Ask Home.

---

## 15. Josh + G household sync

Both devices share one household state through Railway Postgres.

The private household code authenticates a device. Josh/G identity is stored separately as the local author for ratings, notes and recipe changes.

Sync rules:

- optimistic versioning prevents silent overwrite;
- conflicts require a choice;
- remote updates are deferred during an active cooking session;
- authenticated session cookie is HTTP-only, Secure and SameSite=Lax;
- code comparison uses HMAC and timing-safe comparison.

Current household code is an operational secret and does not belong in this repository/spec.

---

## 16. PWA and offline behaviour

Home Meals is installable as a PWA.

Primary routes are cached for offline navigation, including:

- Home;
- Cook;
- Builder;
- History;
- Prep;
- Prep Day;
- Mids;
- Boosters;
- Kitchen;
- Plan;
- More;
- Scan shell.

Food imagery uses a bounded image cache.

A service-worker update must not interrupt an active cooking route.

---

## 17. Visual system

The product is warm, domestic, tactile, visual and slightly playful.

It must never feel like:

- a generic SaaS dashboard;
- an enterprise inventory tool;
- a recipe SEO site;
- a spreadsheet;
- a chat app with food attached.

Current prep visual coverage is complete:

- 8/8 mother hero images;
- process sequences for all eight mothers;
- 26/26 mid hero images;
- 7/7 booster hero images;
- dinner imagery for the saved recipe catalogue.

Colour tiles remain a design language, not an accidental substitute for missing food photography.

---

## 18. Accessibility and mobile ergonomics

Primary mobile interactions target at least roughly 44 × 44 px.

Completion guardrails cover:

- primary/compact buttons;
- filter chips;
- section actions;
- stock steppers;
- scan-mode controls;
- bottom navigation;
- stock-level labels;
- visible hydration/loading state.

Reduced motion and platform accessibility behaviour should be respected by the shared design system.

---

## 19. Nutrition

Nutrition is deliberately conservative.

Hard-coded recipe kcal/protein estimates are not household truth and must not be displayed as fact.

Nutrition may become exact only when the deterministic nutrition engine has sufficient known ingredient/SKU and preparation inputs.

Until then, the product may say nutrition is not calibrated rather than inventing a number.

---

## 20. Food safety

Structured safety targets live in the food-safety layer.

Examples:

- poultry, including ground chicken: 74°C;
- ground beef/pork: 71°C;
- fish: 63°C;
- whole beef: 63°C plus rest;
- reheated leftovers: 74°C.

Visual cues help with quality and technique. A camera image never proves a safe internal temperature.

---

## 21. Source architecture

The current implementation authority is the v2/v12 food and household system, including:

- `food-truth-v2.ts`;
- `prep-formulations-v2.ts`;
- `recipe-formulations-v2.ts`;
- `ingredient-catalog-v2.ts`;
- `food-engine-v2.ts`;
- `ingredient-engine-v2.ts`;
- `household-v12.ts`;
- `prep-repertoire-v2.ts`;
- `meal-history-v2.ts`;
- `planner-v2.ts`;
- `assistant-context-v2.ts`.

Legacy display/catalogue compatibility must not override these files for quantities, relationships, safety, nutrition or inventory arithmetic.

---

## 22. Definition of done

Home Meals is product-complete when all of the following are true:

1. first-run can establish unknown, empty or existing Kitchen truth cleanly;
2. active prep can be small, balanced, full or custom;
3. weekly planning adapts to active prep and recent meals;
4. all 36 dinners are browseable and cookable through the current formulation layer;
5. all 41 prep objects are discoverable and visually represented;
6. groceries and prep gaps derive from the current week and Kitchen truth;
7. cooking never silently invents stock deductions;
8. History, ratings, notes and versions feed future recommendations;
9. Ask Home, camera and voice use the same v12 household state;
10. Josh + G sync is conflict-safe;
11. core routes work at phone and desktop widths without horizontal overflow;
12. primary mobile controls meet the product touch-target guardrails;
13. PWA/offline shell covers the completed route set;
14. food, intelligence, cutover and product-completion audits pass;
15. TypeScript and production build pass;
16. Railway production deploy and healthcheck succeed.

Device-specific microphone/camera permission behaviour still requires the operating system/browser to grant those permissions; the product must degrade cleanly when they are unavailable.
