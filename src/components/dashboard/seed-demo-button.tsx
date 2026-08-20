"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SeedDemoButton({
  variant = "seed" as "seed" | "reset",
  onSuccess,
}: {
  variant?: "seed" | "reset";
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Gagal mengisi data contoh.");
      return;
    }
    toast.success("Data contoh berhasil ditambahkan! 🌱");
    router.refresh();
    onSuccess?.();
  }

  async function handleReset() {
    setLoading(true);
    const res = await fetch("/api/seed", { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error("Gagal menghapus data.");
      return;
    }
    toast.success("Data pribadi berhasil dihapus.");
    router.refresh();
    onSuccess?.();
  }

  if (variant === "reset") {
    return (
      <Button variant="ghost" size="sm" onClick={handleReset} disabled={loading}>
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        {loading ? "Menghapus..." : "Reset Data"}
      </Button>
    );
  }

  return (
    <Button variant="soft" size="sm" onClick={handleSeed} disabled={loading}>
      <Sparkles className="mr-1 h-3.5 w-3.5" />
      {loading ? "Mengisi..." : "Isi dengan Data Contoh"}
    </Button>
  );
}
