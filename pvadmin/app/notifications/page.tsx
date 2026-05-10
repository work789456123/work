import PageHeader from "@/components/PageHeader";

export default function NotificationsPage() {
  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Notifications"
        description="Manage system-wide alerts and user notifications."
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">No Notifications</h3>
        <p className="mt-2 text-slate-500">There are currently no active system notifications to display.</p>
      </div>
    </main>
  );
}
