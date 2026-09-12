# Home Meals — QA / Acceptance Matrix

This file is the release gate for the private Josh + G app. A screen looking good is not sufficient. The linked household flow, copy, touch interaction, mobile layout and state mutation all have to pass.

## 1. Product truth
- [ ] Audience remains exactly Josh + G.
- [ ] Everyday UI never reads like a public recipe site, SaaS dashboard or product marketing page.
- [ ] User-facing copy avoids engineering/internal language: infrastructure, architecture, graph, canonical, shared state, operating system, V1, placeholder, demo.
- [ ] Internal research rationale stays behind the app and never becomes recipe marketing copy.
- [ ] Food photos support actions; they do not create decorative landing-page sections.
- [ ] No fake AI, camera recognition, voice or OCR claims.

## 2. Primary mobile shell
Test at 360×800, 375×812, 390×844, 412×915, 430×932.
- [ ] No document-level horizontal overflow.
- [ ] Bottom nav is always reachable on Home / Cook / Prep / Kitchen / Plan.
- [ ] Current tab is visually obvious.
- [ ] Ask Home is persistent, reachable and never covers a primary action.
- [ ] Safe-area top/bottom insets work in standalone PWA.
- [ ] Every normal tap target is at least 44×44 CSS px (checkbox may sit inside a 44+ label).
- [ ] Pinch zoom is not disabled.
- [ ] Reduced-motion preference disables non-essential transitions.
- [ ] Keyboard focus is visible.
- [ ] Escape closes open sheets/dialogs.
- [ ] Opening a sheet locks background scroll and closing it restores focus.
- [ ] Progressive haptic feedback is optional and feature-detected; unsupported browsers behave normally.

## 3. Responsive matrix
- [ ] 360×800 phone.
- [ ] 375×812 phone.
- [ ] 390×844 primary phone.
- [ ] 412×915 phone.
- [ ] 430×932 large phone.
- [ ] 360×640 short phone cooking mode.
- [ ] 844×390 landscape cooking mode.
- [ ] 768×1024 tablet.
- [ ] 1280×800 desktop.
- [ ] 1440×900 desktop.
For every size: no clipped text, dead horizontal scroll, nav collision, inaccessible fixed footer, modal overflow or accidental giant whitespace.

## 4. Home
- [ ] First screen answers “what are we doing tonight?” within seconds.
- [ ] Tonight card uses household-facing recipe title/subtitle.
- [ ] Readiness is honest: kitchen unchecked / missing / have it.
- [ ] Priority order: kitchen check → Use Soon → Prep → Shopping → covered.
- [ ] Use Soon links back into Plan.
- [ ] Week rail is swipeable and every meal opens its recipe.
- [ ] Kitchen pulse shows only useful household state.
- [ ] Last cooked meal uses real cook history, ratings and latest note.
- [ ] No base architecture explainer on Home.

## 5. Cook / cookbook
- [ ] Search matches household-facing title, description and cuisine.
- [ ] Explicit Favourite and strong household ratings can surface in Favourites.
- [ ] Quick section is actually <=25 min.
- [ ] Recent is based on cook history.
- [ ] New to us excludes cooked recipes.
- [ ] Cuisine filters are readable, swipeable and 44px tall.
- [ ] Default library is compact; “Show all” is deliberate.
- [ ] From What We Have uses only real researched recipes; no generated combination guesses.
- [ ] Ready ranking uses real stock when Kitchen has been checked.
- [ ] Use Soon ingredients improve relevant recipe ranking.
- [ ] From Prep only shows components actually logged in stock.

## 6. Recipe detail
- [ ] Household-facing title and food description, not architecture copy.
- [ ] Favourite heart persists.
- [ ] Cook button enters cooking mode.
- [ ] Add to week opens day sheet; choosing day mutates weekly plan.
- [ ] Ingredients use canonical normalized quantities.
- [ ] Prep requirements use exact ml.
- [ ] Prep readiness uses exact component stock.
- [ ] Method comes from researched recipe.
- [ ] Serving notes stay useful and non-marketing.
- [ ] Reference link is present and truthful.
- [ ] Separate Josh / G ratings persist.
- [ ] “Next time” note persists and enters recipe history.
- [ ] Recipe history reflects cook events and notes.

## 7. Cooking mode
- [ ] One step at a time with large readable type.
- [ ] Back/Next are thumb-reachable.
- [ ] Screen wake-lock requested where supported and released on exit.
- [ ] Timer appears only when step text contains a real time cue.
- [ ] Timer completion gives optional feedback.
- [ ] Ingredient/prep drawer remains accessible without obscuring fixed footer.
- [ ] Camera opens Prep check and returns to the same cooking route.
- [ ] Ask Home can open while cooking.
- [ ] “Dinner’s ready” is idempotent (cannot deduct twice from one rendered completion).
- [ ] Exact prep ml is deducted.
- [ ] Exact measured ingredients are deducted.
- [ ] Pantry state items are not numerically decremented.
- [ ] Oldest dated prep batch is depleted first where ledger exists.
- [ ] Cook event is written.
- [ ] Josh/G rating controls appear immediately after finish.

## 8. Prep hub
- [ ] This week’s need appears before libraries/explainers.
- [ ] If Kitchen is unchecked, demand is clearly described as demand, not shortage.
- [ ] If stock covers the week, state says so and does not invent prep work.
- [ ] Mother shelf shows 8 foundations with honest stock state.
- [ ] Base → Mid → Dinner explorer uses real graph relationships.
- [ ] Selecting a mother updates connected mids and real cookbook dinners.
- [ ] Multi-parent mids remain multi-parent; no fake relationship for visual neatness.
- [ ] Zero-coverage mids say “not in our rotation yet”.
- [ ] Recent prep batches show date, produced ml and remaining ml / used up.
- [ ] Mids link to detail pages.
- [ ] Portion/freezer help is contextual, not an editorial wall.

## 9. Mother base detail (all 8)
- [ ] Route exists.
- [ ] Exact batch recipe exists.
- [ ] Method exists.
- [ ] Critical visual/doneness cues exist.
- [ ] Standard portion size and batch output are accurate.
- [ ] Current stock is displayed in ml + friendly standard portions.
- [ ] Make Batch opens confirmation sheet.
- [ ] Batch Finished adds exact batch ml and a dated prep-batch record.
- [ ] Linked mids are actual child relationships.
- [ ] Linked recipes are actual canonical recipes.
- [ ] JB/Singapore note appears where researched.
- [ ] Reference link opens the real source.

## 10. Mid-base library/detail (all 26)
- [ ] Every mid route exists.
- [ ] Search works.
- [ ] Cuisine grouping/filtering works.
- [ ] Parent mother links have 44px touch target.
- [ ] Standalone mids are visibly standalone.
- [ ] Multi-parent mids show every parent.
- [ ] Batch recipe/method/storage content present where researched.
- [ ] Source/tutorial controls never invent a URL; clearly-labelled search is acceptable where exact URL is not verified.
- [ ] Actual cookbook recipe count is truthful.
- [ ] Zero coverage uses “not in our rotation yet”, not fake dinner counts.
- [ ] Make Batch writes exact stock + dated batch record.

## 11. Prep Day
- [ ] “This week” derives only from weekly shortfalls.
- [ ] “Stock up” targets deliberate mother stock, not every component.
- [ ] Session does not begin until user taps Start Session; this freezes the work list so it does not disappear as stock updates.
- [ ] Jobs are ordered: long pots/reductions first → cooked bases/pastes → quick mixes.
- [ ] Each job shows equipment hint and batch output.
- [ ] Recipe link exists before session starts.
- [ ] Batch Done can be tapped the required number of times when multiple batches are needed.
- [ ] Completed batch updates freezer stock and dated ledger.
- [ ] Progress reflects completed batches, not merely jobs.
- [ ] Cooling/labelling/freezing rules remain visible.
- [ ] Reloading the page recomputes remaining need from actual stock even though visual session progress itself is ephemeral.

## 12. Kitchen
- [ ] First-use state clearly says Kitchen is not checked.
- [ ] Fridge / Freezer / Pantry tabs work.
- [ ] Search has an accessible name.
- [ ] Decision-relevant / stocked / Use Soon items sort first.
- [ ] Show All is deliberate.
- [ ] Quantity steppers are 44px and cannot go below zero.
- [ ] Pantry “Have / Out” items behave as state, not fake quantities.
- [ ] Use Soon can only be marked when stock > 0 and clears when stock reaches zero.
- [ ] Mother stock is ml internally and friendly portion count in UI.
- [ ] Mid/booster stock is shown honestly.
- [ ] Camera link opens Scan.
- [ ] Kitchen Checked persists.

## 13. Plan
- [ ] Week strip has seven dinners and is swipeable on phone.
- [ ] Tap a day opens swap sheet.
- [ ] Swap priorities: Use Soon → This Month pool → Favourite → household rating → speed.
- [ ] Swap writes plan and instantly recalculates groceries + prep.
- [ ] Use Soon strip surfaces flagged food and can clear a flag.
- [ ] Grocery gap visual distinguishes unchecked Kitchen from real top-up.
- [ ] Compact grocery list is persistent.
- [ ] Shop opens supermarket mode.
- [ ] Supermarket mode groups Fresh / Protein / Dairy / Pantry.
- [ ] Shopping progress and category progress update as items are checked.
- [ ] Grocery checks persist.
- [ ] Prep section reflects exact ml shortfall.
- [ ] Weekly reuse graphic uses actual prep requirements from seven planned recipes.

## 14. Monthly pool
- [ ] Monthly pool is persisted household state, not a derived decorative category.
- [ ] Default pool is diverse and based on real researched recipes.
- [ ] Edit opens modal sheet.
- [ ] Search works.
- [ ] Add/remove persists.
- [ ] Favourite state is visible.
- [ ] Weekly swap actually prefers recipes in the pool.
- [ ] Empty pool has a useful empty state.

## 15. Ask Home
- [ ] Persistent action opens from every standard app page.
- [ ] Tonight answer uses current week and household-facing recipe title.
- [ ] Use Soon answer reads flagged real stock.
- [ ] Grocery answer reads derived shopping needs.
- [ ] Prep answer reads derived exact shortfalls.
- [ ] Favourites answer reads explicit favourites + strong ratings.
- [ ] Mother stock answer reads real ml.
- [ ] If Kitchen is unchecked, Ask Home refuses to pretend it knows stock.
- [ ] Composer has explicit accessible name.
- [ ] Camera action opens Scan.
- [ ] Voice is not claimed until real voice is connected.

## 16. Camera / Scan
- [ ] Fridge / Freezer / Receipt / Prep / Meal modes fit phone without tiny type.
- [ ] File input has accessible name.
- [ ] capture=environment available on mobile.
- [ ] Selected image preview works.
- [ ] Prep check opened from cooking returns to cooking.
- [ ] No fake object recognition, OCR or doneness claim.
- [ ] UI tells user what manual action is needed until live vision is connected.

## 17. Data integrity
- [ ] Exactly 8 canonical mother bases.
- [ ] Exactly 26 canonical mids.
- [ ] Canonical researched recipe list contains 36 current recipes.
- [ ] Every recipe prep ID resolves to one canonical component.
- [ ] Every recipe has household-facing display copy.
- [ ] No duplicate recipe IDs.
- [ ] No duplicate prep IDs.
- [ ] Prep demand sums exact total ml.
- [ ] Prep shortfall = max(0, demand ml − freezer ml).
- [ ] Batch count = ceil(shortfall ml / batch output ml).
- [ ] Groceries = normalized recipe demand − Kitchen quantities; pantry state uses Have/Out semantics.
- [ ] Cooking consumes the exact same canonical quantities that Plan/Prep calculated.
- [ ] Recorded dated prep batches deplete FIFO; unrecorded/manual stock remains allowed.

## 18. Privacy / PWA
- [ ] Custom URL is meals.josh-gier.com.
- [ ] robots disallow indexing.
- [ ] metadata noindex/nofollow/noimageindex/nocache.
- [ ] no-referrer set.
- [ ] manifest display=standalone, scope=/, id=/.
- [ ] theme/background colours match shell.
- [ ] True account/auth gate remains a separate security task; do not pretend noindex is authentication.

## 19. Automated crawl gates
At primary 390×844:
- [ ] All active routes return 2xx or intentional framework redirect.
- [ ] All 36 recipe details return.
- [ ] All 36 cooking routes return.
- [ ] All 8 mother routes return.
- [ ] All 26 mid routes return.
- [ ] No document overflow.
- [ ] No console errors.
- [ ] No body copy <12px.
- [ ] No normal tap target below 44px.
- [ ] No banned internal jargon in rendered app copy.
- [ ] No broken images (naturalWidth=0).

## 20. Deferred capabilities (must stay honest)
These are deliberately not to be faked in V1:
- real computer vision for fridge/freezer/receipt/prep;
- receipt OCR;
- realtime voice;
- shared server persistence across Josh and G devices;
- authenticated household access;
- automatic expiry recognition;
- server-side price/history analytics.

When connected, each capability must read/write the same household entities already used by Home, Cook, Prep, Kitchen and Plan.
