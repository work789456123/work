"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

interface MedicalEmergency {
  id: string;
  mobile_number: string;
  description: string;
  status: string;
  created_at: string;
}

const POLL_INTERVAL = 20_000;

export default function MedicalEmergenciesPage() {
  const [emergencies, setEmergencies] = useState<MedicalEmergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Always use relative paths — Next.js rewrites proxy /api to the backend
  const API_URL = "";

  const fetchEmergencies = useCallback(async (silent = false) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/medical-emergency`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch medical emergencies");
      const data = await res.json();
      setEmergencies(data);
      setError("");
      setLastUpdated(new Date());
    } catch (err: any) {
      if (!silent) setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchEmergencies();
    intervalRef.current = setInterval(() => fetchEmergencies(true), POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchEmergencies]);

  const handleResolve = async (id: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_URL}/api/medical-emergency/${id}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to resolve emergency");
      fetchEmergencies(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns = [
    { key: "mobile_number" as const, label: "Mobile Number" },
    { key: "description" as const, label: "Description" },
    { key: "created_at" as const, label: "Time" },
    { key: "status" as const, label: "Status" },
    { key: "actions" as const, label: "Actions" },
  ];

  const formattedData = emergencies.map(e => ({
    ...e,
    created_at: new Date(e.created_at).toLocaleString(),
    status: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        e.status === "pending" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      }`}>
        {e.status === "pending"
          ? <Clock className="w-3 h-3 mr-1" />
          : <CheckCircle2 className="w-3 h-3 mr-1" />}
        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
      </span>
    ),
    actions: e.status === "pending" ? (
      <button
        type="button"
        onClick={() => handleResolve(e.id)}
        className="px-3 py-1 bg-[#1F6559] text-white text-sm rounded hover:bg-[#154d43]"
      >
        Mark Resolved
      </button>
    ) : (
      <span className="text-gray-400 text-sm">Resolved</span>
    ),
  }));

  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Medical Emergencies"
          description="Manage medical complaints raised by users."
        />
        <div className="flex flex-col items-end gap-1 pt-1">
          <button
            type="button"
            onClick={() => fetchEmergencies(false)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {lastUpdated && (
            <span className="text-[11px] text-slate-400">
              Updated {lastUpdated.toLocaleTimeString()} · auto every 20s
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <p className="px-6 py-8 text-center text-slate-500">Loading medical emergencies…</p>
        ) : error ? (
          <p className="px-6 py-8 text-center text-red-500">{error}</p>
        ) : (
          <Table columns={columns} data={formattedData} />
        )}
      </div>
    </main>
  );
}
