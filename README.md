# Geese Connect

Geese Connect is a real-time campus safety dashboard that brings Verkada cameras, sensors, access control, and alarms into one live view.

<img width="1120" height="633" alt="image" src="https://github.com/user-attachments/assets/6fcc48db-20bd-465e-aef9-adfbe6272eef" />
<img width="1116" height="630" alt="image" src="https://github.com/user-attachments/assets/82e3bc6d-4266-47d4-980c-695d498e4829" />
<img width="309" height="343" alt="image" src="https://github.com/user-attachments/assets/c91ac00f-c581-449c-ba3b-d7dd874978aa" />


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
