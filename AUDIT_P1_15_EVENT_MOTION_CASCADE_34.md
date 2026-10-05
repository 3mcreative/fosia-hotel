# FOSIA Home — P1.15 Event Motion Cascade Cleanup — Revision 34

## Scope
Targeted CSS cleanup only. Removed two proven-dead event directional animation families that were fully superseded by the final `538` family.

## Removed
1. `eventCardTravelNext` / `eventCardTravelPrev` keyframes and their selectors.
2. `fosiaEventArrowNext` / `fosiaEventArrowPrev` keyframes and their selectors.

## Preserved
- `.event-scroll-next` / `.event-scroll-prev` JS trigger classes.
- `fosiaEventArrowNext538` / `fosiaEventArrowPrev538` as the sole active directional event animation family.
- Event scroller behavior, pointer/touch handling, tilt, reveal, reduced-motion system, and all assets.

## Evidence
The JS adds/removes only `.event-scroll-next` / `.event-scroll-prev`. Before cleanup, the `538` selectors were later in the cascade and used `!important`, so they superseded both earlier animation families. No JS or other source referenced the removed keyframe names.

## Validation
- CSS brace balance checked.
- Removed keyframe/selector names absent from production source.
- Active `538` family present exactly once per direction.
- Full project copied from Revision 33, including assets.
- ZIP integrity and SHA-256 verified.
- Browser visual automation is not claimed as PASS because the known Chromium environment can be administrator-blocked; manual browser regression remains required.
