# P1.16 — Booking Responsive Fix — Revision 36

## Baseline
Revision 35 — `FOSIA_Home_A_Revision_5.3.8_P1_16_PARALLAX_MOTION_CASCADE_CLEANUP_35`

## Reported issue
At the tablet breakpoint around 820px, Arrival and Departure were still visible before a hotel was selected.

## Root cause
The booking compact-state breakpoint was defined as `max-width: 819px` in both CSS and JS. At an exact viewport width of 820px the form therefore entered the non-compact state and revealed both date fields.

## Targeted fix
Aligned the Booking Form compact breakpoint to `max-width: 820px` in both layers:

- CSS initial-state guard
- JS `matchMedia()` responsive state controller

Behavior after fix:

- `<= 820px` + no hotel selected → Arrival and Departure hidden.
- `<= 820px` + hotel selected → Arrival and Departure revealed.
- `> 820px` → desktop booking layout remains unchanged.
- Existing live resize / `matchMedia` behavior remains active.

## Scope
Only the Booking Form responsive breakpoint was changed. No changes were made to:

- parallax system
- tilt system
- event motion
- packages
- hotels / marquee
- assets
- booking visual styling
- button color
- booking radius

## Regression requirements
Manual verification required at:

1. 821px → dates visible.
2. 820px → dates hidden until hotel selection.
3. 819px → dates hidden until hotel selection.
4. Select hotel at 820px → dates appear.
5. Resize 820px → 821px → 820px live → state updates correctly.
6. Reset hotel → dates hide again at <=820px.
