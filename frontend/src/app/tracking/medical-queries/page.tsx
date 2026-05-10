"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clock,
  Search,
  ArrowLeft,
  CheckCircle2,
  Timer,
  Phone,
  RefreshCw,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import UserPageShell from "@/motion/UserPageShell";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

interface MedicalEmergency {
  id: string;
  mobile_number: string;
  description: string;
  status: "pending" | "resolved";
  created_at: string;
}

const POLL_INTERVAL = 15_000;

export default function MedicalEmergencyTrackingPage() {
  const router = useRouter();

  const [emergencies, setEmergencies] = useState<MedicalEmergency[]>([]);
  const [filteredEmergencies, setFilteredEmergencies] = useState<
    MedicalEmergency[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEmergencies = useCallback(
    async (silent = false) => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      if (!silent) setRefreshing(true);

      try {
        const response = await api.get("/medical-emergency/me");

        const data: MedicalEmergency[] = response.data || [];

        setEmergencies(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch medical emergencies:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  // Initial fetch + polling
  useEffect(() => {
    fetchEmergencies();

    intervalRef.current = setInterval(
      () => fetchEmergencies(true),
      POLL_INTERVAL
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchEmergencies]);

  // Filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredEmergencies(emergencies);
      return;
    }

    const q = searchQuery.toLowerCase();

    setFilteredEmergencies(
      emergencies.filter(
        (e) =>
          e.mobile_number.includes(q) ||
          e.description.toLowerCase().includes(q) ||
          formatDate(e.created_at).toLowerCase().includes(q)
      )
    );
  }, [searchQuery, emergencies]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";

      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";

      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;

      case "pending":
        return <Timer className="h-4 w-4" />;

      default:
        return null;
    }
  };

  return (
    <UserPageShell
      id="page-tracking-emergencies"
      className="min-h-screen bg-gradient-to-b from-[#1FA7A6]/15 to-[#F8FAFB]"
    >
      {/* HERO SECTION */}
      <PageTitle
        id="emergencies-hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#1F6559] to-[#1FA7A6] pb-40 pt-16 text-white"
      >
        {/* Background Texture */}
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
            Medical Emergency Complaints
          </h1>

          <p className="mt-4 text-lg text-white/80">
            Track your urgent medical complaints and their status.
          </p>
        </div>
      </PageTitle>

      {/* FLOATING CARD */}
      <section className="relative z-10 -mt-28 px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/50 bg-white/95 p-6 shadow-2xl shadow-[#1F6559]/10 backdrop-blur md:p-8">
            {/* Search + refresh */}
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by phone, description, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/70 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#1FA7A6] focus:ring-2 focus:ring-[#1FA7A6]/10"
                />
              </div>

              <button
                type="button"
                onClick={() => fetchEmergencies(false)}
                disabled={refreshing}
                title="Refresh"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition hover:bg-[#1FA7A6]/10 hover:text-[#1FA7A6] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""
                    }`}
                />
              </button>
            </div>

            {/* Last updated */}
            {lastUpdated && (
              <p className="mb-6 text-right text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()} ·
                auto-refreshes every 15s
              </p>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1FA7A6] border-t-transparent" />
              </div>
            ) : filteredEmergencies.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {filteredEmergencies.map((emergency) => (
                    <motion.div
                      key={emergency.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group flex flex-col items-start justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#1FA7A6]/30 hover:shadow-lg hover:shadow-[#1F6559]/5 md:flex-row md:items-center"
                    >
                      {/* LEFT */}
                      <div className="flex flex-1 items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1FA7A6]/10 text-[#1FA7A6]">
                          <AlertTriangle className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />

                            <h3 className="font-bold text-gray-900">
                              {emergency.mobile_number}
                            </h3>
                          </div>

                          <p className="line-clamp-2 text-sm text-gray-600">
                            {emergency.description}
                          </p>

                          <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {formatDate(emergency.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="mt-4 flex items-center gap-3 md:ml-4 md:mt-0">
                        <div
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(
                            emergency.status
                          )}`}
                        >
                          {getStatusIcon(emergency.status)}
                          {emergency.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1FA7A6]/10 text-[#1FA7A6]">
                  <AlertTriangle className="h-10 w-10" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  No medical complaints
                </h3>

                <p className="mt-2 max-w-sm text-gray-500">
                  {searchQuery
                    ? "No complaints match your search."
                    : "You haven't raised any medical emergency complaints yet."}
                </p>

                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/gopu")}
                    className="mt-8 rounded-xl bg-[#1F6559] px-8 py-6 font-bold text-white shadow-lg shadow-[#1F6559]/20 hover:bg-[#184F46]"
                  >
                    Raise a Complaint
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