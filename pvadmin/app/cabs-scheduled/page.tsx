"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, Car, MapPin, User, Search, Edit } from "lucide-react";

interface PetCabBooking {
  id: string;
  user_id: string;
  owner_name: string;
  owner_number: string;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  pet_type: string;
  pet_breed: string | null;
  number_of_pets: number;
  cab_preference: string | null;
  emergency_contact: string;
  additional_notes: string | null;
  status: string;
  driver_details: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  Pending: {
    label: "Pending",
    icon: <Clock size={12} />,
    classes: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Accepted: {
    label: "Accepted",
    icon: <CheckCircle2 size={12} />,
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "On the Way": {
    label: "On the Way",
    icon: <Car size={12} />,
    classes: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Completed: {
    label: "Completed",
    icon: <CheckCircle2 size={12} />,
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  Cancelled: {
    label: "Cancelled",
    icon: <XCircle size={12} />,
    classes: "bg-red-50 text-red-600 border-red-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export default function CabsScheduledPage() {
  const [bookings, setBookings] = useState<PetCabBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<PetCabBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<PetCabBooking | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDriver, setEditDriver] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    setError("");
    apiFetch<PetCabBooking[]>("/api/pet-cabs/admin")
      .then((data) => {
        setBookings(data);
        setFilteredBookings(data);
      })
      .catch(() => setError("Failed to load pet cab bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter);
    }
    if (dateFilter) {
      result = result.filter(b => b.pickup_date === dateFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.owner_name.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) ||
        b.pickup_location.toLowerCase().includes(q) ||
        b.drop_location.toLowerCase().includes(q)
      );
    }
    setFilteredBookings(result);
  }, [searchQuery, statusFilter, dateFilter, bookings]);

  const handleUpdate = async () => {
    if (!selectedBooking) return;
    setUpdating(selectedBooking.id);
    try {
      const updated = await apiFetch<PetCabBooking>(`/api/pet-cabs/admin/${selectedBooking.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: editStatus,
          driver_details: editDriver
        })
      });
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      setSelectedBooking(null);
    } catch {
      alert("Failed to update booking.");
    } finally {
      setUpdating(null);
    }
  };

  const openEditDialog = (booking: PetCabBooking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditDriver(booking.driver_details || "");
  };

  return (
    <main className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pet Cabs Scheduled</h1>
          <p className="mt-1 text-slate-500">
            Manage pet cab bookings and assign drivers.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, User, or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none transition-all focus:border-teal-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none transition-all focus:border-teal-500"
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

      {/* Table */}
      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr_100px] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div>Booking ID</div>
          <div>User & Pet</div>
          <div>Location</div>
          <div>Date/Time</div>
          <div>Driver</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading bookings…</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-20 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && filteredBookings.length === 0 && (
          <div className="py-20 text-center text-sm text-slate-400">
            No pet cab bookings found.
          </div>
        )}

        {!loading &&
          !error &&
          filteredBookings.map((b, i) => (
            <div
              key={b.id}
              className={`grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_1fr_100px] items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50 ${
                i !== filteredBookings.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{b.id}</p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{b.owner_name}</p>
                <p className="truncate text-xs text-slate-500">{b.number_of_pets}x {b.pet_type} ({b.pet_breed || "N/A"})</p>
                <p className="truncate text-xs text-slate-400">{b.owner_number}</p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-600">From: <span className="font-normal">{b.pickup_location}</span></p>
                <p className="truncate text-xs font-semibold text-slate-600">To: <span className="font-normal">{b.drop_location}</span></p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">{b.pickup_date}</p>
                <p className="truncate text-xs text-slate-400">{b.pickup_time}</p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs text-slate-600">{b.driver_details || "Not Assigned"}</p>
              </div>

              <StatusBadge status={b.status} />

              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  onClick={() => openEditDialog(b)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-100 active:scale-95"
                >
                  <Edit size={12} />
                  Edit
                </button>
              </div>
            </div>
          ))}
      </section>

      {/* Edit Dialog */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBooking(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                Update Booking {selectedBooking.id}
              </h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="On the Way">On the Way</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Driver & Cab Details</label>
                <textarea
                  value={editDriver}
                  onChange={(e) => setEditDriver(e.target.value)}
                  placeholder="e.g. John Doe, Toyota Innova (MH01AB1234), Ph: 9876543210"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating === selectedBooking.id}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 transition"
              >
                {updating === selectedBooking.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
