"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronRight,
  Search,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import UserPageShell from "@/motion/UserPageShell";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

interface Appointment {
  id: string;
  pet_name: string;
  pet_type: string;
  owner_name: string;
  time_slot: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

/** Shape returned by GET /appointments before we derive date/time strings. */
interface AppointmentApiRow {
  id: string;
  pet_name: string;
  pet_type: string;
  owner_name: string;
  time_slot: string;
  status: Appointment["status"];
}

export default function AppointmentTrackingPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await api.get("/appointments");

        const rows = response.data as AppointmentApiRow[];
        const mappedData = rows
          .map((apt) => ({
            ...apt,
            date: apt.time_slot.split(" ")[0] || "N/A",
            time: apt.time_slot.split(" ").slice(1).join(" ") || "N/A",
          }))
          .sort((a, b) => b.time_slot.localeCompare(a.time_slot));

        setAppointments(mappedData);
        setFilteredAppointments(mappedData);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  useEffect(() => {
    let result = appointments;

    if (statusFilter !== "all") {
      result = result.filter((apt) => apt.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (apt) =>
          apt.pet_name.toLowerCase().includes(query) ||
          apt.owner_name.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(result);
  }, [searchQuery, statusFilter, appointments]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";

      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";

      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-100";

      case "cancelled":
        return "text-red-600 bg-red-50 border-red-100";

      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />;

      case "pending":
        return <Timer className="h-4 w-4" />;

      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;

      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;

      default:
        return null;
    }
  };

  return (
    <UserPageShell
      id="page-tracking-appointments"
      className="min-h-screen bg-gradient-to-b from-[#1FA7A6]/15 to-[#F8FAFB]"
    >
      {/* HERO SECTION */}
      <PageTitle
        id="tracking-hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#1F6559] to-[#1FA7A6] pb-40 pt-16 text-white"
      >
        {/* Optional soft overlay */}
        <div className="absolute inset-0 opacity-10">
          <PawTexture />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-4xl font-bold tracking-tight">
            Track Your Appointments
          </h1>

          <p className="mt-4 text-lg text-white/80">
            Monitor your upcoming and past veterinary visits.
          </p>
        </div>
      </PageTitle>

      {/* FLOATING CARD SECTION */}
      <section className="relative z-10 -mt-28 px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/50 bg-white/95 p-6 shadow-2xl shadow-[#1F6559]/10 backdrop-blur md:p-8">
            {/* SEARCH + FILTER */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by pet name or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/70 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition-all hover:bg-gray-50 focus:border-[#1FA7A6]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1FA7A6] border-t-transparent"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex flex-col items-start justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#1FA7A6]/30 hover:shadow-lg hover:shadow-[#1F6559]/5 md:flex-row md:items-center"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1FA7A6]/10 text-[#1FA7A6]">
                        <Calendar className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          {apt.owner_name}
                        </h3>

                        <p className="text-sm font-medium text-gray-500">
                          {apt.pet_name} ({apt.pet_type})
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-0">
                      <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                        <Clock className="h-3.5 w-3.5" />
                        {apt.time_slot}
                      </div>

                      <div
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {getStatusIcon(apt.status)}
                        {apt.status}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden rounded-full text-gray-400 hover:bg-gray-50 hover:text-[#1FA7A6] md:flex"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <Calendar className="h-10 w-10" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {searchQuery || statusFilter !== "all"
                    ? "No matching appointments"
                    : "No appointments found"}
                </h3>

                <p className="mt-2 max-w-sm text-gray-500">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter settings."
                    : "You haven't booked any appointments yet. Start by booking a consultation for your pet."}
                </p>

                {!searchQuery && statusFilter === "all" && (
                  <Button
                    onClick={() => router.push("/appointments")}
                    className="mt-8 rounded-xl bg-[#1F6559] px-8 py-6 font-bold shadow-lg shadow-[#1F6559]/20 hover:bg-[#184F46]"
                  >
                    Book Appointment
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </UserPageShell>
  );
}