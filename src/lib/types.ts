export type Severity = "critical" | "high" | "medium" | "low";

export type EventCategory =
  | "vape"
  | "air_quality"
  | "intrusion"
  | "duress"
  | "access"
  | "crowding"
  | "environmental";

export interface Reading {
  label: string;
  value: string;
}

/** A single safety observation surfaced from the Verkada device fleet. */
export interface SafetyEvent {
  id: string;
  title: string;
  category: EventCategory;
  severity: Severity;
  status: "active" | "acknowledged" | "resolved";
  /** Where it happened. */
  location: string;
  building: string;
  lat: number;
  lng: number;
  /** Minutes before "now" — keeps the demo deterministic across server/client. */
  minutesAgo: number;
  /** The device that raised it. */
  device: {
    name: string;
    model: string;
    kind: "Camera" | "Sensor" | "Door" | "Alarm";
  };
  summary: string;
  readings: Reading[];
  actions: string[];
}

export const SEVERITY: Record<
  Severity,
  { label: string; order: number; dot: string; text: string; chip: string; border: string }
> = {
  critical: {
    label: "Critical",
    order: 4,
    dot: "bg-red-500",
    text: "text-red-400",
    chip: "bg-red-500/10 text-red-300 border-red-500/30",
    border: "border-red-500",
  },
  high: {
    label: "High",
    order: 3,
    dot: "bg-orange-500",
    text: "text-orange-400",
    chip: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    border: "border-orange-500",
  },
  medium: {
    label: "Medium",
    order: 2,
    dot: "bg-amber-400",
    text: "text-amber-300",
    chip: "bg-amber-400/10 text-amber-200 border-amber-400/30",
    border: "border-amber-400",
  },
  low: {
    label: "Low",
    order: 1,
    dot: "bg-sky-400",
    text: "text-sky-300",
    chip: "bg-sky-400/10 text-sky-200 border-sky-400/30",
    border: "border-sky-400",
  },
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  vape: "Vape detection",
  air_quality: "Air quality",
  intrusion: "Intrusion",
  duress: "Duress",
  access: "Access control",
  crowding: "Crowding",
  environmental: "Environment",
};

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${Math.round(minutesAgo)} min ago`;
  const hours = minutesAgo / 60;
  if (hours < 24) return `${Math.round(hours)} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}