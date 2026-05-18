"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";

interface VetRecord {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  availability: string;
  consultation_fee: string;
  languages: string;
}

export default function VetsPage() {
  const [vets, setVets] = useState<VetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Always use relative paths — Next.js rewrites proxy /api to the backend
  const API_URL = "";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/admin/vets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch vets");
        return res.json();
      })
      .then((data) => setVets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_URL]);

  const columns = [
    { key: "name" as const, label: "Veterinarian Name" },
    { key: "specialty" as const, label: "Specialty" },
    { key: "experience" as const, label: "Experience" },
    { key: "availability" as const, label: "Availability" },
  ];

  return (
    <>
      <main className="space-y-6 animate-in fade-in duration-500">
        <PageHeader 
          title="Veterinary Staff" 
          description="Manage the active roster of veterinary doctors and specialists."
          actionButtonLabel="+ Add Vet Profile"
          onAction={() => setShowAddModal(true)}
        />
        
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <p className="px-6 py-8 text-center text-slate-500">Loading veterinary staff…</p>
          ) : error ? (
            <p className="px-6 py-8 text-center text-red-500">{error}</p>
          ) : (
            <Table columns={columns} data={vets} />
          )}
        </div>
      </main>

      {showAddModal && (
        <AddVetModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newVet) => setVets((prev) => [newVet, ...prev])}
          apiUrl={API_URL}
        />
      )}
    </>
  );
}

function AddVetModal({
  onClose,
  onAdded,
  apiUrl,
}: {
  onClose: () => void;
  onAdded: (vet: VetRecord) => void;
  apiUrl: string;
}) {
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    experience: "",
    availability: "Available",
    consultation_fee: "",
    languages: "English",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${apiUrl}/api/admin/vets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create vet profile");
      
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Add Vet Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Specialty</label>
              <input
                required
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Experience</label>
              <input
                required
                type="text"
                placeholder="e.g. 5 Years"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Fee</label>
              <input
                required
                type="text"
                placeholder="e.g. $50"
                value={form.consultation_fee}
                onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Languages</label>
              <input
                required
                type="text"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Availability</label>
            <select
              required
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559] bg-white"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-3 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#1F6559] py-3 font-bold text-white hover:bg-[#154d43] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}