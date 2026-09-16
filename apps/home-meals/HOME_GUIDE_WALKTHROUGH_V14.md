# Home Meals Talking-Head Walkthrough V14

## Scope

Home Guide teaches the real Home Meals product through the real UI. It never creates onboarding pages, fake screenshots, locked demo screens, or a separate tutorial mode.

The guide uses the small transparent animated 3D Josh sticker head with a speech bubble. For G, the tone is natural couple-language: warm, casual and occasionally affectionate. For Josh, the same guide is straightforward and familiar rather than pretending Josh is talking romantically to himself.

Automatic onboarding is for **both Josh and G on first use**. It is tracked separately per person. G gets the couple-style opening; Josh gets a neutral quick-tour opening. After first use, either Josh or G can summon the guide from the existing green Home orb with **Show me around**.

## Product standards

1. **Teach by doing.** Josh or G taps the actual Cook / Prep / Kitchen / Plan controls. The guide points; it never reproduces controls.
2. **Activation before feature dumping.** First run teaches the five core mental models plus the Home orb. Deep features stay available as specific help topics.
3. **User controls pace.** No timed auto-advance. Navigation or an explicit action advances the experience.
4. **Never trap the user.** The underlying app stays usable. Detours are accepted. Escape / close always exits.
5. **Progressive disclosure.** Camera, voice, live cooking and History are explained on demand instead of bloating first run.
6. **Permissions at intent.** The guide can explain camera / voice, but only the real camera / voice action may trigger OS permission prompts.
7. **Persistent but not nagging.** Each person gets one automatic opportunity. Completion or dismissal prevents automatic reappearance for that person. Replay remains manual.
8. **Spatial safety.** Head and bubble avoid the target, fixed CTA, persistent input dock, bottom nav, focused inputs and the visual keyboard viewport.
9. **Accessible equivalent.** Text is always present. Audio is optional. Reduced-motion users receive the same guidance without travel/bobbing/talking animation.
10. **Small personality, high usefulness.** Pet names are for G only and occasional. The guide is useful first, never customer-success theatre.

## Character contract

The canonical Josh likeness is the approved floating-head sticker design derived from Josh's supplied reference photos. Runtime assets live in:

`/public/images/home-guide/`

The nine expression frames are:

- `idle.webp`
- `talk.webp`
- `happy.webp`
- `surprised.webp`
- `affectionate.webp`
- `wink.webp`
- `thinking.webp`
- `laughing.webp`
- `sheepish.webp`

All are transparent, head-only assets. No torso, shoulders, room, card portrait, fake environment, or independently redesigned face is allowed. New reactions must preserve the approved face shape, skin tone, freckles, beard geometry, hair and 3D-sticker treatment.

## First-run journey for Josh + G

### Trigger

- person is `josh` or `g`
- current route is one of the five core surfaces
- that person's guide state is `unseen`
- no modal sheet/dialog is open

Kitchen readiness is **not** a prerequisite. If Kitchen is still unknown, the walkthrough teaches Kitchen early and continues from there.

### Entry

**Anchor:** green Home orb  
**Expression:** hello pop

For G:

`Hey sunshine ☀️. Come, I’ll show you around. Takes a minute.`

For Josh:

`Quick tour. I’ll show you how everything fits together. Takes a minute.`

**Actions:** `Show me` / `Not now`

`Not now` permanently stops automatic prompting for that person. The guide can still be summoned later.

### Core lap

When Kitchen is already set, the preferred order is Home → Cook → Prep → Kitchen → Plan → Home. The route remains adaptive rather than locked. If the user chooses another main tab, the guide follows the actual route, explains where they went, and continues with the remaining unseen surfaces.

When Kitchen is not set, the walkthrough goes Home → Kitchen first so the user understands what Kitchen is and how to update it, then continues through the remaining core surfaces. The user does not have to finish Kitchen setup before continuing the tour.

| Surface | Core teaching point | Preferred next action |
| --- | --- | --- |
| Home | `This is home base. Tonight and the week start here.` | Tap Cook, or Kitchen first when Kitchen is unknown |
| Cook | `All our recipes live here. Once Kitchen is set, ‘Ready now’ means we can actually make it with what’s at home.` | Tap Prep |
| Prep | `Prep is our shortcut stash — bases, pastes, sauces and boosters we make ahead so dinner’s easier.` | Tap Kitchen |
| Kitchen | `Kitchen is what we actually have — fridge, freezer and pantry. Tap things to update them or use the camera.` | Tap Plan / next unseen area |
| Plan | `This is our week. Suggestions aren’t locked until we confirm them, and either of us can change anything we don’t fancy.` | Return Home |

A subtle `n/5` progress cue communicates length without turning the experience into a wizard.

### Finish

**Anchor:** green Home orb  
**Expression:** wink / pleased

For G:

`And this little green thing is me. Tap it whenever you’re not sure — ask me, talk to me, show me something, or get me to walk you through any bit again.`

For Josh:

`That’s the lot. The green orb is Home — tap it anytime to ask, talk, show it something, or replay any part of this.`

**Action:** `Got it`

Completion persists separately for Josh and G and never auto-runs again for that person.

## Summoned guide: Josh or G

Entry remains the existing Home orb → Ask Home → **Show me around**.

The summoned bubble asks:

`Yep. Quick lap, the whole thing again, or just one bit?`

Options:

- **Quick refresher** — same five core surfaces with short copy, roughly 30 seconds.
- **Whole thing** — replay the complete core walkthrough without altering first-run completion state.
- **One bit** — choose a specific topic.
- **This screen** — explain only the current supported screen.

### Quick refresher

- Home: `Home is tonight and the week at a glance.`
- Cook: `Cook is all our recipes.`
- Prep: `Prep is the make-ahead stuff that makes dinner quicker.`
- Kitchen: `Kitchen is what we physically have.`
- Plan: `Plan is our shared week.`

Finish: `Yep, that’s the app. Tap me anytime if you only want a refresher on one bit.`

## One-bit help topics

**Home**  
`Home is the quick read: tonight, what’s coming up, and anything Home thinks needs attention.`

**Cook**  
`Cook is the whole recipe library. Filters like Ready now, favourites and not lately are just different ways into the same recipes.`

**Prep**  
`Prep is the make-ahead system. Bases start dishes, mids and sauces shape them, boosters finish them. Prep Day only makes what the week actually needs.`

**Kitchen**  
`Kitchen is the fridge, freezer and pantry — basically what we have at home. Home only uses what we’ve actually added.`

**Plan**  
`Plan is our shared week. We can move dinners around, change our minds and confirm the week when it actually looks right.`

**Ask & voice**  
`Tap the green orb and ask me normally. The mic beside it is the same thing spoken instead of typed.`

**Camera**  
Persistent control: `That camera is for showing me instead of typing. I’ll suggest what I see and you confirm before Kitchen changes.`  
Inside Scan: `Show me the fridge, freezer, pantry, receipt, prep or dinner. I’ll suggest what I can see, and nothing changes until you confirm it.`

**Cooking**  
From Cook: `Pick any recipe. Open it, then Start cooking gives you the step-by-step cooking mode, timers, finish logging, ratings and notes.`  
Recipe detail: `This is the recipe page. Check what goes in, the steps and what Kitchen says — then Start cooking when you’re ready.`  
Live cooking: `This is live cooking mode: one step at a time, timers when they matter, swipe or Next to move on, and Done logs dinner at the end.`

**History**  
`History is what keeps Home from getting repetitive. It remembers what we cooked, when, favourites and Josh/G ratings separately.`

The walkthrough never triggers camera or microphone permissions itself.

## State model

Per-person local state:

`home-meals-guide-v1:<person>`

Terminal values:

- `completed`
- `dismissed`

Automatic first run reads the **current person's** state. Josh and G therefore get independent first-use walkthroughs on the same browser/device profile. Manual replay does not overwrite first-run state for either person.

Transient runtime state:

- stage: welcome / menu / topics / tour / topic / finish
- mode: first / full / quick / topic
- current topic
- core surfaces seen in this lap

## Navigation and detours

The guide never blocks main navigation. If the highlighted tab is ignored and another core tab is selected, Home Guide logs the detour, follows the actual route, explains that surface, and continues with the remaining unseen surfaces.

Deep routes suspend the core lap until the user returns to a supported core surface. Specific topic help can explain supported deep routes such as recipe detail, live cooking, Scan and History.

## Spatial / collision rules

For every visible frame:

1. read `visualViewport` when available;
2. measure anchor and highlighted control;
3. generate right, left, above, below and viewport-corner candidates;
4. heavily penalise overlap with the highlighted target;
5. penalise overlap with `.hm-bar-pill`, `.hm-bar-nav`, `.hm-cta`, focused inputs and explicit exclusions;
6. clamp to the visual viewport with 12px edge safety;
7. recompute on scroll, resize, visualViewport changes, ResizeObserver and DOM mutation.

The guide must never cover the control it is asking the user to tap.

## Motion language

- Entry: ~320ms card fade/scale.
- Hello: ~580ms spring pop.
- Talking: discrete sticker-frame mouth loop, not photoreal lip sync.
- Affectionate idle: tiny 2–3px bob.
- Surprised / wink / happy / laughing / sheepish: sub-1s micro-reactions.
- Thinking: tiny tilt/bob only.
- Route changes: card repositions over ~320ms.

No automatic speech is required. Talking animation visually accompanies the text bubble. `prefers-reduced-motion: reduce` removes travel, bobbing and mouth-loop animation while preserving the exact copy and controls.

## Accessibility

- polite live-region text;
- no focus stealing when a step appears;
- Escape closes the guide;
- every guide action is at least 44px high;
- underlying app remains operable;
- animation is never required to understand a step;
- modal/sheet collisions temporarily suppress the guide and resume afterward;
- no camera/mic permission without direct user intent.

## Analytics / QA events

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

These events exist for acceptance and debugging, never to make the guide nag more aggressively.

## Release acceptance

A release fails if any of these regress:

- Josh or G no longer gets the automatic first-use walkthrough when their state is unseen;
- dismissed/completed walkthrough returns automatically for that person;
- G receives Josh's neutral opening or Josh receives G's `sunshine` opening;
- Kitchen readiness becomes a prerequisite for first-run walkthrough;
- fallback Kitchen setup pre-empts either person's first-use walkthrough;
- replay disappears from Ask Home;
- quick / full / one-bit / this-screen help disappears;
- guide blocks the real target or persistent dock;
- Camera / Cooking / History deep help disappears;
- reduced-motion mode still animates;
- temporary CSS-drawn face returns;
- any of the nine approved Josh expression frames is missing or unwired;
- guide touch targets fall below 44px.

## Explicitly not allowed

- onboarding carousel;
- separate tutorial pages;
- fake app screenshots;
- locked forced-next sequences;
- automatic camera/mic permission prompts;
- autoplay voice on first launch;
- random tutorial popups after onboarding;
- full-body mascot artwork;
- independently redesigned Josh faces between reactions;
- customer-success language (`module`, `workflow`, `congratulations`, etc.);
- calling G `sunshine` in every message;
- calling Josh `sunshine` in the walkthrough;
- covering a CTA, keyboard, camera control, bottom navigation or the element being explained.
