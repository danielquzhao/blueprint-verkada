# Geese Connect

Geese Connect is a real-time campus safety dashboard that brings Verkada cameras, sensors, access control, and alarms into one live view.

## What it does

- Maps safety events across campus by location and severity
- Combines alerts from environmental sensors, doors, cameras, and panic buttons
- Gives responders the context, readings, and recommended actions for each event
- Lets users report incidents and choose which alert levels they receive

<!-- Add product screenshots here once the image files are available. -->

## Run locally

```bash
npm install
cp .env.example .env.local
# Add your Mapbox public token to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Built with

Next.js, React, TypeScript, Tailwind CSS, Mapbox, and the Verkada device ecosystem.
