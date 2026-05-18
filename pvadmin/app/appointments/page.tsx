"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, ChevronDown } from "lucide-react";

interface Appointment {
  id: string;
  user_id: string;
  user_email: string | null;
  owner_name: string;
  owner_number: string;
  pet_name: string;
  pet_type: string;
  gender: string;
  age: string;
  weight: string;
  weight_unit: string;
  time_slot: string;
  status: string;
  vaccination_status: boolean;
  medical_history_available: boolean;
  medical_history: string;
  source: string;
}

// Always use relative paths — Next.js rewrites proxy /api to the backend
const API_URL = "";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  pending:   { label: "Pending",   icon: <Clock size={12} />,        classes: "bg-amber-50 text-amber-700 border-amber-200" },
  SCHEDULED: { label: "Pending",   icon: <Clock size={12} />,        classes: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", icon: <CheckCircle2 size={12} />, classes: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", icon: <XCircle size={12} />,      classes: "bg-red-50 text-red-600 border-red-200" },
  CANCELLED: { label: "Cancelled", icon: <XCircle size={12} />,      classes: "bg-red-50 text-red-600 border-red-200" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.classes}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function isPending(status: string) {
  return status === "pending" || status === "SCHEDULED";
}
function isCancelled(status: string) {
  return status === "cancelled" || status === "CANCELLED";
}

// ── Dropdown action menu ──────────────────────────────────────────────────────
function ActionMenu({
  appt,
  updating,
  onAction,
}: {
  appt: Appointment;
  updating: string | null;
  onAction: (id: string, action: "confirmed" | "cancelled") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isUpdating = updating === appt.id;

  // Cancelled — no actions available
  if (isCancelled(appt.status)) {
    return <span className="text-xs text-slate-300">—</span>;
  }

  const canConfirm = isPending(appt.status);
  const canCancel  = isPending(appt.status) || appt.status === "confirmed";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isUpdating}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
      >
        {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Actions"}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
          {canConfirm && (
            <button
              onClick={() => { setOpen(false); onAction(appt.id, "confirmed"); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 transition-colors"
            >
              <CheckCircle2 size={13} />
              Confirm
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => { setOpen(false); onAction(appt.id, "cancelled"); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <XCircle size={13} />
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    setError("");
    apiFetch<Appointment[]>("/api/admin/appointments")
      .then(setAppointments)
      .catch(() => setError("Failed to load appointments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setUpdating(id);
    const endpoint = status === "confirmed" ? "confirm" : "cancel";
    try {
      const updated = await apiFetch<Appointment>(`/api/admin/appointments/${id}/${endpoint}`, { method: "PUT" });
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? { ...a, status: updated.status } : a)));
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="mt-1 text-slate-500">All vet consultation requests from users.</p>
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {(["pending", "confirmed", "cancelled"] as const).map((s) => {
            const count = appointments.filter((a) =>
              s === "pending"   ? isPending(a.status) :
              s === "cancelled" ? isCancelled(a.status) :
              a.status === s
            ).length;
            const cfg = statusConfig[s];
            return (
              <div key={s} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{cfg.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">{count}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_0.8fr_80px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div>User</div>
          <div>Pet</div>
          <div>Owner</div>
          <div>Time Slot</div>
          <div>Status</div>
          <div>Source</div>
          <div className="text-right">Actions</div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading appointments…</span>
          </div>
        )}
        {!loading && error && <div className="py-20 text-center text-sm text-red-500">{error}</div>}
        {!loading && !error && appointments.length === 0 && (
          <div className="py-20 text-center text-sm text-slate-400">No appointments yet.</div>
        )}

        {!loading && !error && appointments.map((appt, i) => (
          <div
            key={appt.id}
            className={`grid grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_0.8fr_80px] items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50 ${
              i !== appointments.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            {/* User */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{appt.user_email ?? appt.user_id}</p>
              <p className="truncate text-xs text-slate-400">{appt.user_id}</p>
            </div>

            {/* Pet */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">{appt.pet_name}</p>
              <p className="truncate text-xs text-slate-400">
                {appt.pet_type} · {appt.gender}{appt.age ? ` · ${appt.age}` : ""}
              </p>
            </div>

            {/* Owner */}
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-700">{appt.owner_name}</p>
              <p className="truncate text-xs text-slate-400">{appt.owner_number}</p>
            </div>

            {/* Time slot */}
            <p className="truncate text-sm text-slate-600">{appt.time_slot}</p>

            {/* Status */}
            <StatusBadge status={appt.status} />

            {/* Source */}
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
              appt.source === "whatsapp"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-600 border-blue-200"
            }`}>
              {appt.source === "whatsapp" ? "💬 WA" : appt.source === "telegram" ? "🔹 TG" : "🌐 Web"}
            </span>

            {/* Actions dropdown */}
            <div className="flex justify-end">
              <ActionMenu appt={appt} updating={updating} onAction={updateStatus} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
