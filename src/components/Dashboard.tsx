"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import SidePanel from "./SidePanel";
import { BUILDING_COUNT, EVENTS } from "@/lib/events";
import { SEVERITY } from "@/lib/types";

const SafetyMap = dynamic(() => import("./SafetyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-sm text-zinc-500">
      Loading map…
    </div>
  ),
});

function Stat({ value, label, tone }: { value: number | string; label: string; tone?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-mono text-sm font-semibold ${tone ?? "text-zinc-100"}`}>{value}</span>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const active = EVENTS.filter((e) => e.status === "active");
  const critical = EVENTS.filter((e) => e.severity === "critical" && e.status !== "resolved");
  const devices = new Set(EVENTS.map((e) => e.device.name)).size;

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </span>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold">Sentinel</h1>
            <p className="text-[11px] text-zinc-500">Verkada safety intelligence · Waterloo campus</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Stat value={critical.length} label="critical" tone={SEVERITY.critical.text} />
          <Stat value={active.length} label="active" />
          <Stat value={devices} label="devices reporting" />
          <Stat value={BUILDING_COUNT} label="buildings" />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1">
          <SafetyMap events={EVENTS} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 backdrop-blur">
            <p className="text-[11px] text-zinc-400">
              {EVENTS.length} events plotted · click a marker for details
            </p>
          </div>
        </main>

        <aside className="w-[380px] shrink-0 border-l border-white/10">
          <SidePanel events={EVENTS} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
      </div>
    </div>
  );
}