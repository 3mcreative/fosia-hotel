# FOSIA Home — P1.16 Parallax Motion Cascade Cleanup — Revision 35

## Scope
Targeted CSS cleanup only. The production parallax transform is owned by the existing JS/rAF controller in `script.js`.

## Removed
- `fosiaPureCssParallax`
- `fosiaSectionParallax`
- `fosiaSectionParallax49`

Their associated `animation-timeline:view()` support blocks were removed.

## Preserved
- `.parallax-section` geometry and visual styling.
- `.parallax-bg` visual layer.
- JS/rAF parallax target/current interpolation in `script.js`.
- `prefers-reduced-motion` handling.
- Welcome-image parallax.
- Marquee, Events, Packages, Booking, OUR HOTELS, and all assets.

## Reason
The later production CSS disables `.parallax-bg` animation, while `script.js` writes the authoritative inline transform using `!important`. The removed CSS timeline families therefore could not be the active parallax transform source in the final cascade.

## Validation
- CSS brace balance checked.
- Removed keyframe names absent from production source.
- JS parallax controller unchanged.
- Full project copied from Revision 34, including all assets.
- ZIP integrity and SHA-256 verified.
- Browser visual automation is not claimed as PASS; manual browser regression remains required.
