# Geese Connect — Verkada Safety Intelligence

Map-based safety platform that turns Verkada's device ecosystem into a single live view.
Safety events appear as markers on a campus map; selecting one opens a side panel with the
location, reporting device, sensor readings, and a recommended response.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## How it's put together

| File | Role |
| --- | --- |
| `src/lib/types.ts` | `SafetyEvent` shape + severity styling. The contract between data and UI. |
| `src/lib/events.ts` | Mock event feed — the stand-in for the Verkada Command API. |
| `src/components/Dashboard.tsx` | Layout: header stats, map, side panel. Holds the selection state. |
| `src/components/SafetyMap.tsx` | Leaflet map (dark CARTO basemap) with severity-coloured markers. |
| `src/components/SidePanel.tsx` | Feed list with severity filters, and the event detail view. |

## Design notes

- **No API key needed.** Tiles come from CARTO's free dark basemap, so the map works offline-ish
  and on any machine. Markers are Leaflet `divIcon`s, which avoids the broken default-icon
  asset path in bundlers and lets us colour by severity with Tailwind classes.
- **Deterministic data.** Events carry `minutesAgo` instead of a timestamp, so server and client
  render identically — no hydration mismatch on "6 min ago".
- **Client-only map.** Leaflet touches `window` at import time, so `SafetyMap` is pulled in via
  `next/dynamic` with `ssr: false`.

## Swapping in the real Verkada API

`src/lib/events.ts` is the only file that needs to change. Point it at the Command API and map
the responses into `SafetyEvent`:

- `/sensors/v1/events` — environmental, vape and motion sensors
- `/cameras/v1/events` — person detection, loitering, line crossing
- `/access/v1/events` — door held, door forced, badge denials, tailgating
- `/alarms/v1/events` — panic and glass-break alarms

You will need an API key and org ID from Verkada Command. If CORS blocks browser calls, proxy
through a Next.js route handler (`src/app/api/events/route.ts`) so the key stays server-side.

## Next steps

- Cluster nearby markers at low zoom, and add a per-building rollup view.
- Stream events over SSE/WebSocket instead of a static list.
- Auto-dispatch: pair each event with the nearest responder and an ETA.
- Floor-plan mode for indoor positioning, since most sensor events are room-level.
