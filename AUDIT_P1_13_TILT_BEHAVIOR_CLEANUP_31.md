# FOSIA Home A — P1.13 Tilt Behavior Cleanup — Revision 31

## Objective
Stabilize card interaction architecture without merging Event Card and Package Card into a single visual component.

## Decision
- Event Card and Package Card remain section-specific.
- Shared behavior remains in the existing `data-tilt="true"` JS controller and shared CSS variables.
- CSS no longer declares the 3D card `transform` for `.card-tilt-active` states; the JS tilt controller is the single runtime transform owner.
- Reduced-motion users do not receive JS tilt listeners.

## Production changes
### `script.js`
Changed the tilt-card collection to:

```js
const tiltCards = reduceMotion() ? [] : [...document.querySelectorAll('[data-tilt="true"]')];
```

This prevents inline `transform: ... !important` from overriding the site's reduced-motion CSS fallback.

### `styles.css`
Removed three redundant `.card-tilt-active` transform declarations:
- Event card `perspective(900px)` transform.
- Package card `perspective(900px)` transform.
- Combined package/event `perspective(1100px)` transform.

The declarations were redundant because `script.js` writes the runtime transform inline with `!important`.

Retained:
- card-specific box-shadow/z-index states
- card image transforms
- shared CSS custom properties (`--card-rx`, `--card-ry`, `--card-mx`, `--card-my`)
- card geometry and responsive rules
- reduced-motion CSS fallback
- Event/Package-specific layout and visual styling

## Files intentionally unchanged
- `index.html`
- `booking.html`
- `event-detail.html`
- all assets

## Static validation
- CSS braces: 1431 / 1431 — PASS
- HTML IDs: 18 / 18 unique — PASS
- `node --check script.js` — PASS
- `.hotel-logo-strip` active source occurrences: 0 — PASS
- `.fosia-logo-marquee` remains scoped — PASS
- `.card-tilt-active` CSS transform declarations: 0 — PASS
- JS runtime tilt transform remains the only active transform writer — PASS
- `data-tilt="true"` cards: 16 — PASS
- `index.html` unchanged from Rev30 — PASS
- `booking.html` unchanged from Rev30 — PASS
- `event-detail.html` unchanged from Rev30 — PASS
- ZIP integrity — PASS

## Scope guard
No full card abstraction was introduced. Event Card and Package Card remain independent components sharing only proven interaction infrastructure.
