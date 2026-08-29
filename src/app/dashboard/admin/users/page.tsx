"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Calendar } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Gagal fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Manage Users</h1>
        <p className="text-ink-muted">Total: {users.length} pengguna</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-bg border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-ink">Nama</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-ink-muted">
                    Tidak ada pengguna
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-primary-bg/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink">{u.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2 text-ink-muted">
                      <Mail className="h-4 w-4" />
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-ink-muted flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(u.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
