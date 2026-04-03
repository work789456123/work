import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { appointments } from "@/data/dummyData";

export default function AppointmentsPage() {
  const tableColumns = [
    { key: "user" as const, label: "Patient" },
    { key: "vet" as const, label: "Veterinarian" },
    { key: "date" as const, label: "Time Slot" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Appointments" 
        description="Overview of upcoming checkups, consultations, and operations."
        actionButtonLabel="+ Schedule Appointment"
      />
      
      <Table columns={tableColumns} data={appointments} />
    </div>
  );
}