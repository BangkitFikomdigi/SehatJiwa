"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Entry = {
  id: string;
  user_id: string;
  mood_score: number;
  stress_score: number;
  sleep_score: number;
  note: string | null;
  created_at: string;
};

export default function AdminEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/admin/entries");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Gagal fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">All Mood Entries</h1>
        <p className="text-ink-muted">Total: {entries.length} entries</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-bg border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-ink">Mood</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Stress</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Sleep</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Note</th>
                <th className="px-6 py-3 text-left font-semibold text-ink">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-ink-muted">
                    Tidak ada entries
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="hover:bg-primary-bg/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {e.mood_score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary font-semibold text-xs">
                        {e.stress_score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold text-xs">
                        {e.sleep_score}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-ink-muted">{e.note || "-"}</td>
                    <td className="px-6 py-4 text-ink-muted text-xs">
                      {new Date(e.created_at).toLocaleDateString("id-ID")}
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
