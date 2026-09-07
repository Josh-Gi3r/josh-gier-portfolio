# Josh Gier — After Hours

An image-led 2.5D personal marketing portfolio. Plain HTML, CSS and browser JavaScript, authored and served from `dist/`. A Vite development server supports browser review; deployment still serves the authored static files directly.

## Experience

- Room: ambient image/video, circular TV/computer/pinboard hotspots, staggered TV and monitor tracking glitches, illumination fitted to the full photographed pinboard, and controlled zoom transitions. The TV restores its scanline standby text and campaign preview on hover; the computer has a compact Finder desktop. Large italic click overlays are removed.
- Opt-in music and quiet window rain share one persistent Sound control; source attribution is available in Credits. See `AUDIO_CREDITS.md`.
- TV: 16 selectable campaign/commercial channels; complete case studies and expandable creative imagery.
- Computer: 25 product, open-source and experimental projects. Classic Mac Finder chrome, matching icons, purpose labels, balloon help, touch information panels and paginated folders. Full reading views, source links, supplied product screens and reconstructed interactive previews remain available.
- Direct work index, About, printable selected-experience CV and LinkedIn contact.
- Hash routes, browser history, keyboard access, Escape/back controls, native image dialogs, reduced-motion and atmosphere pause.

## Content sources

The user-supplied Marketing/GTM/Revenue Portfolio and Marketing/GTM/Sales/Product Portfolio, six pasted research/inventory drafts, and latest conversation corrections. Latest clarification: Coliseum is one product/GTM case with 4M members and 200K active users, not the site anchor. Acquihire/fundraising backstory does not lead the site.

`dist/data.js` retains the original campaign and product records; `catalog.js`, `product-details.js` and `open-source.js` contain the expanded portfolio and corrections. `showcases.js` renders the source-backed product previews and campaign art compositions. `showcase.css` carries the revised visual system. Asset filenames map to source generations in `asset-provenance.json`. The six source interface/operating screenshots come from the revenue portfolio DOCX.

Campaign imagery is explicitly presented as creative reconstruction. Actual product screens are identified as supplied interfaces. No modelled budgets, CAC, reach, ROAS or conversion rates have been promoted to confirmed outcomes. Platform/company results retain their attribution context. No confidential or fictional customer records were added.

Projects without a supplied interface have descriptive cases, not fabricated interfaces. PIF and additional named enterprise clients with unresolved engagement identification are not expanded into invented cases. The CV is a selected-experience profile; no unsupported employment dates or contact information were invented.

## Validate

Run `node --check dist/app.js` and `node --check dist/data.js`. Check local asset and hash-route references before publishing. Static hosting uses `.openai/hosting.json` and `dist/index.html`.

## Validation of the first version

All 33 generated views, 16 channel states and 12 product-window states passed isolated JavaScript render checks. All rendered local image references, expansion targets and internal routes were checked. JavaScript syntax checks passed. Asset geometry was mapped from inspected source images. A subsequent browser review found material visual and interaction defects; see `REVIEW.md`. The isolated checks did not establish visual quality or usability.

The eight-second Seedance 2.5 ambient clip is masked to the window area. Furniture, screen geometry, hotspot placement and navigation remain controlled by the original still and website code.

## Local browser review

Start the supervised preview with `sites-preview start /workspace/sites/josh-gier-bedroom`. The Vite-only `/__review?width=390&view=products` and `/__review?width=390&view=campaigns` routes embed the actual application in a narrow viewport for responsive inspection. They are review helpers and are not part of the published static site. This is a CSS viewport check, not physical-device or touch emulation.

## Revision 2

- 4Sight, NextCurrency and LaMuse have distinct reconstructed product previews using repository branding and visual assets. 4Sight market selection/swap controls, NextCurrency directory filters and LaMuse journey tabs are interactive. Payroll, Telegram FX and agent workflows have tailored preview surfaces.
- The product directory and complete work index include 14 open-source stories covering 15 repositories, with the related Buzz forks presented together. Fork attribution and prototype/simulation status are retained.
- Actual repository visuals recovered for Pocket-T, Docshare, Linkhub, Network Graph, Launch Board, Ambassador Kit, Creator Storefront, stablecoin payroll, Telegram FX, Whale Tracker, Buzz and Blueballs.
- LEGO and Revolut have new generated standalone artwork, original brand logos and separate typeset layouts. Source reconstructions are labeled. Other supplied campaign galleries remain available.
- Reported commercial outcomes are prominent above case imagery. Draft workstream budget ranges are explicitly labelled modelled, not reported spend; invented draft performance figures are not represented as measured campaign results.
- TV picture areas open their case, independent channel controls remain keyboard accessible, and mobile product views use page scrolling rather than tiny nested detail windows.
- About and printable selected-experience CV include open-source work. The available source does not supply a complete dated employment/education CV; dates are not invented.

## Validation

All 41 work routes rendered during browser review with a title and article, no broken loaded images and no desktop horizontal overflow. Reviewed representative phone-width TV, computer and 4Sight layouts and exercised product tabs, market selection, swap fields, TV channel switching and case opening. Mobile checks use a 390px CSS viewport, not physical-device emulation. Asset references and JavaScript module syntax validated. External product services and financial integrations are not executed by the portfolio previews.

## Deployment (GitHub Pages)

Production is served by GitHub Pages from the `gh-pages` branch, which is an exact copy of `dist/`. The custom domain is `josh-gier.com` (`dist/CNAME`). Audio is served locally from `dist/assets/audio/` (see `AUDIO_CREDITS.md` for sources).

To publish a change:

```bash
# edit files under dist/, then
git add -A && git commit -m "Describe the change"
./deploy.sh
```

`deploy.sh` runs the syntax and geometry checks, pushes `main`, and pushes `dist/` to `gh-pages`. No CI is involved. Nothing is served from the OpenAI Sites project any more; `.openai/hosting.json` is kept for reference only.

Local preview: `python3 -m http.server 4173 --directory dist` then open http://localhost:4173/
