# Home Meals Talking-Head Walkthrough V14

## Scope

This walkthrough teaches the real Home Meals product through the real UI. It never introduces onboarding pages, fake screenshots, locked demo screens, or a separate tutorial mode.

The guide is Josh represented as a small floating animated sticker head with a speech bubble. The tone is natural couple-language: warm, casual, occasionally affectionate, never corporate, childish, or over-performative.

Automatic onboarding is only for G on first use after Kitchen truth is established. Josh never gets an automatic tour. After the first run, either Josh or G can summon the guide from the existing green Home orb with **Show me around**.

## Research-derived product standards

1. **Teach by doing.** The user taps the actual Cook / Prep / Kitchen / Plan controls. The guide points; it does not reproduce controls.
2. **Activation before feature dumping.** First run teaches the five core mental models and the Home orb. Deep features remain available as specific refresher topics.
3. **User controls pace.** No auto-advance timers. Navigation or an explicit button advances the experience.
4. **Never trap the user.** The underlying app stays usable. Detours are accepted. Escape / close always exits.
5. **Progressive disclosure.** Camera, voice, cooking mode and History are explained on demand instead of forcing permissions or deep workflows into first run.
6. **Permissions at intent.** The walkthrough can explain camera / voice but must not trigger OS permission prompts itself.
7. **Persistent but not nagging.** G gets one automatic opportunity. Completion or dismissal prevents automatic reappearance. Replay remains available manually.
8. **Spatial safety.** The head and bubble avoid the target, fixed CTA, persistent input dock, bottom navigation, focused inputs and the visual keyboard viewport.
9. **Accessible equivalent.** Text is always present. Audio is optional. Reduced-motion users get the same information without floating/travel/talking animation.
10. **Small personality, high usefulness.** Pet names are occasional. The guide sounds like Josh helping G, not a customer-success agent.

## Character contract

Canonical visual asset: `/public/images/home-guide/josh-head-sprite.webp`.

The sprite is derived from the approved Josh sticker likeness. It contains nine expression states:

- idle
- talking
- happy
- surprised
- affectionate
- wink
- thinking
- laughing
- sheepish

The head is transparent, head-only, with no torso, room, card portrait, or fake environment.

## First-run journey for G

### Trigger

- person === `g`
- Kitchen truth is established
- current route is one of the five core surfaces
- guide state for G is `unseen`
- no modal sheet/dialog is currently open

### Entry

**Anchor:** green Home orb  
**Expression:** affectionate / hello pop  
**Copy:** `Hey sunshine ☀️. Come, I’ll show you around. Takes a minute.`  
**Actions:** `Show me` / `Not now`

`Not now` means no more automatic prompts. G can still summon the guide later.

### Core lap

The lap is adaptive rather than locked. It prefers Home → Cook → Prep → Kitchen → Plan → Home, but if G chooses a different main tab the guide follows and explains where she went.

| Surface | Exact core teaching point | Next preferred action |
| --- | --- | --- |
| Home | `This is home base. Tonight and the week start here.` | Tap Cook |
| Cook | `All our recipes live here. ‘Ready now’ only means Kitchen says we can actually make it.` | Tap Prep |
| Prep | `Prep is our shortcut stash — bases, pastes, sauces and boosters we make ahead so dinner’s easier.` | Tap Kitchen |
| Kitchen | `Kitchen is what we actually have. If it isn’t recorded here, Home won’t pretend it is.` | Tap Plan |
| Plan | `This is our week. Suggestions aren’t locked until we confirm them, and either of us can change anything we don’t fancy.` | Return Home |

A subtle `n/5` progress cue communicates length without turning the experience into a wizard.

### Finish

**Anchor:** green Home orb  
**Expression:** wink / pleased  
**Copy:** `And this little green thing is me. Tap it whenever you’re not sure — ask me, talk to me, show me something, or get me to walk you through any bit again.`  
**Action:** `Got it`

Completion persists `completed` for G and never auto-runs again.

## Summoned guide: Josh or G

Entry remains the existing Home orb → Ask Home → **Show me around**.

The first summoned bubble asks:

`Yep. Quick lap, the whole thing again, or just one bit?`

Options:

- **Quick refresher** — same five core surfaces, shorter copy, ~30 seconds.
- **Whole thing** — replay the full first-run core lap without touching first-run completion state.
- **One bit** — opens topic choices.
- **This screen** — when the current route has a supported guide topic, explain only the current screen.

### Quick refresher copy

- Home: `Home is tonight and the week at a glance.`
- Cook: `Cook is all our recipes.`
- Prep: `Prep is the make-ahead stuff that makes dinner quicker.`
- Kitchen: `Kitchen is what we physically have.`
- Plan: `Plan is our shared week.`

Finish: `Yep, that’s the app. Tap me anytime if you only want a refresher on one bit.`

## One-bit help topics

### Home
`Home is the quick read: tonight, what’s coming up, and anything Home thinks needs attention.`

### Cook
`Cook is the whole recipe library. Filters like Ready now, favourites and not lately are just different ways into the same recipes.`

### Prep
`Prep is the make-ahead system. Bases start dishes, mids and sauces shape them, boosters finish them. Prep Day only makes what the confirmed week actually needs.`

### Kitchen
`Kitchen is household truth: fridge, freezer and pantry. Home only uses what we’ve actually recorded.`

### Plan
`Plan is our shared week. We can move dinners around, change our minds and confirm the week when it actually looks right.`

### Ask & voice
`Tap the green orb and ask me normally. The mic beside it is the same thing spoken instead of typed.`

No microphone permission is requested by the tutorial. Permission belongs to the actual voice action.

### Camera
From the persistent camera control:

`That camera is for showing me instead of typing. I’ll suggest what I see and you confirm before Kitchen changes.`

Inside Scan:

`Camera is reference, not magic. Show me the fridge, freezer, pantry, receipt, prep or dinner — I suggest what I see, and nothing changes until you confirm it.`

The tutorial never triggers camera permission on its own.

### Cooking
From Cook:

`Pick any recipe. Open it, then Start cooking gives you the step-by-step cooking mode, timers, finish logging, ratings and notes.`

From a recipe detail:

`This is the recipe page. Check what goes in, the steps and what Kitchen says — then Start cooking when you’re ready.`

Inside live cooking mode:

`This is live cooking mode: one step at a time, timers when they matter, swipe or Next to move on, and Done logs dinner at the end.`

### History
`History is what keeps Home from getting repetitive. It remembers what we cooked, when, favourites and Josh/G ratings separately.`

## State model

Per-person local state:

`home-meals-guide-v1:<person>`

Supported terminal values:

- `completed`
- `dismissed`

Automatic first run reads only G's state.

Manual replay does not overwrite first-run state for either person.

Transient runtime state includes:

- stage: welcome / menu / topics / tour / topic / finish
- mode: first / full / quick / topic
- current topic
- core surfaces seen in this lap

## Navigation and detours

The guide never blocks main navigation.

If a highlighted main tab is ignored and another core tab is selected:

1. log a detour event;
2. follow the actual route;
3. explain the actual surface;
4. continue with the remaining unseen core surfaces.

Deep routes suspend the core lap until the user returns to a supported core surface. Specific topic help can explain supported deep routes such as recipe detail, live cooking, Scan and History.

## Spatial / collision rules

For every visible guide frame:

1. read `visualViewport` when available;
2. measure current anchor / highlight;
3. generate right, left, above, below and viewport-corner candidates;
4. heavily penalise overlap with the highlighted target;
5. penalise overlap with `.hm-bar-pill`, `.hm-bar-nav`, `.hm-cta`, focused inputs and explicit exclusions;
6. clamp to visual viewport with 12px edge safety;
7. recompute on scroll, resize, visualViewport changes, ResizeObserver and DOM mutation.

The guide must not cover the control it is asking the user to tap.

## Motion language

- Entry: ~320ms card fade/scale.
- Hello: ~580ms spring pop.
- Talking: small discrete sticker-frame mouth loop, not continuous photoreal lip sync.
- Affectionate idle: very small 2–3px bob.
- Wink / happy: sub-1s micro-reaction.
- Route changes: card repositions over ~320ms.

No automatic speech is required. The talking animation is visual accompaniment to the text bubble.

`prefers-reduced-motion: reduce` removes floating, bobbing, travel and mouth-loop animation while preserving the same copy and controls.

## Accessibility

- guide text uses polite live-region semantics;
- no focus stealing when a step appears;
- Escape closes the guide;
- every guide action is at least 44px high;
- underlying app stays operable;
- animation is never required to understand a step;
- modal/sheet collisions temporarily suppress the guide and resume after the modal closes;
- no camera/mic permission prompt occurs without direct user intent.

## Analytics / QA events

Useful events only:

- `home_guide_started`
- `home_guide_first_run_accepted`
- `home_guide_quick_refresher`
- `home_guide_full_replay`
- `home_guide_topic_menu`
- `home_guide_specific_help_selected`
- `home_guide_step_seen`
- `home_guide_target_clicked`
- `home_guide_detour`
- `home_guide_completed`
- `home_guide_dismissed`
- `home_guide_closed`

These events are for acceptance / debugging. They must never be used to make the guide nag more aggressively.

## Release acceptance

A release fails if any of the following regress:

- automatic walkthrough appears for Josh;
- dismissed/completed G walkthrough returns automatically;
- replay is unavailable from Ask Home;
- quick / full / one-bit refresher modes disappear;
- guide blocks the real target or persistent dock;
- deep-topic help cannot explain Camera / Cooking / History;
- reduced-motion mode still animates;
- the temporary CSS-drawn fake face returns;
- the approved Josh sticker sprite is missing;
- guide action targets fall below the 44px project standard.

## Explicitly not allowed

- onboarding carousel;
- separate tutorial pages;
- fake app screenshots;
- locked forced-next sequences;
- automatic camera or mic permission prompts;
- autoplay voice on first launch;
- random tutorial popups after onboarding;
- full-body mascot artwork;
- customer-success language (`module`, `workflow`, `congratulations`, etc.);
- calling G `sunshine` in every message;
- covering a CTA, keyboard, camera control, bottom navigation or the element being explained.
