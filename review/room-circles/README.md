# Room interaction study

An isolated visual prototype following the rejection of v5’s oversized italic labels and full-board glow. It does not change the published homepage or publish a new Site version.

## Direction

Three 18px fine rings, anchored on the TV controls, monitor corner and a pinned document. Only the marker pulses, on a nine-second cycle with 0.6 / 3.6 / 6.6 second offsets. Hover or keyboard focus reveals a short bitmap label beside the ring. Phone layouts retain the labels. No board light overlay or screen-wide invitation effect.

The computer uses a small Finder-style desktop, folder icons and compact menu/window lettering mapped to the existing glass geometry. Existing project content, sound settings, room photograph and published UI remain intact.

## Open the prototype

`dist/room-study-portable.html` embeds the room image, font, styles and interaction code. Download and open it in a browser. Hover an object; click to try the zoom; use Back to the room or Escape to return. The Open portfolio link leads to the existing published case-study section. The prototype contains only the room interaction. Music and rain remain opt-in and load from their credited online sources.

Regenerate with `python export-room-study.py`. The development route is `dist/room-study.html`.

## Visual checks

- Viewed at 1363×936 and in a 390px CSS viewport.
- Confirmed the embedded font and room image load in the portable file.
- Inspected idle and pinboard hover states at normal viewing size.
- Checked monitor activation and return by keyboard.
- Confirmed phone labels do not overlap and remain adjacent to their objects.
- Checked JavaScript syntax and source whitespace.

Browser transport occasionally timed out on pointer clicks; keyboard activation and return completed correctly. No code changes were made to work around transport errors.

## Font attribution

ChiKareGo2 is the Chicago 12pt recreation by Giles Booth distributed by [System.css](https://github.com/sakofchit/system.css), pinned to source commit `c95b95428021361eaa411ccb08fa3b1050cc606d`. The included MIT notice is in `dist/assets/chicago-font-license.txt` and embedded in the portable HTML. Only the font is reused; no framework or dependency is installed.
