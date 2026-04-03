import { Metadata } from "next";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { animals } from "@/data/dummyData";

// metadat for seo
export const metadata: Metadata = {
  title: "Animal Records | Dashboard",
  description: "Comprehensive directory of registered animals and their owner profiles.",
};

export default function AnimalsPage() {

  const tableColumns = [
    { key: "name" as const, label: "Animal Name" },
    { key: "owner" as const, label: "Owner Name" },
  ];

  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Animal Records" 
        description="Comprehensive directory of registered animals and their owner profiles."
        actionButtonLabel="+ Add Animal Record"
      />
      
      {/*data is passed directly from the server-side import */}
      <Table columns={tableColumns} data={animals} />
    </main>
  );
}