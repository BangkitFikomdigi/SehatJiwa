"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Fish } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Mood categories
// mood_score keeps using the existing 0-10 numeric column so the backend/
// schema for /api/diary does not need to change. Each category maps to a
// representative score; scoreToMood() reverses that mapping for entries
// that already exist in the database.
// ---------------------------------------------------------------------------
const MOODS = [
  { key: "sangat_bahagia", label: "Sangat Bahagia", emoji: "😄", score: 9, color: "#F59E0B", soft: "#FEF3C7", ring: "#FCD34D" },
  { key: "bahagia", label: "Bahagia", emoji: "🙂", score: 7, color: "#10B981", soft: "#D1FAE5", ring: "#6EE7B7" },
  { key: "netral", label: "Netral", emoji: "😐", score: 5, color: "#64748B", soft: "#F1F5F9", ring: "#CBD5E1" },
  { key: "sedih", label: "Sedih", emoji: "🙁", score: 3, color: "#3B82F6", soft: "#DBEAFE", ring: "#93C5FD" },
  { key: "sangat_sedih", label: "Sangat Sedih", emoji: "😢", score: 1, color: "#7C3AED", soft: "#EDE9FE", ring: "#C4B5FD" },
] as const;

type MoodKey = (typeof MOODS)[number]["key"];

function scoreToMood(score: number) {
  return MOODS.reduce((closest, m) =>
    Math.abs(m.score - score) < Math.abs(closest.score - score) ? m : closest
  );
}

type Entry = {
  id: string;
  mood_score: number;
  note: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Aquarium visual — fills based on the % of the last 30 days that have an
// entry, so it reads as a consistency tracker rather than a raw counter.
// ---------------------------------------------------------------------------
function MoodAquarium({ fillPercent, hasFish }: { fillPercent: number; hasFish: boolean }) {
  const topY = 92;
  const bottomY = 262;
  const headroom = 14;
  const usable = bottomY - topY - headroom;
  const waterY = bottomY - (fillPercent / 100) * usable;
  const waterHeight = bottomY - waterY;

  return (
    <div className="relative mx-auto" style={{ width: 200, height: 270 }}>
      <svg viewBox="0 0 260 300" width="200" height="270">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="55%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.35" />
          </linearGradient>
          <clipPath id="bowlClip">
            <circle cx="130" cy="177" r="90" />
          </clipPath>
        </defs>

        <circle cx="130" cy="177" r="98" fill="url(#glassGrad)" stroke="#BAE6FD" strokeWidth="3" />

        <g clipPath="url(#bowlClip)">
          <ellipse cx="90" cy="258" rx="14" ry="7" fill="#D6D3D1" />
          <ellipse cx="115" cy="263" rx="16" ry="8" fill="#E7E5E4" />
          <ellipse cx="145" cy="261" rx="15" ry="7" fill="#CBD5C0" />
          <ellipse cx="172" cy="257" rx="13" ry="6" fill="#D6D3D1" />

          <path d="M100,262 C96,235 108,215 100,190" fill="none" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <path d="M108,262 C114,238 104,220 112,198" fill="none" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />

          <rect
            x="32"
            y={waterY}
            width="196"
            height={waterHeight}
            fill="url(#waterGrad)"
            style={{ transition: "y 1s ease-out, height 1s ease-out" }}
          />

          {fillPercent > 0 && (
            <>
              <circle cx="150" cy="240" r="2.5" fill="#F0F9FF" opacity="0.8" className="aq-bubble-a" />
              <circle cx="165" cy="245" r="1.8" fill="#F0F9FF" opacity="0.7" className="aq-bubble-b" />
            </>
          )}

          {hasFish && (
            <g className="aq-fish" style={{ transformOrigin: "130px 180px" }}>
              <g transform="translate(0,180)">
                <ellipse cx="0" cy="0" rx="13" ry="8" fill="#FB923C" />
                <path d="M-12,0 L-20,-6 L-20,6 Z" fill="#EA580C" />
                <circle cx="6" cy="-2" r="1.6" fill="#1C1917" />
              </g>
            </g>
          )}
        </g>

        <ellipse cx="130" cy="80" rx="90" ry="15" fill="#E0F2FE" opacity="0.55" />
        <ellipse cx="130" cy="80" rx="90" ry="15" fill="none" stroke="#7DD3FC" strokeWidth="4" opacity="0.9" />
        <path d="M64,120 Q58,178 72,232" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.35" fill="none" />
      </svg>

      <style>{`
        @keyframes aqBubbleRise { 0% { transform: translateY(0); opacity: .9; } 100% { transform: translateY(-140px); opacity: 0; } }
        .aq-bubble-a { animation: aqBubbleRise 3.2s ease-in infinite; }
        .aq-bubble-b { animation: aqBubbleRise 2.6s ease-in infinite .8s; }
        @keyframes aqSwim {
          0% { transform: translateX(-38px) scaleX(1); }
          48% { transform: translateX(38px) scaleX(1); }
          50% { transform: translateX(38px) scaleX(-1); }
          98% { transform: translateX(-38px) scaleX(-1); }
          100% { transform: translateX(-38px) scaleX(1); }
        }
        .aq-fish { animation: aqSwim 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function MoodButton({ mood, selected, onClick }: { mood: (typeof MOODS)[number]; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-medium transition-colors"
      style={{
        borderColor: selected ? mood.color : "#E2E8F0",
        background: selected ? mood.soft : "white",
        color: selected ? mood.color : "#475569",
      }}
    >
      <span className="text-lg leading-none">{mood.emoji}</span>
      {mood.label}
    </button>
  );
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<MoodKey | null>(null);
  const [note, setNote] = useState("");

  async function loadEntries() {
  setLoading(true);
  try {
    const res = await fetch("/api/diary");
    const data = await res.json();
    if (res.ok) {
      setEntries(data.entries ?? []);
    } else {
      toast.error(data.error ?? "Gagal memuat data diary");
    }
  } catch (err) {
    toast.error("Gagal terhubung ke server");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadEntries();
  }, []);

  const counts = useMemo(
    () =>
      MOODS.reduce<Record<string, number>>((acc, m) => {
        acc[m.key] = entries.filter((e) => scoreToMood(e.mood_score).key === m.key).length;
        return acc;
      }, {}),
    [entries]
  );

  const fillPercent = useMemo(() => {
    const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const daysWithEntry = new Set(
      entries.filter((e) => new Date(e.created_at).getTime() >= since).map((e) => new Date(e.created_at).toDateString())
    ).size;
    return Math.min(100, Math.round((daysWithEntry / 30) * 100));
  }, [entries]);

  async function handleSave() {
    if (!selected) {
      toast.error("Pilih dulu perasaanmu hari ini ya 🙂");
      return;
    }
    setSaving(true);
    const mood = MOODS.find((m) => m.key === selected)!;
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood_score: mood.score,
        note,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast.success("Tersimpan — air di akuariummu bertambah 💧");
    setNote("");
    setSelected(null);
    loadEntries();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <Fish className="h-6 w-6 text-primary" /> Diary Mood
        </h1>
        <p className="text-sm text-ink-muted">Setiap kali kamu mencatat perasaan, akuariummu terisi sedikit lebih penuh.</p>
      </div>

      <Card className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <span
              key={m.key}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: m.ring, background: m.soft, color: m.color }}
            >
              {m.emoji} {m.label} <b>{counts[m.key] ?? 0}x</b>
            </span>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <MoodAquarium fillPercent={fillPercent} hasFish={entries.length > 0} />
            <span className="rounded-full border border-primary-bg bg-primary-bg px-3 py-1 text-xs text-ink-muted">
              {loading ? "Memuat..." : `${entries.length} catatan mood tersimpan`}
            </span>
          </motion.div>

          <div>
            <Label className="mb-3 block">Bagaimana perasaanmu sekarang?</Label>
            <div className="mb-2 grid grid-cols-3 gap-2">
              {MOODS.slice(0, 3).map((m) => (
                <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
              ))}
            </div>
            <div className="mb-5 grid max-w-[260px] grid-cols-2 gap-2">
              {MOODS.slice(3).map((m) => (
                <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
              ))}
            </div>

            <Label htmlFor="note">Catatan (opsional)</Label>
            <Textarea
              id="note"
              placeholder="Ceritakan hal yang terjadi hari ini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-5"
            />

            <Button onClick={handleSave} disabled={saving} className="w-full justify-center">
              {saving ? "Menyimpan..." : "💾 Simpan Mood"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
