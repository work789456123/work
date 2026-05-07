"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";

interface DashboardStats {
  total_users: number;
  total_pets: number;
  total_doctors: number;
  total_appointments: number;
  active_vets: number;
  revenue_from_credits: number;
}

function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-slate-500">
          Real-time health insights and management metrics for Pashuvaani.
        </p>
      </section>

      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
          Generate Report
        </button>
      </div>
    </header>
  );
}

function ChartsSection() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {[
        { title: "Active Users Overview", context: "Chart rendering context..." },
        { title: "Market Place Dynamics", context: "Chart rendering context..." },
      ].map((chart, index) => (
        <div 
          key={index} 
          className="flex h-80 flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800">{chart.title}</h3>
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <span className="font-medium text-slate-400">{chart.context}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_URL]);

  return (
    <main className="space-y-8 animate-in fade-in duration-700 fill-mode-both">
      <DashboardHeader />

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading dashboard...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Users" value={stats?.total_users ?? 0} trend="+12%" color="blue" />
          <StatCard title="Animal Records" value={stats?.total_pets ?? 0} trend="+5%" color="purple" />
          <StatCard title="Appointments" value={stats?.total_appointments ?? 0} trend="-2%" color="orange" />
          <StatCard title="Active Vets" value={stats?.active_vets ?? 0} trend="Stable" color="green" />
          <StatCard title="Total Revenue" value={`$${stats?.revenue_from_credits ?? 0}`} trend="+28%" color="yellow" />
        </section>
      )}

      <ChartsSection />
    </main>
  );
}