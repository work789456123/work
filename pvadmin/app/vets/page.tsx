import { Metadata } from "next";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { vets } from "@/data/dummyData";

export const metadata: Metadata = {
  title: "Veterinary Staff | Pashuvaani",
};

export default function VetsPage() {
  const columns = [
    { key: "name" as const, label: "Veterinarian Name" },
    { key: "specialization" as const, label: "Specialty" },
  ];

  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Veterinary Staff" 
        description="Manage the active roster of veterinary doctors and specialists."
        actionButtonLabel="+ Add Vet Profile"
      />
      
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <Table columns={columns} data={vets} />
      </div>
    </main>
  );
}