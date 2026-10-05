# FOSIA — P1.16 Booking Responsive Breakpoint Fix — Revision 37

## Baseline
Revision 36 — `FOSIA_Home_A_Revision_5.3.8_P1_16_BOOKING_RESPONSIVE_FIX_36`

## User-tested issue
At the compact booking breakpoint, Arrival and Departure must remain hidden until a hotel is selected. The compact flow must cover the responsive range down to 320px, with the desktop/expanded state starting at 960px.

## Target behavior
- 320px–959px: Arrival + Departure hidden initially.
- 320px–959px: selecting a hotel reveals Arrival + Departure.
- 960px+: Arrival + Departure remain visible.
- Live viewport changes must update automatically.

## Source changes
1. `styles.css`
   - Booking compact guard changed from `@media (max-width:820px)` to `@media (max-width:959px)`.
   - Existing revealed-state styles are unchanged.
2. `script.js`
   - `bookingCompactMedia` changed from `(max-width: 820px)` to `(max-width: 959px)`.
   - Existing hotel-selection reveal logic is unchanged.

## Deliberately untouched
- Booking date field visual design from the established baseline.
- Check button color `#2B3843 !important`.
- Booking bar radius `10px !important`.
- OUR HOTELS logo alignment.
- Parallax, tilt, reveal, marquee, Events, Packages, assets.

## Static validation
- CSS target breakpoint: 959px.
- JS target breakpoint: 959px.
- No new dependencies.
- Full project/assets retained from Revision 36.
