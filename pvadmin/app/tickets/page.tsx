"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, CheckCircle2, Clock } from "lucide-react";

interface Ticket {
  id: string;
  email: string;
  status: string;
  created_at: string;
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.detail === "string" ? err.detail : "Request failed");
  }
  if (res.status === 204) return null as T;
  return res.json();
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const adminRole = localStorage.getItem("admin_role");
    setRole(adminRole);

    if (adminRole === "superadmin") {
      apiFetch<Ticket[]>("/api/admin/password-reset-tickets")
        .then(setTickets)
        .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("You do not have permission to view this page. Super admin access required.");
    }
  }, []);

  const handleUpdateStatus = async (ticketId: string, status: "confirmed" | "cancelled") => {
    setUpdating(ticketId);
    try {
      const endpoint = status === "confirmed" ? "resolve" : "cancel"; // Mapping confirm to resolve for now
      await apiFetch(`/api/admin/password-reset-tickets/${ticketId}/${endpoint}`, {
        method: "PUT",
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: status === "confirmed" ? "resolved" : "cancelled" } : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update ticket");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Password Reset Tickets</h1>
          <p className="mt-1 text-slate-500">
            View and manage password reset requests from admin users.
          </p>
        </div>
      </header>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800">
          Only super admins can view and resolve password reset tickets. To set a new password, go to the Admin Access page.
        </p>
      </div>

      {error ? (
        <div className="py-16 text-center text-sm text-red-500">{error}</div>
      ) : (
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_150px] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Email</span>
            <span>Date requested</span>
            <span className="text-center">Status</span>
            <span className="text-right">Action</span>
          </div>

          {tickets.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              No password reset tickets found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="grid grid-cols-[1.5fr_1fr_1fr_150px] items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {ticket.email}
                  </span>
                  
                  <span className="truncate text-sm text-slate-500">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>

                  <div className="flex justify-center">
                    {ticket.status === "pending" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 border border-orange-200">
                        <Clock size={12} />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={12} />
                        Resolved
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end">
                    {ticket.status === "pending" ? (
                      <button
                        onClick={() => handleUpdateStatus(ticket.id, "confirmed")}
                        disabled={updating === ticket.id}
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 active:scale-95 disabled:opacity-50"
                      >
                        {updating === ticket.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600">Issue Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
