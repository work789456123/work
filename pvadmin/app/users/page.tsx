import { Metadata } from "next";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { users } from "@/data/dummyData";

//SEO 
export const metadata: Metadata = {
  title: "Users Directory | Pashuvaani",
  description: "Manage system access and roles across the administrative dashboard.",
};

export default function UsersPage() {
  //table configuration
  // Using 'as const' ensures type-safety with your Table component keys
  const tableColumns = [
    { key: "name" as const, label: "Full Name" },
    { key: "email" as const, label: "Email Address" },
  ];

  return (
    <main className="space-y-6 animate-in fade-in duration-700">
      {/* Page Header Section */}
      <PageHeader 
        title="Users Directory" 
        description="Manage system access and roles across the administrative dashboard."
        actionButtonLabel="+ Add New User"
      />
      
      {/* Data Table Section */}
      <section className="rounded-xl bg-white shadow-sm border border-slate-100">
        <Table columns={tableColumns} data={users} />
      </section>
    </main>
  );
}