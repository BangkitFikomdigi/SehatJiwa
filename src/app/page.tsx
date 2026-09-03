"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Langsung redirect ke dashboard
    window.location.href = "/dashboard";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-ink-muted">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
