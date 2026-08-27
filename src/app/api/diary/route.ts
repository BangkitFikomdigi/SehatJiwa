"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { BookHeart } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
import { InteractiveAquarium } from "../interactive-aquarium";

type Entry = {
  id: string;
  mood_score: number;
  stress_score: number;
  sleep_score: number;
  note: string | null;
  created_at: string;
};

function SliderField({
  label,
  emoji,
  value,
  onChange,
}: {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="mb-0">{emoji} {label}</Label>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(6);
  const [note, setNote] = useState("");

  // Ekspresi akuarium mengikuti nilai slider Mood secara langsung (live preview)
  const previewExpression: "senang" | "netral" | "sedih" =
    mood >= 7 ? "senang" : mood <= 4 ? "sedih" : "netral";

  async function loadEntries() {
    setLoading(true);
    const res = await fetch("/api/diary");
    const data = await res.json();
    if (res.ok) setEntries(data.entries ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood_score: mood,
        stress_score: stress,
        sleep_score: sleep,
        note,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast.success("Diary hari ini berhasil disimpan! 🌱");
    setNote("");
    loadEntries();
  }

  const chartData = [...entries]
    .reverse()
    .map((e) => ({
      date: new Date(e.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      Mood: e.mood_score,
      Stres: e.stress_score,
      Tidur: e.sleep_score,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <BookHeart className="h-6 w-6 text-primary" /> Diary Mood
        </h1>
        <p className="text-sm text-ink-muted">Catat perasaanmu hari ini, lacak perkembangannya dari waktu ke waktu.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* AKUARIUM — ekspresinya ikut berubah saat slider Mood digeser */}
          <Card className="flex flex-col items-center gap-2 border-none bg-white/50 p-6 text-center shadow-sm backdrop-blur-sm">
            <InteractiveAquarium totalMoods={entries.length} lastMoodExpression={previewExpression} />
            <p className="text-xs text-ink-muted">Akuariummu ikut berekspresi sesuai mood yang kamu pilih ✨</p>
          </Card>

          {/* INPUT MOOD */}
          <Card className="space-y-4">
            <h3 className="font-bold">😊 Input Mood</h3>
            <SliderField label="Mood" emoji="😊" value={mood} onChange={setMood} />
            <SliderField label="Stres" emoji="🧠" value={stress} onChange={setStress} />
            <SliderField label="Kualitas Tidur" emoji="😴" value={sleep} onChange={setSleep} />
          </Card>

          {/* INPUT JURNAL */}
          <Card className="space-y-4">
            <h3 className="font-bold">📝 Input Jurnal</h3>
            <div>
              <Label htmlFor="note">Ceritakan harimu (opsional)</Label>
              <Textarea
                id="note"
                placeholder="Ceritakan hal yang terjadi hari ini..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full justify-center">
              {saving ? "Menyimpan..." : "💾 Simpan Mood & Jurnal"}
            </Button>
          </Card>
        </motion.div>

        <Card>
          <h3 className="mb-4 font-bold">📊 Tren 30 Hari Terakhir</h3>
          {loading ? (
            <p className="text-sm text-ink-muted">Memuat data...</p>
          ) : entries.length === 0 ? (
            <div className="space-y-3 text-center">
              <p className="text-sm text-ink-muted">
                Belum ada data. Yuk isi diary pertamamu di samping! 🌱
              </p>
              <SeedDemoButton variant="seed" onSuccess={loadEntries} />
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="date" fontSize={12} stroke="#64748b" />
                  <YAxis domain={[0, 10]} fontSize={12} stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="Mood" stroke="#4a90e2" strokeWidth={2} />
                  <Line type="monotone" dataKey="Stres" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="Tidur" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {entries.slice(0, 5).map((e) => (
              <div key={e.id} className="rounded-lg bg-primary-bg px-4 py-2 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <span>{new Date(e.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
                  <span>😊 {e.mood_score} · 🧠 {e.stress_score} · 😴 {e.sleep_score}</span>
                </div>
                {e.note && <p className="mt-1 text-ink">{e.note}</p>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}