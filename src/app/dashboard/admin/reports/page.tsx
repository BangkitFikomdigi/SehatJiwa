"use client";

import { Card } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Reports & Analytics</h1>
        <p className="text-ink-muted">Coming soon...</p>
      </div>

      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-semibold text-ink mb-2">Reports dalam pengembangan</h2>
        <p className="text-ink-muted">Fitur advanced analytics akan segera tersedia</p>
      </Card>
    </div>
  );
}
