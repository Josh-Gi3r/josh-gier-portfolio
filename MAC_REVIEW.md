# Room invitations and classic Mac project browser

## Room

- Removed the persistent About & CV and Explore campaigns boxes, outlines and hotspot dots.
- TV, monitor and pinboard share a 7.2-second rhythm with offsets of 0.4, 2.8 and 5.2 seconds. A scan-band glitch, a different monitor glitch and a diffuse warm pinboard glow introduce their respective cues.
- “Click me” and the destination appear briefly over a feathered dark radial gradient. Hover and keyboard focus reveal the cue immediately. Hovering one object suppresses the other invitations.
- Existing image-plane geometry, curved glass masks, room zooms, sound and motion controls are retained. Reduced-motion removes the new effects and leaves static invitations.

## Computer

- Replaced the Windows title bar, path, Start menu and mixed thumbnails with a classic Macintosh Finder treatment: patterned desktop, striped window titles, matching file icons, folder controls and restrained selection states.
- All 25 records have a specific purpose label and a one- or two-sentence description in `dist/mac-desktop.js`.
- Hover after 220 ms and keyboard focus reveal a balloon. Leaving dismisses it after 200 ms; the balloon itself is hoverable. Escape closes the balloon without leaving the computer. Clicking a project opens its case.
- The information button opens a native modal styled as a Mac information window. This supplies the description and preview to touch users without relying on hover.
- Pagination exposes every item in each collection, rather than showing only the first six. Phone widths use a compact list, with three items per page, or two below 370 pixels.
- Shortened display names retain full project names in the information panel and article. Project IDs, routes, source links, attribution and evidence are preserved.

## Supplied product screens

Converted these supplied screenshots to lossless WebP, verifying identical decoded pixels:

| Supplied screenshot | Asset |
| --- | --- |
| 7 September, 4.31.17 AM | `4sight-supplied.webp` |
| 7 September, 4.32.01 AM | `nextcurrency-supplied.webp` |
| 7 September, 4.33.12 AM | `lamuse-supplied.webp` |
| 7 September, 4.33.46 AM | `lamuse-stores-supplied.webp` |

These screens lead the relevant product cards and articles and support the information panels. Original interactive previews remain available through an explicit expandable section. Full-size image inspection handles both these lossless WebP captures and existing assets.

## Verification

- Reviewed all ten screenshots supplied with the request.
- Chromium review at desktop width and 390/320 CSS-pixel iframe widths. This is responsive browser coverage, not a physical-device or Safari claim.
- Inspected the Finder layout and purpose labels, hover balloon positioning within the glass, mobile list and mobile information dialog.
- Mouse selected the open-source folder. Project paging reached the final 13–14 of 14 open-source items. Keyboard focus revealed a description; Escape hid it while retaining the products route.
- The mobile information button opened a readable panel with the supplied screenshot. Open project closed the panel and opened the 4Sight article. Full-image inspection loaded the supplied screenshot successfully.
- Existing four-corner geometry regression, changed JavaScript syntax checks and whitespace checks pass. Catalog completeness checks confirm all 25 projects have icons, purpose labels and descriptions, and all new screenshot references exist.

The browser transport intermittently timed out on input acknowledgements; current DOM state was inspected before continuing, and a fresh review tab restored mouse folder interaction. No corresponding application error was reported.

## Domain

`josh-gier.com` is attached on the hosting side, pending DNS and certificate validation. No DNS-management connector is available in this conversation. Exact provider records and the remaining launch steps are in `DOMAIN_SETUP.md` and `josh-gier.com.dns`.
