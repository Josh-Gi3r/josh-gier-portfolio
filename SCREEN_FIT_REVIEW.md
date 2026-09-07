# Screen fit correction

The three supplied screenshots showed a mismatched perspective on the room TV and inset rounded panels leaving blue gaps in both close-up CRTs.

## Implementation

- Screen boundaries are measured in the original 1672 × 941 photograph coordinates in `dist/screens.js`.
- The close-up photo and glass share one aspect-preserving plane. Responsive CSS changes its crop; it does not independently stretch the photograph or place a second screen with unrelated percentages.
- Curved SVG clipping paths follow the photographed glass edges. Scanlines, reflections and the active UI fill the same surface.
- The room TV and monitor use four-corner projective mapping, including the text and scanlines. Their masks remain in the room photograph coordinate system.
- One readable stylesheet owns all screen layout. The conflicting old rules were removed.
- Computer layout responds to the glass width and height. Folder controls, six shortcuts and Start/taskbar fit within its safe area.
- Stylesheet and entry script URLs have been revised so returning browsers request the changed code.

## Verification

- Inspected all three user screenshots and all three underlying photographs.
- Browser screenshots: room at 1363 × 936; close-up TV and computer at desktop width; computer at 320, 390 and 768 CSS-pixel iframe widths; TV at 390. Iframes have native browser scrollbars, so content width is slightly smaller.
- Inspected all four glass edges and the full compact desktop, including the open-source collection and its longer labels.
- Start menu opened within the glass. Focus did not scroll the stage or glass internally; desktop project grid had no internal overflow at desktop size.
- Opened Pocket-T from the compact open-source folder and confirmed its article, product link and source link.
- Switched the TV to LEGO using its next-channel button, opened the fitted TV image, and confirmed the Find your flow case article.
- Numerical regression test checks all four projective corners at four scales. JavaScript syntax and Git whitespace checks pass.

These are Chromium browser checks with CSS-width iframe coverage, not physical-device or Safari testing. This pass corrects screen integration and layout; campaign evidence and portfolio content are unchanged.
