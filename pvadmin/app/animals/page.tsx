"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";

interface PetRecord {
  id: string;
  name: string;
  pet_type: string;
  age: string | null;
  gender: string | null;
  weight: string | null;
  owner_name: string;
  owner_contact: string;
}

interface UserRecord {
  id: string;
  full_name: string;
  phone_or_email: string;
}

export default function AnimalsPage() {
  const [pets, setPets] = useState<PetRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
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

    Promise.all([
      fetch(`${API_URL}/api/admin/pets`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([petsData, usersData]) => {
        if (petsData.detail || usersData.detail) throw new Error(petsData.detail || usersData.detail);
        setPets(petsData);
        setUsers(usersData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_URL]);

  const tableColumns = [
    { key: "name" as const, label: "Animal Name" },
    { key: "pet_type" as const, label: "Type" },
    { key: "age" as const, label: "Age" },
    { key: "gender" as const, label: "Gender" },
    { key: "weight" as const, label: "Weight" },
    { key: "owner_name" as const, label: "Owner Name" },
    { key: "owner_contact" as const, label: "Owner Contact" },
  ];

  // Replace nulls with a dash for display
  const tableData = pets.map((p) => ({
    ...p,
    age: p.age ?? "—",
    gender: p.gender ?? "—",
    weight: p.weight ?? "—",
  }));

  return (
    <>
      <main className="space-y-6 animate-in fade-in duration-500">
        <PageHeader
          title="Animal Records"
          description="Comprehensive directory of registered animals and their owner profiles."
          actionButtonLabel="+ Add Animal Record"
          onAction={() => setShowAddModal(true)}
        />

        {loading ? (
          <p className="px-6 py-8 text-center text-slate-500">Loading animal records…</p>
        ) : error ? (
          <p className="px-6 py-8 text-center text-red-500">{error}</p>
        ) : (
          <Table columns={tableColumns} data={tableData} />
        )}
      </main>

      {showAddModal && (
        <AddAnimalModal
          users={users}
          onClose={() => setShowAddModal(false)}
          onAdded={(newPet) => setPets((prev) => [newPet, ...prev])}
          apiUrl={API_URL}
        />
      )}
    </>
  );
}

function AddAnimalModal({
  users,
  onClose,
  onAdded,
  apiUrl,
}: {
  users: UserRecord[];
  onClose: () => void;
  onAdded: (pet: PetRecord) => void;
  apiUrl: string;
}) {
  const [form, setForm] = useState({
    name: "",
    pet_type: "Cow",
    age: "",
    gender: "Female",
    weight: "",
    user_id: users.length > 0 ? users[0].id : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_id) {
      setError("Please select an owner.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${apiUrl}/api/admin/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create animal");
      
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
        <h2 className="mb-4 text-xl font-bold text-slate-800">Add New Animal</h2>
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
              <label className="mb-1 block text-sm font-semibold text-slate-700">Type</label>
              <input
                required
                type="text"
                value={form.pet_type}
                onChange={(e) => setForm({ ...form, pet_type: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559] bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Age</label>
              <input
                type="text"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Weight</label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Owner</label>
            <select
              required
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559] bg-white"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.phone_or_email})
                </option>
              ))}
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
              {loading ? "Saving..." : "Save Animal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
