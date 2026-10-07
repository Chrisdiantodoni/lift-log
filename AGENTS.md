# Repository Guide

## Runtime

- Static HTML/CSS/JavaScript PWA only: no package manager, build, lint, typecheck, or codegen configuration exists.
- Serve locally with `python3 -m http.server 8080`; opening `index.html` directly is not the documented workflow.
- Vercel uses Framework Preset `Other`, no build command, and output directory `.`.

## Structure

- `index.html` owns all page markup and loads classic scripts in dependency order: `guides.js`, `storage.js`, `app.js`, then `guide-ui.js`.
- `storage.js` owns storage normalization and non-destructive merge logic; keep it browser- and Node-compatible for `storage.test.js`.
- `app.js` owns workout plans, session state, rendering, history/statistics, rest timer, validation, and browser persistence.
- `guides.js` defines global `exerciseGuides`; exercise names must match names in `app.js`.
- `guide-ui.js` depends on globals `exerciseGuides` and `esc`, and owns guide-dialog behavior.
- `style.css` owns all layout and responsive presentation; `images/` contains local exercise assets.
- `sw.js` caches the app shell and exercise images for offline use. Bump its `CACHE` value when cached shell behavior changes; current cache is `lift-log-v9`.

## Data Invariants

- Persist data under localStorage key `lift-log-v1`; changing its shape or key requires explicit migration handling.
- Sessions are keyed as `<YYYY-MM-DD>_<plan-index>` and shaped as `{date, plan, sets, notes, finished}`.
- Data is browser- and domain-local. Preserve existing data when stored JSON cannot be read; `app.js` intentionally avoids overwriting until a user change.
- UI copy and date/number formatting use Indonesian (`id-ID`).
- Escape user-controlled or data-derived values with `esc()` before inserting HTML strings.

## Verification

- Run storage checks with `node storage.test.js` when changing persistence, normalization, import, or merge behavior.
- No browser automation exists. After changes, serve locally and manually verify: record a set, reload persistence, complete a session, history open/delete, export/import merge, progress table, guide dialog and alternatives.
- For UI changes, also verify keyboard focus returns after closing the guide dialog and check narrow and desktop layouts.
