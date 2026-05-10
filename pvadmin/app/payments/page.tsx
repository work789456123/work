import PageHeader from "@/components/PageHeader";

export default function PaymentsPage() {
  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Payments"
        description="View transaction history and manage payment gateways."
      />
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Payment Gateway Integration Pending</h3>
        <p className="mt-2 text-slate-500">Detailed transaction histories will appear here once the payment systems are fully synchronized.</p>
      </div>
    </main>
  );
}
