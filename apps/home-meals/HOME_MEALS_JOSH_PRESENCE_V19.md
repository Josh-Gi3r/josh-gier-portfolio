# Home Meals — Josh Presence, Guides & Show Me V19

Status: implementation brief + acceptance contract
Date: 2026-09-17
Owner: Home Meals

## Product brief

Home Meals currently has two competing assistant identities: the anonymous green orb and Josh. That fragmentation makes the assistant layer feel bolted onto an otherwise coherent household product. V19 makes Josh the single visible assistant/guide identity across Home Meals and rebuilds guidance and camera flows around that decision.

The intended experience is simple:

> Josh is the one who explains, helps, listens and looks. There is never more than one Josh on screen.

This is a presentation/interaction layer. It must preserve the deterministic household engine, food truth, planning, sync, Ask Home confirmation gates, Vision confirmation gates, cooking, ratings and history.

## Design principles

1. **One Josh. Never two.**
   - The dock, inline assistant bubble, Ask, Voice, Camera and walkthrough all draw from one presence system.
   - A higher-priority surface temporarily owns Josh; lower-priority surfaces yield.
2. **Josh has personality, not product-manager prose.**
   - Warm, concise, specific, domestic.
   - G's first-run opening stays affectionate: **“Hey sunshine! ☀️”**.
   - Navigation controls are visually distinct from the concepts being explained.
3. **One guide system, multiple useful guides.**
   - First-use full tour.
   - Replay from More at any time.
   - Short task guides for Kitchen, planning, Prep, cooking, camera, Ask/voice and History.
   - “This screen” remains available contextually.
4. **The camera must be honest about browser behaviour.**
   - Do not pretend an empty web page is a live viewfinder when the phone opens the native camera.
   - Before capture: mode + explanation + **Take a photo** / **Choose a photo**.
   - After capture: the actual photo becomes the visual focus, Josh reviews it, and any Kitchen changes remain confirm-first.
5. **Existing expression assets are a product capability.**
   - Use idle, talk, happy, surprised, affectionate, wink, thinking, laughing and sheepish states contextually.
   - Do not generate replacement likenesses in V19 unless the existing nine-state set proves insufficient.

## Scope

### A. Josh Presence

Create one reusable Josh-head component and one presence coordinator.

Priority order:

1. active walkthrough / guide
2. active voice / Ask
3. Show Me / camera
4. visible inline Home speech
5. persistent dock

Required behaviours:

- centre dock action is Josh, not the green orb;
- inline Home speech uses Josh when it owns presence;
- Ask Home has one Josh, not a large orb plus message orbs;
- walkthrough uses the same reusable Josh component;
- no active user-facing assistant surface may render the legacy orb as a second character;
- Josh returns to the dock when the higher-priority surface closes or scrolls away.

### B. Guide system

Keep the existing viewport-safe scrim/spotlight engine, but replace the content model.

Full app tour:

- Home — what matters now;
- Cook — recipes and “Ready now”;
- Prep — make-ahead shortcuts;
- Kitchen — what is actually at home;
- Plan — week suggestions are not decisions until kept;
- Josh — ask, talk or show.

Task guides available at will:

- Show me around — complete tour from Home;
- Kitchen setup;
- Build our week;
- Prep & freezer;
- Prep Day;
- Cooking mode;
- Show Josh / camera;
- Ask & voice;
- History & ratings;
- This screen.

Copy requirements:

- no “Now Prep”, “Next, Kitchen”, “home base”, “prep repertoire”, “active prep”, implementation terminology or generic AI coaching filler;
- each explanation is a short human thought;
- when asking the user to tap a real control, render that control name as a separate highlighted action cue rather than burying it in prose;
- G may receive affectionate language; Josh receives friendly neutral language.

### C. More / discoverability

More becomes the permanent guide hub.

- First-class **Show me around** action;
- task-guide collection below it;
- the existing static food-system guides may remain, but they are secondary to interactive Josh guides;
- replaying a guide must never reset Kitchen, Plan, ratings, history or first-run data.

### D. Show Josh / Camera

Replace the empty dark-green fake viewfinder with an honest capture launcher.

Before capture:

- clear mode title;
- Josh visible once;
- short instruction;
- horizontal mode selector;
- **Take a photo** using `capture="environment"`;
- **Choose a photo** using the photo library;
- manual-entry escape route where relevant.

After capture:

- actual selected photo becomes the hero;
- Josh transitions to thinking/talking while Vision runs;
- Vision proposals remain confirmation-only;
- Fridge / Freezer / Pantry / Receipt / Prep / Dinner modes remain;
- food-safety warning remains explicit for Prep/Meal visual review;
- manual controls remain available when Vision is unavailable.

### E. Ask / Voice copy

Remove remaining internal-language leaks from assistant entry points.

Examples to remove:

- “prep repertoire”;
- “active prep repertoire”;
- “household brain”;
- system-oriented descriptions of Kitchen/Plan internals.

Ask should sound like Josh helping at home, not an AI describing its context window.

## Non-goals

V19 does not change:

- the 136 live-recipe catalogue;
- culinary formulations or nutrition engine;
- ingredient/prep arithmetic;
- V12 shared household state shape unless absolutely required for guide UI state;
- planner ranking algorithm;
- sync/conflict semantics;
- Vision model contract or confirmation requirement;
- Ask mutation schema;
- Railway/Postgres architecture.

## Execution plan

### Phase 1 — Identity foundation

- build reusable `JoshHead` with all nine expressions;
- add `JoshPresenceProvider` and slot priority logic;
- wire provider at root layout;
- move walkthrough head onto shared component;
- replace persistent dock orb with Josh;
- update inline Home speech and Ask to participate in single-presence ownership.

Acceptance:

- exactly one visible `.hm-josh-head` across Home, Plan, Ask and walkthrough states;
- no duplicated Josh between dock and inline bubble;
- closing a modal/guide returns Josh to the correct lower-priority location.

### Phase 2 — Guide content & guide library

- rewrite full-tour copy;
- add visual tap/open cues for highlighted controls;
- reframe “One bit” into useful task guides;
- add multi-step Kitchen/Plan/Prep/Camera guides where useful;
- add permanent guide entry in More;
- preserve Quick refresher / Whole thing / This screen.

Acceptance:

- G opening contains “Hey sunshine! ☀️”;
- no banned guide-copy phrases;
- full tour still tolerates detours;
- More can restart the full tour without touching household state.

### Phase 3 — Show Josh camera UX

- remove fake empty viewfinder;
- build pre-capture Show Josh launcher;
- retain native camera/library inputs;
- make actual selected photo the hero after capture;
- coordinate Josh expression with loading/result state;
- improve Vision result placement/copy without changing confirmation semantics.

Acceptance:

- empty Scan state contains no fake camera frame;
- camera and library inputs remain available for all six modes;
- Vision cannot mutate Kitchen before confirmation;
- manual fallback remains usable.

### Phase 4 — Assistant copy closeout

- rewrite SmartAsk default/quick/fallback copy;
- remove remaining orb-centric language (“green orb”);
- rename user-facing guide labels where needed;
- make Josh the conversational subject consistently.

### Phase 5 — Release protection & QA

- add V19 audit for single-Josh invariant, guide entry, expression wiring, camera honesty and banned copy;
- update browser tests for one-head ownership across dock → guide → Ask → Scan;
- test canonical phone widths 360×640, 390×667, 390×844, 430×844;
- run `npm run audit:data`, typecheck, build and E2E;
- QA on a branch deployment first;
- fast-forward main only when release gates pass;
- verify exact production SHA on Railway.

## Definition of done

V19 is complete when:

1. Josh is the only assistant identity shown to the household;
2. no meaningful state can display two Josh heads;
3. the persistent dock uses Josh instead of the green orb;
4. Ask, guide and camera use the same expression system;
5. More can launch the full tour and focused guides at any time;
6. tutorial copy is human, specific and distinguishes concepts from tappable controls;
7. the camera empty state no longer resembles a fake live viewfinder;
8. all six photo modes still work through native capture/library inputs;
9. Vision remains proposal-first and safety-honest;
10. existing household, food, planning, sync and cooking contracts remain green;
11. V19 branch build/E2E is green before main is advanced;
12. the exact accepted main SHA deploys successfully on Railway.
