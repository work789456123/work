import PageHeader from "@/components/PageHeader";

export default function ReportsPage() {
  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Reports"
        description="Generate and export comprehensive analytics reports."
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Reports Module</h3>
        <p className="mt-2 text-slate-500">Advanced reporting tools are currently being configured.</p>
      </div>
    </main>
  );
}
