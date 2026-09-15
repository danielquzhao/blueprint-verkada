"use client";

import { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { SEVERITY, type SafetyEvent } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** University of Waterloo campus. */
const CAMPUS = { longitude: -80.5438, latitude: 43.4712 };

function EventMarker({
  event,
  selected,
  onSelect,
}: {
  event: SafetyEvent;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const s = SEVERITY[event.severity];
  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      aria-label={`${event.title} at ${event.building}`}
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center"
    >
      <span className={`absolute h-4 w-4 animate-ping rounded-full ${s.dot} opacity-40`} />
      {selected && (
        <span className={`absolute h-8 w-8 rounded-full border-2 ${s.border}`} />
      )}
      <span
        className={`relative rounded-full border-2 border-white/90 shadow-lg ${s.dot} ${
          selected ? "h-5 w-5" : "h-3.5 w-3.5"
        }`}
      />
    </button>
  );
}

function MissingToken() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8">
      <div className="max-w-md rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Mapbox token required</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Add a public token to <code className="font-mono text-xs text-zinc-200">.env.local</code>{" "}
          and restart the dev server:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-emerald-300">
          NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
        </pre>
        <p className="mt-3 text-xs text-zinc-500">
          Create one at account.mapbox.com → Tokens. A default public token with the{" "}
          <span className="text-zinc-400">styles:tiles</span> scope is enough.
        </p>
      </div>
    </div>
  );
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
  const mapRef = useRef<MapRef>(null);
  const selected = events.find((e) => e.id === selectedId);
  const lat = selected?.lat;
  const lng = selected?.lng;

  // Ease the viewport onto the selected event without fighting manual panning.
  useEffect(() => {
    if (lat == null || lng == null) return;
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 16.5, duration: 900 });
  }, [lat, lng]);

  if (!MAPBOX_TOKEN) return <MissingToken />;

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{ ...CAMPUS, zoom: 15.5 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      attributionControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" showCompass={false} />
      {events.map((event) => (
        <Marker
          key={event.id}
          longitude={event.lng}
          latitude={event.lat}
          anchor="center"
        >
          <EventMarker
            event={event}
            selected={event.id === selectedId}
            onSelect={onSelect}
          />
        </Marker>
      ))}
    </Map>
  );
}