# Home Meals — QA / Acceptance Matrix

Status: release gate for the current v3 UI + v12 household system
Updated: 2026-09-14

A screen looking good is not enough. Product truth, household state, food arithmetic, touch interaction, AI behaviour, sync, PWA behaviour and production deployment all have to agree.

Legend:

- **PASS** — automated/static/live QA currently supports acceptance.
- **DEVICE** — implementation is complete but the final behaviour depends on phone/browser permissions or hardware and must degrade cleanly.
- **HOUSEHOLD** — only real Josh/G use can create the missing personal evidence; the software is complete without inventing it.

## Current release evidence

The final completion pass now includes all of the following evidence rather than relying only on static inspection:

- a **136-route live production crawl** at 390 × 844 covering core routes, all 36 recipe pages, all 36 cooking pages, 8 mothers, 26 mids, 7 boosters, guides and all Scan modes: **0 route failures, 0 page errors, 0 console errors, 0 HTTP 4xx/5xx responses, 0 horizontal overflow, 0 broken images and 0 unlabeled visible controls**;
- **96 responsive production samples** across 360, 375, 390, 412, 430, 768, 1280 and 1440 px on representative core/detail/cooking/prep routes: **0 failures**;
- a deterministic first-week audit covering unknown → confirmed empty Kitchen → active prep → week gaps → shopping → prep → exact cooking consumption → separate Josh/G ratings → history/recency;
- live Ask Home tests proving normal navigation, unknown-Kitchen restraint, complete seven-dinner planning and explicit `set_week`, `set_active_prep_set` and `confirm_empty_kitchen` proposals;
- live Vision inference against a real prep image, returning quality cues while refusing to infer internal food safety;
- live OpenAI Live WebRTC negotiation with `gpt-live-1`, including successful remote SDP application and opened data channel;
- browser-mocked sync acceptance for join conflict, concurrent conflict, active-cooking deferral and failed-write recovery, plus live unauthenticated API checks proving household data is not exposed without a valid session;
- production `/api/system-status` confirming Railway Postgres, household code, Ask Home, Vision and Live are configured.

## 1. Product truth

| Requirement | Gate | Status |
|---|---|---|
| Unknown Kitchen is distinct from confirmed empty | First-run state model and UI | PASS |
| Empty Kitchen can be confirmed in one action | No item-by-item zeroing | PASS |
| Existing Kitchen can start from zero then add only what exists | Explicit manual first-run path | PASS |
| Camera never silently mutates Kitchen | Vision proposals require confirmation | PASS |
| Qualitative pantry does not become fake g/ml | Out / Low / Some / Plenty remains qualitative | PASS |
| No hard-coded nutrition is shown as household fact | Active UI barred from placeholder nutrition | PASS |
| No assumed batch yield is treated as physical truth | Portion-first prep, no batch-yield runtime | PASS |

## 2. Prep system

| Requirement | Gate | Status |
|---|---|---|
| 8 mothers exist | Food-truth audit | PASS |
| 26 mids exist | Food-truth audit | PASS |
| 7 boosters exist | Food-truth audit | PASS |
| All 41 prep objects are discoverable | Unified Prep library | PASS |
| Active prep is a subset, not a checklist | Active repertoire state | PASS |
| Start-small set is GOLD + SAMBAL + RED | Starter-set regression | PASS |
| Balanced starter exists | Five-base starter | PASS |
| `madeFrom` and `usedWith` are distinct | Repertoire/relationship model | PASS |
| Standalone mids are shown as standalone | Mids UI | PASS |
| Boosters use the same current stock model | No legacy yield flow | PASS |
| Prep Day makes only current gaps by default | Week jobs derive from current plan + stock | PASS |
| Stock-up remains optional | Separate Stock-up mode | PASS |
| User records usable working portions, not whole-pot yield | Mother/Mid/Booster/Prep Day flow | PASS |

## 3. Prep imagery

| Requirement | Gate | Status |
|---|---|---|
| Mother hero photography | 8 / 8 | PASS |
| Mother process sequences | 8 / 8 | PASS |
| Mid hero photography | 26 / 26 | PASS |
| Booster hero photography | 7 / 7 | PASS |
| CLEAR hero/process no longer missing | Asset regression | PASS |
| ONION hero/process no longer missing | Asset regression | PASS |

## 4. Recipe system

| Requirement | Gate | Status |
|---|---|---|
| 36 dinners exist | Catalogue + food-truth audit | PASS |
| Recipe pages consume current dinner formulation | Cutover audit | PASS |
| Cooking mode consumes current dinner formulation | Cutover audit | PASS |
| Browse by cuisine | Cook browse mode | PASS |
| Browse by prep | Cook browse mode | PASS |
| Recent / Not lately / Never cooked | History-aware browse | PASS |
| Favourites / Quick / Ready now | Cook browse mode | PASS |
| Search covers title and cuisine | Cook search | PASS |
| Recipe safety targets are structured | Food-safety layer | PASS |
| Visual cue never proves safe internal temperature | UI + AI truth rule | PASS |

## 5. Meal memory

| Requirement | Gate | Status |
|---|---|---|
| Cook event timestamp saved | v12 History | PASS |
| Cook count derived | Meal-history engine | PASS |
| Last cooked / days since derived | Meal-history engine | PASS |
| 7 / 14 / 30-day recency derived | Meal-history engine | PASS |
| Cuisine mix derived | Meal-history engine | PASS |
| Never-cooked derived | Meal-history engine | PASS |
| Forgotten favourites derived | Meal-history engine | PASS |
| Josh and G ratings remain separate | Household state | PASS |
| Notes preserve author/time | Household state | PASS |
| Recipe versions preserve history | Household state | PASS |

## 6. Planning

| Requirement | Gate | Status |
|---|---|---|
| Plan is seven dinners | Planner/UI | PASS |
| Active prep fit influences ranking | Planner + Plan UI | PASS |
| Recorded readiness influences ranking | Planner + Plan UI | PASS |
| Recent repeats are penalised | `recentPenaltyV2` | PASS |
| Repeated cuisine is discouraged | Week-builder cuisine counts | PASS |
| Use-soon food gets priority | Planner/UI | PASS |
| Ratings/favourites influence suggestions | Planner/UI | PASS |
| Prep reuse can lower weekly work | Planner/UI | PASS |
| Weekday time cost influences suggestions | Planner/UI | PASS |
| One extra prep may be proposed when valuable | Prep expansion value | PASS |
| Whole-week AI proposal requires confirmation | Ask Home mutation contract + live test | PASS |

## 7. Kitchen and groceries

| Requirement | Gate | Status |
|---|---|---|
| Fridge / Freezer / Pantry views exist | Route/UI | PASS |
| Exact stock uses g/ml/count only where known | v12 quantity model | PASS |
| Qualitative pantry remains qualitative | v12 qualitative model | PASS |
| Freezer shows practical working portions | Current Kitchen UI | PASS |
| Older recorded batches are used first | FIFO engine/UI | PASS |
| Grocery gaps derive from plan minus stock | Ingredient engine | PASS |
| Shop completion can add confirmed stock | Plan Shop mode | PASS |
| No hidden g↔ml conversion exists | Quantity regression audit | PASS |

## 8. Cooking reconciliation

| Requirement | Gate | Status |
|---|---|---|
| Cooking can consume exact prep and ingredient stock | `cookRecipeV12` + household-journey audit | PASS |
| Failed reconciliation does not silently become a partial deduction | Explicit `stockConsumed` result | PASS |
| Log-only History path is explicit | `logMealWithoutStock` | PASS |
| Completion UI tells the user whether stock changed | Cooking receipt | PASS |
| Cooking session can survive normal navigation/update pressure | session storage + PWA update deferral | PASS |
| Wake lock attempted where supported | Cooking mode | PASS |

## 9. Ask Home

| Requirement | Gate | Status |
|---|---|---|
| OpenAI key/configuration present in production | System-status endpoint | PASS |
| Model receives deterministic v12 household context | Assistant-context layer | PASS |
| Active prep included | Assistant context | PASS |
| Meal history included | Assistant context | PASS |
| Grocery/prep arithmetic precomputed | Assistant context | PASS |
| Ratings/favourites/notes included | Assistant context | PASS |
| Validated substitutions only | Intelligence audit | PASS |
| AI does not invent nutrition/yield/stock | System instructions + live unknown-Kitchen test | PASS |
| State changes are proposed, not silently applied | Client confirmation | PASS |
| Can propose active prep set | Live `set_active_prep_set` test | PASS |
| Can propose full seven-day week | Live `set_week` test with seven valid IDs | PASS |
| Can confirm explicitly empty Kitchen | Live `confirm_empty_kitchen` test | PASS |
| Full-week structured response does not truncate | Production response-budget regression + live plan test | PASS |
| AI navigation cannot invent non-product routes | `cleanHref` allow-list | PASS |

## 10. Vision

| Requirement | Gate | Status |
|---|---|---|
| Production vision endpoint configured | `/api/vision` GET | PASS |
| Page load does not submit empty inference | Vision runtime configuration check is GET-only | PASS |
| Fridge mode supported | Vision schema/runtime | PASS |
| Freezer mode supported | Vision schema/runtime | PASS |
| Pantry mode supported | Vision schema/runtime | PASS |
| Receipt mode supported | Vision schema/runtime | PASS |
| Prep visual cue mode supported | Vision schema/runtime | PASS |
| Meal photo mode supported | Vision schema/runtime | PASS |
| Proposed inventory changes require confirmation | Runtime | PASS |
| Real prep image returns useful visible cues | Live production Vision inference | PASS |
| Camera cannot certify internal food temperature | Truth contract + live Vision result | PASS |
| Browser/OS camera permission works on Josh/G device | Hardware permission | DEVICE |

## 11. Voice

| Requirement | Gate | Status |
|---|---|---|
| Production Live endpoint configured | `/api/live` GET | PASS |
| WebRTC Live path implemented | Voice runtime | PASS |
| Production Live session can negotiate WebRTC | Live SDP answer + opened data channel | PASS |
| Production model is `gpt-live-1` | Live session response | PASS |
| Household-dependent questions delegate to backend | Live instructions/client delegation | PASS |
| Voice state changes use confirmation path | Ask Home proposal handoff | PASS |
| Browser speech fallback exists | Voice runtime | PASS |
| Browser/OS microphone permission works on Josh/G device | Hardware permission | DEVICE |

## 12. Household sync and privacy

| Requirement | Gate | Status |
|---|---|---|
| Josh + G share one household state | Railway Postgres sync | PASS |
| Household code authentication configured | Production system status | PASS |
| Unauthenticated household read is rejected | Live `/api/household` = 401 | PASS |
| Invalid household code is rejected | Live session POST = 401 | PASS |
| Session cookie is HTTP-only | Session route | PASS |
| Session cookie is Secure | Session route | PASS |
| Session cookie is SameSite=Lax | Session route | PASS |
| Code/token comparison is timing-safe | Server household library | PASS |
| Optimistic versioning prevents silent overwrite | Postgres write contract | PASS |
| Join conflict is explicit | Mocked production-browser sync test | PASS |
| Concurrent changes create explicit conflict | Mocked production-browser sync test | PASS |
| Remote update is deferred during active cooking | Mocked production-browser cooking test | PASS |
| Failed sync write preserves local state and surfaces retry | Mocked production-browser failed-write test | PASS |

## 13. PWA / offline

| Requirement | Gate | Status |
|---|---|---|
| Installable manifest exists | PWA | PASS |
| Home cached | Service worker CORE | PASS |
| Cook cached | Service worker CORE | PASS |
| Builder cached | Service worker CORE | PASS |
| History cached | Service worker CORE | PASS |
| Prep / Prep Day / Mids / Boosters cached | Service worker CORE | PASS |
| Kitchen / Plan / More cached | Service worker CORE | PASS |
| Scan shell cached | Service worker CORE | PASS |
| Image cache bounded | Service worker | PASS |
| Update does not interrupt active cooking | PWA runtime | PASS |

## 14. Mobile and visual acceptance

The final live production pass covers **136 routes at 390 × 844** plus **96 responsive samples** over 360, 375, 390, 412, 430, 768, 1280 and 1440 px widths.

| Requirement | Gate | Status |
|---|---|---|
| No route/render failures in 136-route mobile crawl | Browser crawl | PASS |
| No page or console errors in 136-route mobile crawl | Browser crawl | PASS |
| No HTTP 4xx/5xx resource responses in 136-route mobile crawl | Browser crawl | PASS |
| No horizontal overflow in full mobile crawl | Browser crawl | PASS |
| No broken images in full mobile crawl | Browser crawl | PASS |
| Visible interactive controls have accessible names | Browser crawl + Scan regression | PASS |
| No horizontal overflow on representative routes in all 8 sampled widths | 96 responsive browser samples | PASS |
| Primary compact buttons target ~44 px | Completion CSS | PASS |
| Filter chips target ~44 px | Completion CSS | PASS |
| Stock steppers target 44 × 44 px | Completion CSS | PASS |
| Scan mode controls target ~44 px | Completion CSS | PASS |
| Bottom navigation is comfortably tappable | Completion CSS | PASS |
| Stock-level labels are readable at arm's length | Completion CSS | PASS |
| Safe-area insets are used for shell, sheets, CTA, nav, scan and overlays | CSS audit | PASS |
| Reduced-motion handling exists | CSS audit | PASS |
| Keyboard focus-visible treatment exists | CSS audit | PASS |
| Household rehydration never flashes an unstyled blank page | Branded loading state | PASS |
| Internal implementation jargon is kept out of primary user copy | Product-completion audit | PASS |

## 15. CI / release gates

`npm run audit:data` must run all of:

1. catalogue audit;
2. food-truth audit;
3. food-system audit;
4. intelligence audit;
5. **household-journey audit**;
6. v3/v12 cutover audit;
7. product-completion audit.

Release additionally requires:

- `npm run typecheck`;
- production Next.js build;
- Home Meals CI success on the accepted head;
- Railway deployment success on the accepted head;
- production system-status health.

## 16. Household-only completion

These are not software defects and must not be fabricated to make a dashboard read 100%:

| Evidence | Status |
|---|---|
| Josh/G taste rating for a dinner never cooked | HOUSEHOLD |
| Real preferred heat/salt/acid balance | HOUSEHOLD |
| Actual favourite prep repertoire after weeks of use | HOUSEHOLD |
| Actual physical prep yield / usable-portions observations not yet made | HOUSEHOLD |
| Device-specific camera permission behaviour | DEVICE |
| Device-specific microphone permission behaviour | DEVICE |

The software is considered complete when it captures these observations cleanly instead of pretending to know them in advance.
