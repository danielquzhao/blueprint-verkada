"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Plus, Upload, X } from "lucide-react";
import { BUILDINGS, REPORT_ACTIONS } from "@/lib/events";
import {
  CATEGORY_LABEL,
  SEVERITY,
  type EventCategory,
  type SafetyEvent,
  type Severity,
} from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_LABEL) as EventCategory[];
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: SafetyEvent) => void;
};

const emptyForm = {
  title: "",
  summary: "",
  building: "",
  location: "",
  category: "" as EventCategory | "",
  severity: "" as Severity | "",
  reportedBy: "",
};

export default function ReportIncidentModal({ isOpen, onClose, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(emptyForm);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setForm(emptyForm);
    setAttachment(null);
    setFileName(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const close = () => {
    reset();
    onClose();
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please attach a photo (JPG, PNG, or HEIC).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(typeof reader.result === "string" ? reader.result : null);
      setFileName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.building || !form.category || !form.severity) {
      setError("Title, what happened, building, category, and severity are required.");
      return;
    }
    const site = BUILDINGS.find((b) => b.name === form.building);
    if (!site) {
      setError("Pick a campus building.");
      return;
    }

    const event: SafetyEvent = {
      id: `evt-r-${Date.now().toString(36)}`,
      title: form.title.trim(),
      category: form.category,
      severity: form.severity,
      status: "active",
      location: form.location.trim() || "Reported on site",
      building: site.name,
      lat: site.lat,
      lng: site.lng,
      minutesAgo: 0,
      device: { name: "Community report", model: "Witness", kind: "Alarm" },
      summary: form.summary.trim(),
      readings: [
        { label: "Source", value: "Campus community report" },
        { label: "Evidence", value: attachment ? fileName ?? "Photo attached" : "None" },
        { label: "Reported by", value: form.reportedBy.trim() || "Anonymous" },
      ],
      actions: REPORT_ACTIONS,
      source: "report",
      attachment: attachment ?? undefined,
      reportedBy: form.reportedBy.trim() || undefined,
    };

    onSubmit(event);
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg overflow-y-auto rounded-xl border border-white/15 bg-zinc-950 text-zinc-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
              <Plus className="h-4 w-4 text-emerald-400" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Report an incident</h2>
              <p className="text-xs text-zinc-400">File a campus safety report — photo optional</p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 px-5 py-4">
            <label className="block">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                Title
              </span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Slip hazard on Ring Road"
                className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
              />
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                What happened
              </span>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="Describe what you saw, when, and who might need help."
                rows={2}
                className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Building
                </span>
                <select
                  value={form.building}
                  onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
                >
                  <option value="">Select building</option>
                  {BUILDINGS.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Exact spot
                </span>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Floor, room, entrance…"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Category
                </span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as EventCategory }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Severity
                </span>
                <select
                  value={form.severity}
                  onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Severity }))}
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/50"
                >
                  <option value="">Select severity</option>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {SEVERITY[s].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Your name <span className="normal-case tracking-normal text-zinc-600">(optional)</span>
                </span>
                <input
                  value={form.reportedBy}
                  onChange={(e) => setForm((f) => ({ ...f, reportedBy: e.target.value }))}
                  placeholder="Anonymous if left blank"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
                />
              </label>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Photo <span className="normal-case tracking-normal text-zinc-600">(optional)</span>
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFile}
                />
                {attachment ? (
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={attachment} alt="" className="h-8 w-8 rounded object-cover" />
                    <p className="min-w-0 flex-1 truncate text-xs text-zinc-400">{fileName}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);
                        setFileName(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-100"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-3 py-2 text-xs text-zinc-400 transition hover:border-emerald-500/40 hover:text-zinc-200"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Upload photo
                  </button>
                )}
              </div>
            </div>

            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
            <button
              type="button"
              onClick={close}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
            >
              <Upload className="h-3.5 w-3.5" />
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
