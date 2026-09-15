"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SEVERITY, type SafetyEvent, type Severity } from "@/lib/types";

const CAMPUS_CENTER: [number, number] = [43.4712, -80.5438];

function markerIcon(severity: Severity, selected: boolean) {
  const size = selected ? 22 : 16;
  const color = SEVERITY[severity];
  return L.divIcon({
    // Styling comes from globals.css (leaflet's default div-icon chrome is reset there).
    className: "safety-marker",
    html: `
      <div class="relative flex items-center justify-center" style="width:${size}px;height:${size}px">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full ${color.dot} opacity-40"></span>
        <span class="relative inline-flex rounded-full ${color.dot} border-2 border-white/90 shadow-lg" style="width:${size}px;height:${size}px"></span>
        ${
          selected
            ? `<span class="absolute rounded-full border-2 ${color.border}" style="width:${size + 18}px;height:${size + 18}px"></span>`
            : ""
        }
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Keeps the viewport on the selected event without fighting the user's panning. */
function FlyToSelection({ event }: { event?: SafetyEvent }) {
  const map = useMap();
  const lat = event?.lat;
  const lng = event?.lng;

  useEffect(() => {
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 17), { duration: 0.6 });
  }, [lat, lng, map]);

  return null;
}

export default function SafetyMap({
  events,
  selectedId,
  onSelect,
}: {
  events: SafetyEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = events.find((e) => e.id === selectedId);

  // Icons are rebuilt only when the selection changes, not on every render.
  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>();
    for (const e of events) {
      map.set(e.id, markerIcon(e.severity, e.id === selectedId));
    }
    return map;
  }, [events, selectedId]);

  return (
    <MapContainer
      center={CAMPUS_CENTER}
      zoom={16}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      <FlyToSelection event={selected} />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lng]}
          icon={icons.get(event.id)}
          eventHandlers={{ click: () => onSelect(event.id) }}
        />
      ))}
    </MapContainer>
  );
}