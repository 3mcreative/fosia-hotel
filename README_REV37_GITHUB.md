# FOSIA Home — Revision 36

## GitHub-ready package
`FOSIA_Home_A_Revision_5.3.8_P1_16_BOOKING_RESPONSIVE_FIX_36`

This revision is based on Revision 35 and contains a targeted Booking Form responsive breakpoint fix.

### Fix
At viewport widths **<= 820px**, Arrival and Departure remain hidden until a hotel is selected.

### Files changed
- `styles.css`
- `script.js`

### Important behavior
- 820px: hidden until hotel selection.
- 819px and below: hidden until hotel selection.
- Above 820px: normal desktop behavior.
- Selecting a hotel reveals Arrival and Departure.
- Live viewport changes continue to be handled through `matchMedia()`.

### Deployment
Upload the contents of this folder as the website source. Keep the folder name unchanged for revision tracking.
