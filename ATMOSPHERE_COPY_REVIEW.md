# Discoverability, sound and copy revision

## Changes

- TV and CV labels remain visible and are clickable themselves, including where they extend outside the photographed object. A brief TV scan-band glitch and warm CV/pinboard pulse alternate in an 8.5-second cycle. Reduced-motion and Pause motion stop these effects while retaining labels.
- One persistent Sound control plays a licensed instrumental and much quieter window rain. Playback is opt-in, fades in, continues between portfolio views and pauses both tracks when disabled. The Credits panel contains source and license attribution. See AUDIO_CREDITS.md.
- The homepage now leads with “Creative leadership. Commercial results.” and “I lead campaigns, build products and grow businesses.” About and CV focus on leadership, delivery, teams and revenue.
- Reviewed all 16 campaign records and 25 product/open-source records, plus the work index, case headings, interface text and contact page. `editorial.js` provides narrative revisions without replacing underlying evidence.

## Verification

- Chromium desktop review at 1363 × 936 and CSS-width mobile iframe review at 390 pixels. No physical-device or Safari claim.
- TV label and CV label open their intended routes. Mobile TV label opens campaigns. Persistent controls fit below mobile navigation without the previous footer overlap.
- Both tracks initially remain paused and unloaded. On enable, both decode with readyState 4 and advance together; disable pauses both. Playback continues between campaigns and the room. Pausing visual motion leaves audio playing, and pauses both invitation animations.
- About copy is present in the rendered view. Longer campaign title checked inside the mobile TV and its typography adjusted to clear the channel label.
- Compared the current catalog with the last published catalog: all non-narrative fields across 16 campaigns and 25 products remain unchanged, including metrics, budget ranges, attribution notes, status and URLs.
- Changed JavaScript syntax checks, whitespace validation and the existing four-corner screen-geometry regression pass.

Screen calibration is unchanged. Audio uses confirmed CDN URLs with anonymous CORS for the Web Audio gain controls. Volume balance is set technically; perceived loudness still depends on the visitor’s device and system volume.
