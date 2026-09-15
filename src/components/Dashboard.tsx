"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Plus, Settings, ShieldCheck } from "lucide-react";
import SidePanel from "./SidePanel";
import SettingsModal from "./SettingsModal";
import ReportIncidentModal from "./ReportIncidentModal";
import { EVENTS } from "@/lib/events";
import { SEVERITY, type SafetyEvent, type Severity } from "@/lib/types";

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
  const [events, setEvents] = useState<SafetyEvent[]>(EVENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<Record<Severity, boolean>>({
    critical: true,
    high: true,
    medium: false,
    low: false,
  });

  const togglePreference = (severity: Severity) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [severity]: !prev[severity],
    }));
  };

  const setAllPreferences = (enabled: boolean) => {
    setNotificationPreferences({
      critical: enabled,
      high: enabled,
      medium: enabled,
      low: enabled,
    });
  };

  const active = events.filter((e) => e.status === "active");
  const critical = events.filter((e) => e.severity === "critical" && e.status !== "resolved");
  const devices = new Set(events.map((e) => e.device.name)).size;
  const buildings = new Set(events.map((e) => e.building)).size;
  const subscribedSeveritiesCount = Object.values(notificationPreferences).filter(Boolean).length;

  const addReport = (event: SafetyEvent) => {
    setEvents((prev) => [event, ...prev]);
    setSelectedId(event.id);
    setIsReportOpen(false);
  };

  return (
    <div className="flex h-dvh flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </span>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold">Geese Connect</h1>
            <p className="text-[11px] text-zinc-500">Verkada safety intelligence · Waterloo campus</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Stat value={critical.length} label="critical" tone={SEVERITY.critical.text} />
          <Stat value={active.length} label="active" />
          <Stat value={devices} label="devices reporting" />
          <Stat value={buildings} label="buildings" />
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-zinc-100"
            title="Notification settings"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-400" />
            <span>Alerts ({subscribedSeveritiesCount}/4)</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1">
          <SafetyMap events={events} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 backdrop-blur">
            <p className="text-[11px] text-zinc-400">
              {events.length} events plotted · click a marker for details
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="absolute right-4 bottom-4 z-[500] flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            Report incident
          </button>
        </main>

        <aside className="w-[380px] shrink-0 border-l border-white/10">
          <SidePanel events={events} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
      </div>

      <ReportIncidentModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={addReport}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={notificationPreferences}
        onToggle={togglePreference}
        onSetAll={setAllPreferences}
      />
    </div>
  );
}
