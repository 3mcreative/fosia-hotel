# FOSIA Home A — Revision 38
## P1.16 Booking Responsive Flow

### Requirement
For the Booking form:

- `< 960px` is the compact responsive flow.
- `>= 960px` is the desktop flow.

Compact state:
- hotel not selected → Arrival hidden + Departure hidden
- hotel selected → Arrival visible + Departure visible

Desktop state:
- Arrival visible + Departure visible regardless of hotel selection

### Layout
For `< 960px`, Booking becomes a single-column vertical flow:
1. Hotel destination
2. Arrival (only after hotel selection)
3. Departure (only after hotel selection)
4. Check Availability

At `>= 960px`, the existing desktop four-column booking layout is restored.

### Implementation
- `script.js`: responsive state is the single behavioral source of truth using `matchMedia('(max-width: 959px)')`.
- `styles.css`: final authoritative responsive layer is appended to win over earlier legacy `<=819px` and `820–1200px` rules.
- Hotel selection calls `updateBookingResponsiveState()` directly; no delayed class mutation is required.

### Regression protection
- Booking check button remains `#2B3843 !important` from existing source.
- Booking bar radius remains `10px !important` in compact flow.
- Existing date field visual system is preserved.
- No changes to parallax, tilt, marquee, Events, Packages, or Hotels.
