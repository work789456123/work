import { Metadata } from "next";
import StatCard from "@/components/StatCard";
import { dashboardData } from "@/data/dummyData";

export const metadata: Metadata = {
  title: "Dashboard | Pashuvaani",
  description: "Real-time health insights and management metrics.",
};

// --- Sub-components (Kept in same file for better readability if they are private to this page) ---

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
        <button className="rounded-xl bg-[#1F6559] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#154d43] active:scale-95">
          + Add New Record
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

// --- Main Page Component ---

export default function DashboardPage() {
  return (
    <main className="space-y-8 animate-in fade-in duration-700 fill-mode-both">
      <DashboardHeader />

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Users" value={dashboardData.users} trend="+12%" color="blue" />
        <StatCard title="Animal Records" value={dashboardData.animals} trend="+5%" color="purple" />
        <StatCard title="Appointments" value={dashboardData.appointments} trend="-2%" color="orange" />
        <StatCard title="Active Vets" value={dashboardData.vets} trend="Stable" color="green" />
        <StatCard title="Total Revenue" value={`$${dashboardData.revenue}k`} trend="+28%" color="yellow" />
      </section>

      <ChartsSection />
    </main>
  );
}