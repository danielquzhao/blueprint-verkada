"use client";

import { Bell, X } from "lucide-react";
import { SEVERITY, type Severity } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: Record<Severity, boolean>;
  onToggle: (severity: Severity) => void;
  onSetAll: (enabled: boolean) => void;
}

const SEVERITY_DESCRIPTIONS: Record<Severity, string> = {
  critical: "Immediate duress, panic buttons, and unauthorized server room access.",
  high: "Vape aerosol, forced doors, and high-occupancy warnings.",
  medium: "CO₂ threshold exceedance, propped doors, and chemical spikes.",
  low: "Minor environmental alerts, temperature fluctuations, and routine notices.",
};

export default function SettingsModal({
  isOpen,
  onClose,
  preferences,
  onToggle,
  onSetAll,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const activeCount = Object.values(preferences).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-white/15 bg-zinc-950 p-6 shadow-2xl text-zinc-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Bell className="h-4 w-4 text-sky-400" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Notification Preferences</h2>
              <p className="text-xs text-zinc-400">
                Subscribe or unsubscribe from event severity channels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Subscribed to <strong className="text-zinc-200">{activeCount}</strong> of 4 severity
              levels
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onSetAll(true)}
                className="text-sky-400 transition hover:underline"
              >
                Enable all
              </button>
              <span>·</span>
              <button
                onClick={() => onSetAll(false)}
                className="text-zinc-400 transition hover:underline"
              >
                Mute all
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => {
              const s = SEVERITY[sev];
              const enabled = preferences[sev];
              return (
                <div
                  key={sev}
                  onClick={() => onToggle(sev)}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-3.5 transition ${
                    enabled
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 inline-flex h-2.5 w-2.5 rounded-full ${s.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-100">{s.label}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${s.chip}`}>
                          Priority {s.order}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">{SEVERITY_DESCRIPTIONS[sev]}</p>
                    </div>
                  </div>

                  <div
                    className={`mt-1 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                      enabled ? "bg-emerald-500" : "bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-[11px] text-zinc-500">
            Preferences save instantly and apply to all connected devices.
          </p>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/15"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
