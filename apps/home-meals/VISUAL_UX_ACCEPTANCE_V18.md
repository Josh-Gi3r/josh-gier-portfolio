# Home Meals — Visual / UX Acceptance V18

Status: **CANONICAL MOBILE PASS — READY FOR PRODUCTION DEPLOYMENT**

V18 closes the first-use, walkthrough, copy, touch-target and zero-state defects identified in V17.

## Locked product behavior

- Entry order: `connect / identify → resolve sync → walkthrough → Kitchen fallback if still needed → app`.
- `weekStatus === "unplanned"` never exposes the internal default week as household decisions. Home may show a **DINNER IDEA**; Plan does not show a week strip, plan hero, shopping/prep consequence cards or weekly gap math until the household explicitly taps **Make our week**.
- Guide invite uses a 28% scrim. Active guide steps use a 46% spotlight surround. The intro has no detached X; active close is inside the bubble and 44 × 44 px.
- Unknown Kitchen is taught using the real Fridge / Freezer / Pantry tabs, camera and Kitchen checked control.
- First empty Kitchen starts calmly with search, camera and Browse all instead of an arbitrary inventory wall.
- Active UI and AI prompts use normal household language, not implementation vocabulary.

## Acceptance evidence

Production build exercised locally with deterministic household states.

- **92 / 92** broad route/view states pass: 23 routes × 4 canonical phone sizes.
- **28 / 28** true zero-state views pass: 7 key routes × 4 phone sizes.
- **4 / 4** guide viewports pass.
- **2 / 2** week-activation viewports pass.
- Canonical phones: 360×640, 390×667, 390×844, 430×844.
- Zero horizontal overflow, zero visible sub-44 px actions, zero visible <10 px leaf text, zero broken visible images, zero CTA/dock or dock/nav collisions, zero browser page errors in the broad matrix.
- Guide checks: zero head/bubble overlap, zero card/dock and card/nav overlap, 44×44 close inside viewport, invite scrim present, active spotlight present.
- Zero-state checks: no fake week rail, Plan strip, Plan hero or consequence tiles before `Make our week`.
- Full `npm run audit:data`, V18 copy audit, TypeScript and production `npm run build` pass.

A real Josh/G phone screenshot remains the final aesthetic override. If a real-device screenshot looks wrong, the screenshot wins over geometry acceptance.
