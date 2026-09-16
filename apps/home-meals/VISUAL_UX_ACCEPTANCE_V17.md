# Home Meals — Visual / UX Acceptance Audit V17

Status: **NOT VISUALLY ACCEPTED — REMEDIATION REQUIRED**

Audit base: `935cae4d4e471e42dab9137ef6d00905f79dcd63`

## Purpose

This pass is deliberately stricter than the existing software acceptance suite. A route loading, a control having an accessible name, or a geometry assertion passing is not enough. The product must also look coherent, focus attention correctly, use natural household language, expose the right amount of information for the current state, and remain comfortable to use on an actual phone.

Acceptance rule:

> **It has to work, make sense, and look right in an actual screenshot.**

## Evidence collected

A production build from current `main` was run locally and exercised in Chromium with deterministic Home Meals household states.

The pass captured and inspected 20 representative phone states including:

- true fresh state with no person selected;
- fresh Josh before the walkthrough;
- fresh Josh with the old welcome already seen;
- Josh walkthrough invite;
- walkthrough Home step;
- walkthrough Kitchen step;
- walkthrough dismissal → Kitchen fallback;
- confirmed-empty Kitchen with no meal/prep decisions;
- Home preview with starter prep selected;
- Cook;
- Prep;
- Kitchen;
- Plan;
- From what we have;
- History;
- Scan;
- recipe detail;
- live cooking;
- More;
- short-phone walkthrough invite and active step at 360 × 640.

Core visual dimensions were checked at 390 × 844 and the guide was additionally walked at 360 × 640. Browser checks measured control dimensions, overlay/dialog stacking, viewport clipping, guide geometry, horizontal overflow and visible text sizing.

The real-device screenshot supplied by Josh is treated as higher-value evidence for perceived composition than synthetic geometry alone.

## Baseline passes

The following remain healthy and should be preserved during remediation:

- no sampled document-level horizontal overflow;
- persistent bottom navigation remains stable;
- the floating camera/orb/voice dock does not collide with the walkthrough card in the sampled states;
- the guide card itself avoids the bottom navigation;
- core routes load without browser page errors in this pass;
- cooking mode remains visually focused compared with the rest of the app;
- Scan and History empty states are comparatively clear;
- Prep's category-first information architecture is directionally strong.

## P1 findings

### VUX-001 — Current Josh screenshot is not a true zero-state

Josh reports that he has not chosen meals, prep or household decisions yet. The screenshot nevertheless shows:

> `This is a week Home could build, not a commitment...`

In `Home.tsx`, that branch is reached only after:

1. `kitchenReady === true`; and
2. `activePrepIds.length > 0`; and
3. the week is not confirmed.

The actual fresh V12 state measured in this audit is:

- `kitchenReady=false`;
- `activePrepIds=[]`;
- `weekStatus="unplanned"`.

Therefore the production household shown in Josh's screenshot is **not the untouched first-use state** even if Josh has not consciously made those decisions. The shared/local state must be diagnosed before any destructive reset is considered.

### VUX-002 — First-use has multiple competing teachers

A true fresh browser currently has more than one first-use system:

- the legacy Home `Start with what's true` screen;
- `FirstRunKitchen`;
- the talking-head walkthrough;
- household/session/person setup in configured production.

Deterministic reproduction found:

- true fresh/no-person: Home first-run plus the Kitchen setup dialog are both present;
- fresh Josh: the talking-head invite can sit over the old Home first-run screen;
- dismissing the walkthrough with Kitchen still unknown immediately hands the user to another setup sheet.

This is not a z-index problem. One entry/onboarding state machine must own the first-use sequence.

### VUX-003 — Walkthrough has no visual focus layer

`.hm-guide-layer` is fully transparent and uses `pointer-events:none`.

Measured computed style:

- background: `rgba(0, 0, 0, 0)`;
- layer pointer events: `none`.

The walkthrough therefore competes with the full live page underneath. The real-device screenshot confirms that the hero image, Home bubble, persistent dock, nav, guide head, guide bubble and detached close control all compete simultaneously.

Required design direction:

- invite: light scrim, approximately 20–30%, with background interaction blocked;
- active guided step: stronger scrim, approximately 35–50%, with a real spotlight/cut-out around the current target;
- only the intended target plus guide controls remain visually dominant.

### VUX-004 — Walkthrough close control is geometrically broken

The close button is positioned with `top:-38px` relative to the guide card.

The positioning engine frequently places the card at the 12px viewport clamp near the top. The close control is therefore partially or fully outside the viewport.

Reproduced at both 390 × 844 and 360 × 640:

- Kitchen step: close control off-screen;
- Cook step: close control off-screen;
- Prep step: close control off-screen;
- Plan step: close control off-screen.

On the 390px Kitchen step the card sat near `y=34` and the close control extended above the viewport. On other top-clamped steps the card sat near `y=12`, making the close control substantially negative.

The close circle also geometrically overlaps the bubble edge and visually reads as a detached object. The real-device screenshot confirms the broken appearance.

Required direction: remove the detached floating close control. The invite already has `Not now`. Active steps should use a small integrated Skip/Close affordance inside the bubble or a stable top-safe-area control.

### VUX-005 — Head / bubble composition is not visually accepted

Although the DOM rectangles do not mathematically overlap, the real-device screenshot shows the face visually crowded by the speech bubble and its pointer. The head, bubble, orb dock and hero all occupy the same small region.

Required direction:

- head is a deliberately docked companion to the bubble, never visually behind it;
- bubble tail must not intrude into facial pixels;
- placement chooses left/right/head-above/bubble-below variants based on available space;
- walkthrough layout must reserve the head as an exclusion zone, not merely the target/nav/dock.

### VUX-006 — A full fake-looking week appears before the household has made a week

The fresh V12 state contains `defaultWeek` as internal fallback data even while `weekStatus="unplanned"`.

Home therefore renders:

- `IDEA FOR TONIGHT`;
- seven dinner cards under `A week Home could build`.

Plan then derives a large preview from that unchosen week. In the confirmed-empty Kitchen test state it showed:

- **40** preview grocery gaps;
- **11** preview prep jobs.

This is technically labelled as preview, but it looks and feels like the app has already made household decisions. For a new Josh/G household this is too much implied commitment before activation.

Required direction: before the user explicitly asks Home to build a week, Home should show a clear zero-state / first useful action rather than a fully populated pseudo-week. Internal fallback data may remain internal.

## P2 findings

### VUX-007 — Touch targets still violate the project's own 44px standard

The prior completion audit does not cover several real action classes.

Measured visible controls below the 44px target include:

- Home household avatar link: 40px high;
- Home `Choose our prep`: 38px;
- Home `Build a week`: 38px;
- Home `Build our week`: 38px;
- Home `Plan ›`: 36px wide;
- Cook `Ask Home`: 40 × 40px;
- Plan `Build it for us`: 42px;
- Plan `Swap`: 40px;
- Plan build-mode primary action: 38px;
- Plan `Prep choices`: 38px;
- Builder `Start from a base`: 38px;
- Builder `Open the week`: 36px;
- Recipe `Add to week`: 38px;
- Recipe `See the list`: 38px;
- More `Choose dinner`: 36px;
- first-run footer action: approximately 43.5px.

Cause: completion.css covers `.hm-btn.xs`, chips, section actions and some route-specific controls, but not `.hm-bubble-actions`, `.hm-build`, `.swap` and several bare anchors/buttons.

### VUX-008 — User-facing copy still leaks the internal model

The visual pass found active product language that should not be shown to Josh/G in normal use, including:

- `Set Kitchen truth`;
- `recorded Kitchen` / `recorded things`;
- `active prep`;
- `repertoire`;
- `qualitative`;
- `reference min`;
- `source-tested formulation`;
- `V6 composition estimate`;
- `confidence D`;
- `packetise` / `storage packets + remainder` in primary help;
- `CODE / EXACT QTY / DATE` as prominent guide language.

Food-truth rigor remains necessary internally. The UI needs a human-language translation layer.

### VUX-009 — Walkthrough instruction text is too small for a primary teaching surface

Guide copy is 14px at normal phone widths and falls to 13px below 380px. This is the main instructional voice of the walkthrough, not utility metadata.

Required direction: primary guide copy should normally be around 15–16px with comfortable line-height; progress and helper labels may remain smaller.

### VUX-010 — Prep category descriptions are below the product's own text standard

The five Prep family descriptions render at **11px** in the sampled 390px state, despite the master implementation plan setting secondary text at 13px minimum unless justified.

### VUX-011 — Plan exposes too much operational consequence before commitment

The unplanned Plan screen immediately shows a complete seven-day strip, grocery count, prep count, shared prep summary and derivation math.

This is useful after a proposal exists. Before the household has asked for a week, it is cognitively heavy and makes preview data feel authoritative.

### VUX-012 — Empty Kitchen is operationally correct but visually exhausting

A confirmed-empty Kitchen immediately renders a long inventory list with repeated `Out / Low / Some / Plenty / tap for exact` controls.

This is functional but not a strong first-use composition. The first empty-Kitchen view should foreground:

- add something;
- scan fridge/freezer/pantry;
- search;
- category entry;
- the few items relevant to a confirmed week.

The complete tracked catalogue can remain available progressively.

### VUX-013 — Recipe detail exposes QA/provenance before household utility

The recipe page visibly includes technical metadata such as:

- `~720 kcal / person`;
- `V6 composition estimate`;
- `±25%`;
- `confidence D`;
- `reference min`;
- `source-tested formulation`.

Even where the underlying information is legitimate, the presentation reads like an internal verification panel rather than a private household recipe.

The page should lead with dinner, readiness, ingredients, prep, method, cues and Josh/G memory. Methodology/provenance belongs behind a secondary disclosure.

## P3 findings

### VUX-014 — Small utility text is overused

A number of surfaces rely heavily on 11–12px labels. Some are appropriate utility metadata, but combined density makes Kitchen, Plan, Prep and More feel more like an operational dashboard than a domestic cooking companion.

This should be reviewed visually after the P1/P2 hierarchy fixes rather than solved by globally increasing every font.

## Guide-specific acceptance contract for remediation

The guide is not accepted until all of the following pass on 360 × 640, 390 × 667, 390 × 844 and 430 × 844:

1. invite has a deliberate scrim and one clear decision;
2. active steps have a stronger scrim plus spotlight;
3. underlying UI cannot steal taps during invite;
4. during an active step only the intended target remains interactable, except an explicit detour policy;
5. head is never visually covered by the bubble/tail;
6. close/skip never leaves the viewport;
7. no guide element covers its target, dock, nav, fixed CTA or keyboard;
8. guide copy is comfortably readable;
9. route changes preserve context without flicker or stale copy;
10. Kitchen is taught inside the walkthrough when unknown;
11. Josh and G each get one first-use tour state, with G-specific affectionate copy only for G;
12. replay remains available later;
13. reduced-motion preserves the same content and hierarchy;
14. screenshots are manually inspected, not accepted from geometry assertions alone.

## First-use product decision required

The current implementation technically permits a populated preview before the household has planned anything. V17 does **not** accept that as the default first-use presentation.

Preferred sequence:

`connect / identify → one walkthrough → establish Kitchen enough to be useful → explicit Build our first week action → proposed week → confirm → normal Home`

Before `Build our first week`, Home may show recipe inspiration, but must not visually resemble an already-created weekly plan.

## Remediation order

1. **First-use arbiter and state diagnosis** — VUX-001 / 002 / 006.
2. **Walkthrough presentation rebuild** — VUX-003 / 004 / 005 / 009.
3. **Touch-target sweep** — VUX-007.
4. **Human-language pass** — VUX-008 / 013.
5. **First-use information hierarchy** — VUX-011 / 012.
6. **Typography/density polish** — VUX-010 / 014.
7. **Repeat screenshot acceptance** at all canonical phone sizes plus real-device Josh/G review.

## Acceptance decision

**REJECT visual/product acceptance on the current line.**

The software foundation remains usable and many mechanics are sound, but first-use, walkthrough composition, touch-target consistency, human-language quality and several dense task layouts do not yet meet the intended Home Meals quality bar.
