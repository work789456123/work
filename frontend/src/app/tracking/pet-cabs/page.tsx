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
  Car,
  MapPin,
  CheckCircle,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import UserPageShell from "@/motion/UserPageShell";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

interface PetCabBooking {
  id: string;
  pet_type: string;
  owner_name: string;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  status: "Pending" | "Accepted" | "On the Way" | "Completed" | "Cancelled";
  driver_details: string | null;
}

export default function PetCabTrackingPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<PetCabBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<PetCabBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await api.get("/pet-cabs");
        const mappedData = response.data;
        setBookings(mappedData);
        setFilteredBookings(mappedData);
      } catch (error) {
        console.error("Failed to fetch pet cab bookings:", error);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  useEffect(() => {
    let result = bookings;

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (b) =>
          b.pickup_location.toLowerCase().includes(query) ||
          b.drop_location.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(result);
  }, [searchQuery, statusFilter, bookings]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "on the way":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "completed":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "on the way":
        return <Car className="h-4 w-4" />;
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

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 25;
      case "accepted":
        return 50;
      case "on the way":
        return 75;
      case "completed":
        return 100;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const steps = [
    { label: "Booked", value: "Pending" },
    { label: "Accepted", value: "Accepted" },
    { label: "On the Way", value: "On the Way" },
    { label: "Dropped", value: "Completed" },
  ];

  return (
    <UserPageShell
      id="page-tracking-pet-cabs"
      className="min-h-screen bg-gradient-to-b from-[#1FA7A6]/15 to-[#F8FAFB]"
    >
      {/* HERO SECTION */}
      <PageTitle
        id="tracking-hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#1F6559] to-[#1FA7A6] pb-40 pt-16 text-white"
      >
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
            Pet Cab Tracking
          </h1>

          <p className="mt-4 text-lg text-white/80">
            Monitor your scheduled pet cab bookings.
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
                  placeholder="Search by location or Booking ID..."
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
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="On the Way">On the Way</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1FA7A6] border-t-transparent"></div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                    className={`group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#1FA7A6]/30 hover:shadow-lg hover:shadow-[#1F6559]/5 cursor-pointer ${
                      expandedId === b.id ? "ring-2 ring-[#1FA7A6]/20 border-[#1FA7A6]/40" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                      {/* LEFT */}
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1FA7A6]/10 text-[#1FA7A6]">
                          <Car className="h-6 w-6" />
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {b.id}
                          </h3>

                          <p className="text-sm font-medium text-gray-500">
                            {b.pickup_location} → {b.drop_location}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-0">
                        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                          <Clock className="h-3.5 w-3.5" />
                          {b.pickup_date} {b.pickup_time}
                        </div>

                        <div
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(
                            b.status
                          )}`}
                        >
                          {getStatusIcon(b.status)}
                          {b.status}
                        </div>
                        
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedId === b.id ? "rotate-90" : ""}`} />
                      </div>
                    </div>

                    {/* EXPANDED SECTION */}
                    {expandedId === b.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 border-t border-gray-100 pt-6 w-full"
                      >
                        {b.status === "Cancelled" ? (
                           <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-red-800">Booking Cancelled</h4>
                                <p className="text-sm text-red-600 mt-1">This booking was cancelled. If you need a ride, please book a new pet cab.</p>
                              </div>
                           </div>
                        ) : (
                          <>
                            {/* PROGRESS BAR */}
                            <div className="mb-8 relative">
                               <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                                  <div style={{ width: `${getProgressPercentage(b.status)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] transition-all duration-1000 ease-out"></div>
                               </div>
                               <div className="flex justify-between w-full px-2">
                                 {steps.map((step, idx) => {
                                    const isCompleted = getProgressPercentage(b.status) >= ((idx + 1) * 25);
                                    const isCurrent = b.status.toLowerCase() === step.value.toLowerCase() || (step.value === "Pending" && b.status.toLowerCase() === "pending");
                                    return (
                                      <div key={idx} className={`flex flex-col items-center text-center ${isCompleted ? "text-[#1FA7A6]" : "text-gray-400"}`}>
                                         <div className={`h-6 w-6 rounded-full flex items-center justify-center mb-1.5 border-2 bg-white z-10 -mt-8 transition-colors duration-500 ${isCompleted ? "border-[#1FA7A6]" : "border-gray-200"}`}>
                                           {isCompleted && <CheckCircle className="h-4 w-4" />}
                                         </div>
                                         <span className={`text-xs font-bold ${isCurrent ? "text-gray-900" : ""}`}>{step.label}</span>
                                      </div>
                                    )
                                 })}
                               </div>
                            </div>
                            
                            {/* DRIVER DETAILS */}
                            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                               <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4 text-[#1FA7A6]" />
                                  Driver & Cab Details
                               </h4>
                               {b.driver_details ? (
                                 <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                   {b.driver_details}
                                 </p>
                               ) : (
                                 <p className="text-sm text-slate-500 italic">
                                   Driver details will be updated here once your booking is accepted.
                                 </p>
                               )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <Car className="h-10 w-10" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {searchQuery || statusFilter !== "all"
                    ? "No matching bookings"
                    : "No bookings found"}
                </h3>

                <p className="mt-2 max-w-sm text-gray-500">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter settings."
                    : "You haven't booked any pet cabs yet. Start by booking a cab for your pet."}
                </p>

                {!searchQuery && statusFilter === "all" && (
                  <Button
                    onClick={() => router.push("/travel-with-pet")}
                    className="mt-8 rounded-xl bg-[#1F6559] px-8 py-6 font-bold shadow-lg shadow-[#1F6559]/20 hover:bg-[#184F46]"
                  >
                    Book Pet Cab
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
