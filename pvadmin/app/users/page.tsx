"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";

interface UserRecord {
  full_name: string;
  phone_or_email: string;
  role: string;
  has_subscription: boolean;
  credits_remaining: number;
  is_verified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [API_URL]);

  const tableColumns = [
    { key: "full_name" as const, label: "Full Name" },
    { key: "phone_or_email" as const, label: "Email / Phone" },
    { key: "role" as const, label: "Role" },
    { key: "credits_remaining" as const, label: "Credits" },
    { key: "has_subscription" as const, label: "Subscribed" },
    { key: "is_verified" as const, label: "Verified" },
  ];

  // Normalise booleans to readable strings for the table
  const tableData = users.map((u) => ({
    ...u,
    has_subscription: u.has_subscription ? "Yes" : "No",
    is_verified: u.is_verified ? "Yes" : "No",
  }));

  return (
    <>
      <main className="space-y-6 animate-in fade-in duration-700">
        <PageHeader
          title="Users Directory"
          description="All registered users on the platform."
          actionButtonLabel="+ Add New User"
          onAction={() => setShowAddModal(true)}
        />

        <section className="rounded-xl bg-white shadow-sm border border-slate-100">
          {loading ? (
            <p className="px-6 py-8 text-center text-slate-500">Loading users…</p>
          ) : error ? (
            <p className="px-6 py-8 text-center text-red-500">{error}</p>
          ) : (
            <Table columns={tableColumns} data={tableData} />
          )}
        </section>
      </main>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newUser) => setUsers((prev) => [newUser, ...prev].sort((a, b) => a.full_name.localeCompare(b.full_name)))}
          apiUrl={API_URL}
        />
      )}
    </>
  );
}

function AddUserModal({
  onClose,
  onAdded,
  apiUrl,
}: {
  onClose: () => void;
  onAdded: (user: UserRecord) => void;
  apiUrl: string;
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const payload: Record<string, string> = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      };
      if (form.phone.trim()) payload.phone = form.phone.trim();

      const res = await fetch(`${apiUrl}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create user");
      
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
        <h2 className="mb-4 text-xl font-bold text-slate-800">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              required
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
            <input
              required
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Phone <span className="text-slate-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, phone: val });
              }}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#1F6559]"
            />
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
              {loading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
