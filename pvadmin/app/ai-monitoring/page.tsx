import PageHeader from "@/components/PageHeader";

export default function AIMonitoringPage() {
  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="AI Monitoring"
        description="Monitor automated system insights and farm analytics."
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">No Active Alerts</h3>
        <p className="mt-2 text-slate-500">The AI detection systems are running normally. No anomalies detected across active farms.</p>
      </div>
    </main>
  );
}
