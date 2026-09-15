import type { SafetyEvent } from "./types";

/**
 * Stand-in for the Verkada Command API.
 * Replace this module with a fetch to /sensors/v1/events, /cameras/v1/events,
 * /access/v1/events and /alarms/v1/events once credentials are available —
 * the SafetyEvent shape is what the UI consumes either way.
 *
 * Coordinates are on the University of Waterloo campus.
 */
export const EVENTS: SafetyEvent[] = [
  {
    id: "evt-1042",
    title: "Panic button activated",
    category: "duress",
    severity: "critical",
    status: "active",
    location: "Library — Help Desk",
    building: "Dana Porter Library",
    lat: 43.4696,
    lng: -80.5422,
    minutesAgo: 2,
    device: { name: "Help Desk Panic", model: "BR31", kind: "Alarm" },
    summary:
      "A duress alarm was raised at the library help desk. A person on site has judged themselves to be in immediate danger.",
    readings: [
      { label: "Activation", value: "manual, single press" },
      { label: "Prior activations", value: "0 in last 90 days" },
      { label: "Camera coverage", value: "DP-14, live" },
    ],
    actions: [
      "Open the nearest camera and keep the live view on screen",
      "Dispatch the two nearest responders silently",
      "Escalate to emergency services if the view shows a weapon or struggle",
    ],
  },
  {
    id: "evt-1041",
    title: "Vape aerosol detected",
    category: "vape",
    severity: "high",
    status: "active",
    location: "Washroom — Level 2 North",
    building: "Engineering 7",
    lat: 43.473,
    lng: -80.539,
    minutesAgo: 6,
    device: { name: "E7-Washroom-2N", model: "SV23", kind: "Sensor" },
    summary:
      "Particle and VOC signature consistent with vaping detected in the Level 2 north washroom, well above the room baseline.",
    readings: [
      { label: "PM2.5", value: "186 µg/m³ (baseline 12)" },
      { label: "TVOC", value: "641 ppb (baseline 220)" },
      { label: "Confidence", value: "94 %" },
    ],
    actions: [
      "Pull the last 60 s of corridor footage leading to the doorway",
      "Dispatch a staff member for a welfare check",
      "Re-baseline the sensor once the room clears",
    ],
  },
  {
    id: "evt-1040",
    title: "Door forced open",
    category: "access",
    severity: "critical",
    status: "active",
    location: "Server Room — B1",
    building: "Mathematics & Computer Building",
    lat: 43.4723,
    lng: -80.544,
    minutesAgo: 9,
    device: { name: "MC-B1-Server-Door", model: "AC42", kind: "Door" },
    summary:
      "The server room door opened without a valid credential or request-to-exit. This is a forced-entry signal.",
    readings: [
      { label: "Credential", value: "none presented" },
      { label: "Request to exit", value: "not asserted" },
      { label: "Sequence", value: "contact broke 220 ms before REX" },
    ],
    actions: [
      "Treat as a live intrusion until video proves otherwise",
      "Dispatch the nearest responder and lock adjacent readers",
      "Preserve the access controller audit log",
    ],
  },
  {
    id: "evt-1039",
    title: "Occupancy exceeds rated capacity",
    category: "crowding",
    severity: "high",
    status: "active",
    location: "Atrium",
    building: "Student Life Centre",
    lat: 43.4715,
    lng: -80.5433,
    minutesAgo: 14,
    device: { name: "SLC-Atrium", model: "SV23", kind: "Sensor" },
    summary:
      "The atrium is holding 168 people against a posted capacity of 140. Egress width is now the limiting factor in an evacuation.",
    readings: [
      { label: "Occupancy", value: "168 / 140" },
      { label: "Egress load", value: "1.9 persons/m (max 1.4)" },
      { label: "CO₂", value: "1,240 ppm" },
    ],
    actions: [
      "Open the secondary egress doors to split the flow",
      "Meter inbound traffic at the entrance",
      "Notify the fire safety officer — this is a code issue",
    ],
  },
  {
    id: "evt-1038",
    title: "Motion in restricted zone after hours",
    category: "intrusion",
    severity: "high",
    status: "acknowledged",
    location: "Physics Lab — Level 1",
    building: "Physics Building",
    lat: 43.4705,
    lng: -80.544,
    minutesAgo: 22,
    device: { name: "PHY-Lab1-Motion", model: "SV11", kind: "Sensor" },
    summary:
      "Motion detected in a restricted lab outside operating hours with no matching badge-in on the controlling door.",
    readings: [
      { label: "Zone classification", value: "restricted" },
      { label: "Badge activity", value: "none in last 30 min" },
      { label: "Door state", value: "closed / secured" },
    ],
    actions: [
      "Verify against the camera before dispatching",
      "Dispatch the nearest responder with live view open",
      "Escalate to police with the clip if the person is unidentified",
    ],
  },
  {
    id: "evt-1037",
    title: "CO₂ above ventilation threshold",
    category: "air_quality",
    severity: "medium",
    status: "active",
    location: "Lecture Hall 101",
    building: "Quantum Nano Centre",
    lat: 43.471,
    lng: -80.545,
    minutesAgo: 27,
    device: { name: "QNC-101-Air", model: "SV23", kind: "Sensor" },
    summary:
      "CO₂ reached 1,180 ppm with 94 people present, indicating under-ventilation for the current occupancy.",
    readings: [
      { label: "CO₂", value: "1,180 ppm (baseline 520)" },
      { label: "Occupancy", value: "94" },
      { label: "Ventilation", value: "6.2 L/s/person" },
    ],
    actions: [
      "Command HVAC to boost outside-air fraction for this zone",
      "Relocate occupants if CO₂ holds above 1,400 ppm for 10 min",
      "Check for a shared damper fault on the same AHU",
    ],
  },
  {
    id: "evt-1036",
    title: "Door held open",
    category: "access",
    severity: "medium",
    status: "active",
    location: "Loading Dock — East",
    building: "Needles Hall",
    lat: 43.469,
    lng: -80.544,
    minutesAgo: 34,
    device: { name: "NH-Dock-Roller", model: "DT33", kind: "Door" },
    summary:
      "The loading dock roller door has reported open for longer than its 45-second allowance. A propped door defeats the access boundary.",
    readings: [
      { label: "Held open", value: "1 min 52 s (allowance 45 s)" },
      { label: "Last credential", value: "Staff badge · 09:41" },
      { label: "Local alarm", value: "sounding" },
    ],
    actions: [
      "Attempt a remote release-and-resecure cycle",
      "Check the dock camera — a propped door is often a delivery",
      "Escalate if a second door in the same zone opens",
    ],
  },
  {
    id: "evt-1035",
    title: "Chemical / VOC spike",
    category: "air_quality",
    severity: "high",
    status: "acknowledged",
    location: "Makerspace",
    building: "Engineering 5",
    lat: 43.472,
    lng: -80.5405,
    minutesAgo: 41,
    device: { name: "E5-Makerspace-VOC", model: "SV23", kind: "Sensor" },
    summary:
      "Total volatile organic compounds spiked to 890 ppb. Consistent with solvent, resin or cleaning-agent exposure.",
    readings: [
      { label: "TVOC", value: "890 ppb (baseline 220)" },
      { label: "Rate of rise", value: "310 ppb/min" },
      { label: "Temperature", value: "23.8 °C" },
    ],
    actions: [
      "Confirm the fume hood or local exhaust was running",
      "Restrict access until TVOC falls below 500 ppb",
      "Notify the lab safety officer and log the exposure window",
    ],
  },
  {
    id: "evt-1034",
    title: "Tailgating at entry point",
    category: "access",
    severity: "medium",
    status: "resolved",
    location: "Main Entrance Turnstile",
    building: "Physical Activities Complex",
    lat: 43.4713,
    lng: -80.5465,
    minutesAgo: 55,
    device: { name: "PAC-Turnstile-1", model: "AC62", kind: "Door" },
    summary:
      "One credential produced three people through the turnstile. Two did not badge, and the camera confirms a single swing.",
    readings: [
      { label: "People through", value: "3 (1 credential)" },
      { label: "Credential", value: "Staff badge · valid" },
      { label: "Camera confirm", value: "yes — 3 persons, 1.2 s spacing" },
    ],
    actions: [
      "Re-badge the unbadged visitors at reception",
      "Enable anti-passback on this reader for 24 hours",
      "Issue temporary credentials if they are expected contractors",
    ],
  },
  {
    id: "evt-1033",
    title: "Temperature above safe band",
    category: "environmental",
    severity: "high",
    status: "active",
    location: "Network Closet — Level 2",
    building: "Columbia Icefield",
    lat: 43.4735,
    lng: -80.547,
    minutesAgo: 63,
    device: { name: "CIF-L2-Closet", model: "SV23", kind: "Sensor" },
    summary:
      "The closet is at 29.4 °C and climbing. Equipment in this zone is rated for a sustained maximum of 27 °C.",
    readings: [
      { label: "Temperature", value: "29.4 °C (baseline 21.0)" },
      { label: "Rate of rise", value: "+0.8 °C / 5 min" },
      { label: "Humidity", value: "38 %" },
    ],
    actions: [
      "Verify CRAC / split-unit status and check for a tripped breaker",
      "Shift non-critical compute load off the affected racks",
      "Set a 10-minute recheck timer and escalate if the rise holds",
    ],
  },
  {
    id: "evt-1032",
    title: "Moisture / leak detected",
    category: "environmental",
    severity: "medium",
    status: "resolved",
    location: "Kitchen — Level 1",
    building: "Village 1",
    lat: 43.469,
    lng: -80.547,
    minutesAgo: 96,
    device: { name: "V1-Kitchen-Leak", model: "SV25", kind: "Sensor" },
    summary:
      "Humidity jumped 26 points above baseline with a matching temperature drop — the signature of standing water near the sensor.",
    readings: [
      { label: "Humidity", value: "78 % (baseline 52)" },
      { label: "Temperature", value: "20.9 °C" },
      { label: "Dew point", value: "16.8 °C" },
    ],
    actions: [
      "Shut off the nearest supply isolation valve",
      "Dispatch facilities with a wet-vac and thermal camera",
      "Check the floor below for migration before closing",
    ],
  },
];

export const BUILDING_COUNT = new Set(EVENTS.map((e) => e.building)).size;