# CSS Ownership Map — Revision 28

| Layer | Examples | Action |
|---|---|---|
| Global | `body`, `img`, tokens, base typography | Keep global |
| Shared primitive | `.outline-btn`, `.solid-btn`, `.view-all`, common controls | Keep shared where reuse is intentional |
| Section | `.events-section ...`, `.packages-section ...`, `.banner-logo-section ...` | Keep isolated |
| State | `:hover`, `.active`, `[hidden]`, focus states | Keep with owning component |
| Responsive | media-query overrides | Keep with owning component unless proven global |

## Card abstraction decision
Do **not** create a new `.fosia-card` abstraction in this revision. Events and Packages have materially different structure, layout, interaction, and responsive behavior.
