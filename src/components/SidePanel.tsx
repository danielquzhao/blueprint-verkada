"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Camera,
  CheckCircle2,
  DoorOpen,
  MapPin,
  Radio,
  ShieldAlert,
  Siren,
  Wind,
} from "lucide-react";
import {
  CATEGORY_LABEL,
  SEVERITY,
  timeAgo,
  type SafetyEvent,
  type Severity,
} from "@/lib/types";

const CATEGORY_ICON: Record<SafetyEvent["category"], typeof Wind> = {
  vape: Wind,
  air_quality: Wind,
  intrusion: ShieldAlert,
  duress: Siren,
  access: DoorOpen,
  crowding: Activity,
  environmental: Radio,
};

const DEVICE_ICON = { Camera, Sensor: Radio, Door: DoorOpen, Alarm: Siren } as const;

const FILTERS: Severity[] = ["critical", "high", "medium", "low"];

function SeverityChip({ severity }: { severity: Severity }) {
  const s = SEVERITY[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${s.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function StatusPill({ status }: { status: SafetyEvent["status"] }) {
  const map = {
    active: "border-white/15 bg-white/5 text-zinc-300",
    acknowledged: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  } as const;
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

function EventRow({
  event,
  selected,
  onSelect,
}: {
  event: SafetyEvent;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = CATEGORY_ICON[event.category];
  const s = SEVERITY[event.severity];
  return (
    <button
      onClick={() => onSelect(event.id)}
      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
        selected
          ? "border-white/25 bg-white/10"
          : "border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 rounded-md border p-1.5 ${s.chip}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-zinc-100">{event.title}</p>
            <span className="shrink-0 text-[11px] text-zinc-500">
              {timeAgo(event.minutesAgo)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-400">
            {event.building} · {event.location}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <SeverityChip severity={event.severity} />
            <span className="text-[11px] text-zinc-500">{event.device.model}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Detail({ event, onBack }: { event: SafetyEvent; onBack: () => void }) {
  const Icon = CATEGORY_ICON[event.category];
  const DeviceIcon = DEVICE_ICON[event.device.kind];
  const s = SEVERITY[event.severity];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-4 py-3">
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to feed
        </button>
        <div className="flex items-start gap-3">
          <span className={`rounded-lg border p-2 ${s.chip}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base leading-snug font-semibold text-zinc-50">{event.title}</h2>
            <p className="mt-1 text-xs text-zinc-400">
              {CATEGORY_LABEL[event.category]} · {timeAgo(event.minutesAgo)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SeverityChip severity={event.severity} />
          <StatusPill status={event.status} />
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
            {event.id}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <section>
          <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Location
          </h3>
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <div className="text-sm">
              <p className="text-zinc-100">{event.building}</p>
              <p className="text-zinc-400">{event.location}</p>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                {event.lat.toFixed(5)}, {event.lng.toFixed(5)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            What happened
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{event.summary}</p>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Reporting device
          </h3>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <DeviceIcon className="h-4 w-4 shrink-0 text-zinc-500" />
            <div className="min-w-0 text-sm">
              <p className="truncate text-zinc-100">{event.device.name}</p>
              <p className="text-xs text-zinc-500">
                {event.device.kind} · Verkada {event.device.model}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Sensor readings
          </h3>
          <dl className="mt-2 divide-y divide-white/5 overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
            {event.readings.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 px-3 py-2">
                <dt className="text-xs text-zinc-400">{r.label}</dt>
                <dd className="text-right font-mono text-xs text-zinc-200">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Recommended response
          </h3>
          <ol className="mt-2 space-y-2">
            {event.actions.map((action, i) => (
              <li key={action} className="flex gap-2.5 text-sm text-zinc-300">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/15 text-[10px] text-zinc-400">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="border-t border-white/10 p-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/15">
          <CheckCircle2 className="h-4 w-4" />
          Acknowledge event
        </button>
      </div>
    </div>
  );
}

export default function SidePanel({
  events,
  selectedId,
  onSelect,
}: {
  events: SafetyEvent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [active, setActive] = useState<Severity[]>([]);
  const [showResolved, setShowResolved] = useState(true);

  const visible = useMemo(() => {
    return events
      .filter((e) => (active.length ? active.includes(e.severity) : true))
      .filter((e) => (showResolved ? true : e.status !== "resolved"))
      .sort(
        (a, b) =>
          SEVERITY[b.severity].order - SEVERITY[a.severity].order || a.minutesAgo - b.minutesAgo,
      );
  }, [events, active, showResolved]);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {selected ? (
        <Detail event={selected} onBack={() => onSelect(null)} />
      ) : (
        <>
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-100">Safety feed</h2>
              <span className="text-xs text-zinc-500">{visible.length} events</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {FILTERS.map((sev) => {
                const on = active.includes(sev);
                const s = SEVERITY[sev];
                return (
                  <button
                    key={sev}
                    onClick={() =>
                      setActive((prev) =>
                        prev.includes(sev) ? prev.filter((x) => x !== sev) : [...prev, sev],
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] transition ${
                      on ? s.chip : "border-white/10 bg-white/[0.02] text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </button>
                );
              })}
              <button
                onClick={() => setShowResolved((v) => !v)}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                  showResolved
                    ? "border-white/10 bg-white/[0.02] text-zinc-500"
                    : "border-white/20 bg-white/10 text-zinc-200"
                }`}
              >
                Active only
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {visible.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                selected={event.id === selectedId}
                onSelect={onSelect}
              />
            ))}
            {!visible.length && (
              <p className="px-1 py-8 text-center text-sm text-zinc-500">
                No events match these filters.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}