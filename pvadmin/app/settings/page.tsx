import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="System Settings"
        description="Configure global application variables and preferences."
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Global Configuration</h3>
        <p className="mt-2 text-slate-500">System settings are locked for standard admin accounts. Please use the superadmin environment to modify configurations.</p>
      </div>
    </main>
  );
}
