"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, ShieldCheck, Loader2, X } from "lucide-react";

interface AdminUser {
  id: string;
  full_name: string;
  phone_or_email: string;
  role: string;
  is_verified: boolean;
}

interface FormData {
  full_name: string;
  email: string;
  password: string;
}

// Always use relative paths — Next.js rewrites proxy /api to the backend
const API_URL = "";

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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.detail === "string" ? err.detail : "Request failed");
  }
  if (res.status === 204) return null as T;
  return res.json();
}

// ─── Add User Modal ───────────────────────────────────────────────────────────

function AddUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
}) {
  const [form, setForm] = useState<FormData>({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiFetch<AdminUser>("/api/admin/admin-users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onCreated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#1F6559]" />
            <h2 className="text-lg font-bold text-slate-800">Add Admin User</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#1F6559] focus:ring-2 focus:ring-[#1F6559]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#1F6559] focus:ring-2 focus:ring-[#1F6559]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#1F6559] focus:ring-2 focus:ring-[#1F6559]/20"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F6559] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#154d43] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? "Creating…" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  user,
  onClose,
  onDeleted,
}: {
  user: AdminUser;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/api/admin/admin-users/${user.id}`, { method: "DELETE" });
      onDeleted(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Remove Admin Access</h2>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{user.full_name}</span> will lose admin
            access and be downgraded to a regular user.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Removing…" : "Remove Access"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reset Password Modal ─────────────────────────────────────────────────────

function ResetPasswordModal({
  user,
  onClose,
  onReset,
}: {
  user: AdminUser;
  onClose: () => void;
  onReset: (userId: string) => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/api/admin/admin-users/${user.id}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({ new_password: newPassword }),
      });
      onReset(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F6559]/10">
            <ShieldCheck size={24} className="text-[#1F6559]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Set a new password for <span className="font-semibold text-slate-700">{user.full_name}</span>.
          </p>

          <form onSubmit={handleReset} className="mt-4 space-y-4 text-left">
            <div>
              <input
                type="password"
                placeholder="New Password (min 8 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#1F6559] focus:ring-2 focus:ring-[#1F6559]/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F6559] py-3 text-sm font-bold text-white transition-all hover:bg-[#154d43] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? "Resetting…" : "Reset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = useState<{ user: AdminUser } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const adminRole = localStorage.getItem("admin_role");
    setRole(adminRole);

    apiFetch<AdminUser[]>("/api/admin/admin-users")
      .then((usersData) => {
        setUsers(usersData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (user: AdminUser) => {
    setUsers((prev) => [...prev, user].sort((a, b) => a.full_name.localeCompare(b.full_name)));
    setShowAdd(false);
  };

  const handleDeleted = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  };

  const handleResetComplete = (userId: string) => {
    setResetTarget(null);
  };

  return (
    <>
      <main className="space-y-6 animate-in fade-in duration-700">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Access</h1>
            <p className="mt-1 text-slate-500">
              Manage who has access to the pvadmin panel.
            </p>
          </div>
          {role === "superadmin" && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 rounded-xl bg-[#1F6559] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#154d43] active:scale-95"
            >
              <UserPlus size={16} />
              Add Admin User
            </button>
          )}
        </header>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Admin users have full access to this panel. Removing access downgrades them to a regular
            user — it does not delete their account.
          </p>
        </div>

        {/* Table */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_200px] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Name</span>
            <span>Email</span>
            <span className="text-right">Action</span>
          </div>

          {/* States */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading admin users…</span>
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="py-16 text-center text-sm text-slate-400">
              No admin users found. Add one to get started.
            </div>
          )}

          {/* Rows */}
          {!loading &&
            !error &&
            users.map((user, i) => {
              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-[2fr_2fr_200px] items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 ${i !== users.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F6559]/10 text-sm font-bold text-[#1F6559]">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {user.full_name}
                    </span>
                  </div>

                  {/* Email */}
                  <span className="truncate text-sm text-slate-500">{user.phone_or_email}</span>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    {role === "superadmin" ? (
                      <>
                        <button
                          onClick={() => setResetTarget({ user })}
                          title="Reset Password"
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
                        >
                          Reset PW
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          title="Remove admin access"
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 active:scale-95"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              )
            })}
        </section>
      </main>

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
      {resetTarget && (
        <ResetPasswordModal
          user={resetTarget.user}
          onClose={() => setResetTarget(null)}
          onReset={handleResetComplete}
        />
      )}
    </>
  );
}
