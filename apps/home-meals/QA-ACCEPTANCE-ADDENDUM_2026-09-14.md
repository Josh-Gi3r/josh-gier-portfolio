# Home Meals — QA / Acceptance Addendum

Date: 2026-09-14
Status: additive amendment to `QA-ACCEPTANCE-MATRIX.md`

This file does not replace the QA matrix. It updates the release-gate details that changed during HM-F100 final completion.

## Repeatable browser acceptance is now a CI gate

The earlier 136-route production crawl and 96 responsive samples remain valid historical live evidence. They are no longer the only browser evidence.

Home Meals now has a committed Playwright acceptance suite that derives its catalogue routes from the live recipe/prep data and is run by Home Meals CI after the production build.

The suite covers:

- **136 distinct app/catalogue routes** at the canonical 390 px phone width:
  - core task routes;
  - all 36 recipe detail routes;
  - all 36 cooking routes;
  - all 8 mother routes;
  - all 26 mid routes;
  - all 7 booster routes;
  - Learn routes;
  - all six Scan modes;
- route HTTP success;
- page/runtime errors;
- console errors;
- document-level horizontal overflow;
- broken visible images;
- primary bottom-navigation usability;
- responsive overflow checks on 12 representative task/detail routes.

## Canonical responsive checkpoints

The automated responsive matrix now uses **all widths required by the master implementation plan**:

`360, 375, 390, 393, 412, 430, 768, 820, 1024, 1280, 1440 px`

With 12 representative routes, that is **132 repeatable responsive samples** per CI acceptance run.

This supersedes the older QA-matrix sentence that listed only 360, 375, 390, 412, 430, 768, 1280 and 1440 px.

## Release-infrastructure gate

`npm run audit:data` now additionally executes `audit-release-infrastructure.cjs`.

The release-infrastructure audit protects:

- Node 24 production runtime pin;
- npm runtime pin;
- committed npm lockfile;
- Playwright dependency and acceptance configuration;
- when running from a full repository checkout, current GitHub Actions runtime, lockfile install and browser acceptance wiring.

The audit intentionally remains valid inside Railway's `apps/home-meals` service-root build, where repository-level `.github` files are not present.

## Updated release gate

The accepted Home Meals commit must pass, in order:

1. deterministic dependency install;
2. TypeScript typecheck;
3. catalogue audit;
4. food-truth audit;
5. food-system audit;
6. intelligence audit;
7. household-journey audit;
8. private-AI endpoint audit;
9. release-infrastructure audit;
10. v3/v12 cutover audit;
11. product-completion audit;
12. production Next.js build;
13. Chromium browser acceptance;
14. Railway deployment + healthcheck;
15. production configuration/status checks.

A release is not accepted merely because a static build is green.

## Boundaries that remain intentionally outside software acceptance

Only the existing categories remain outside automated/software completion:

- **DEVICE**: Josh/G's actual phone/browser camera and microphone permission/hardware behaviour;
- **HOUSEHOLD**: real taste calibration, real observed prep yields/usable portions, and long-term preference/repertoire evidence.

Those are observations the completed software must capture, not values engineering may invent.
