"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Activity } from "lucide-react";

type Stats = {
  totalUsers: number;
  totalEntries: number;
  totalScreening: number;
  totalMessages: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Gagal fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!stats) return <div className="text-center py-10">Gagal load data</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Admin Dashboard</h1>
        <p className="text-ink-muted">Kelola data dan pengguna SehatJiwa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-muted">Total Users</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalUsers}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-muted">Mood Entries</span>
            <Activity className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalEntries}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-muted">Screening Tests</span>
            <FileText className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalScreening}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-muted">AI Messages</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-ink">{stats.totalMessages}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-ink mb-4">Menu Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="/dashboard/admin/users"
            className="block rounded-lg border border-primary/20 bg-primary-bg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <Users className="h-5 w-5 text-primary mb-2" />
            <p className="font-semibold text-ink">Kelola Users</p>
            <p className="text-xs text-ink-muted">Lihat & kelola pengguna</p>
          </a>

          <a
            href="/dashboard/admin/entries"
            className="block rounded-lg border border-primary/20 bg-primary-bg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <Activity className="h-5 w-5 text-secondary mb-2" />
            <p className="font-semibold text-ink">Mood Entries</p>
            <p className="text-xs text-ink-muted">Lihat semua catatan mood</p>
          </a>

          <a
            href="/dashboard/admin/reports"
            className="block rounded-lg border border-primary/20 bg-primary-bg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-amber-500 mb-2" />
            <p className="font-semibold text-ink">Reports</p>
            <p className="text-xs text-ink-muted">Analytics & insights</p>
          </a>

          <a
            href="/dashboard"
            className="block rounded-lg border border-primary/20 bg-primary-bg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <FileText className="h-5 w-5 text-emerald-500 mb-2" />
            <p className="font-semibold text-ink">Kembali</p>
            <p className="text-xs text-ink-muted">Dashboard user</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
