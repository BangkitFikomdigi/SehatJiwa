"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Fish, Pencil, Trash2, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InteractiveAquarium } from "../interactive-aquarium";

const MOODS = [
  { key: "sangat_bahagia", label: "Sangat Bahagia", emoji: "😄", score: 9, ring: "border-yellow-200", text: "text-yellow-600" },
  { key: "bahagia", label: "Bahagia", emoji: "🙂", score: 7, ring: "border-green-200", text: "text-green-600" },
  { key: "netral", label: "Netral", emoji: "😐", score: 5, ring: "border-gray-200", text: "text-gray-500" },
  { key: "sedih", label: "Sedih", emoji: "🙁", score: 3, ring: "border-blue-200", text: "text-blue-600" },
  { key: "sangat_sedih", label: "Sangat Sedih", emoji: "😢", score: 1, ring: "border-purple-200", text: "text-purple-600" },
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
  stress_score: number;
  sleep_score: number;
  note: string | null;
  created_at: string;
};

function MoodButton({ mood, selected, onClick }: { mood: (typeof MOODS)[number]; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-medium transition-colors ${
        selected ? `${mood.ring} bg-primary-bg ${mood.text}` : "border-gray-200 bg-white text-ink-muted"
      }`}
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSelected, setEditSelected] = useState<MoodKey | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const lastMoodExpression: "senang" | "netral" | "sedih" | undefined = useMemo(() => {
    if (entries.length === 0) return undefined;
    const last = scoreToMood(entries[0].mood_score ?? 5);
    if (last.key === "bahagia" || last.key === "sangat_bahagia") return "senang";
    if (last.key === "sedih" || last.key === "sangat_sedih") return "sedih";
    return "netral";
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
        stress_score: 5,
        sleep_score: 5,
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

  function startEdit(entry: Entry) {
    setConfirmDeleteId(null);
    setEditingId(entry.id);
    setEditSelected(scoreToMood(entry.mood_score).key);
    setEditNote(entry.note ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditSelected(null);
    setEditNote("");
  }

  async function saveEdit(id: string) {
    if (!editSelected) {
      toast.error("Pilih dulu perasaannya ya 🙂");
      return;
    }
    setEditSaving(true);
    const mood = MOODS.find((m) => m.key === editSelected)!;
    const res = await fetch(`/api/diary/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood_score: mood.score,
        stress_score: 5,
        sleep_score: 5,
        note: editNote,
      }),
    });
    const data = await res.json();
    setEditSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal memperbarui catatan");
      return;
    }
    toast.success("Catatan berhasil diperbarui");
    cancelEdit();
    loadEntries();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/diary/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setDeletingId(null);
    setConfirmDeleteId(null);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus catatan");
      return;
    }
    toast.success("Catatan dihapus");
    if (editingId === id) cancelEdit();
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

      <Card className="border-none p-4 sm:p-6 shadow-softLg transition-all duration-300 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 bg-white/50 backdrop-blur-sm space-y-6">
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <span
              key={m.key}
              className={`inline-flex items-center gap-1.5 rounded-full border ${m.ring} bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm`}
            >
              {m.emoji} {m.label} <span className={`font-bold ${m.text}`}>{counts[m.key] ?? 0}x</span>
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col items-center gap-3 xl:w-1/3"
          >
            <InteractiveAquarium totalMoods={entries.length} lastMoodExpression={lastMoodExpression} showHint={false} />
            <span className="rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
              {loading ? "Memuat..." : `${entries.length} catatan mood tersimpan`}
            </span>
          </motion.div>

          <div className="w-full xl:w-2/3">
            <Label className="mb-3 block text-ink">Bagaimana perasaanmu sekarang?</Label>
            <div className="mb-2 grid grid-cols-3 gap-2">
              {MOODS.slice(0, 3).map((m) => (
                <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
              ))}
            </div>
            <div className="grid max-w-[260px] grid-cols-2 gap-2">
              {MOODS.slice(3).map((m) => (
                <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
              ))}
            </div>

            <Label htmlFor="note" className="mb-3 mt-6 block text-ink">Tulis Jurnal (opsional)</Label>
            <Textarea
              id="note"
              placeholder="Ceritakan hal yang terjadi hari ini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-5"
            />

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-purple-200 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg active:scale-95"
            >
              {saving ? "Menyimpan..." : "💾 Simpan Mood & Jurnal"}
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="mb-4 text-lg font-bold text-ink sm:text-xl">Riwayat Jurnal</h3>

        <Card className="border-none p-5 shadow-sm sm:p-6">
          {loading ? (
            <p className="py-6 text-center text-sm text-ink-muted">Memuat jurnal...</p>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center">
              <p className="text-base font-semibold text-ink">Belum ada jurnal</p>
              <p className="max-w-xs text-sm text-ink-muted">
                Catatan moodmu akan muncul di sini setiap kali kamu menyimpan perasaanmu.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {entries.map((e) => {
                const mood = scoreToMood(e.mood_score);
                const date = new Date(e.created_at);
                const isEditing = editingId === e.id;
                const isConfirmingDelete = confirmDeleteId === e.id;
                const isDeleting = deletingId === e.id;

                if (isEditing) {
                  return (
                    <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="mb-3 grid grid-cols-5 gap-1.5">
                        {MOODS.map((m) => (
                          <MoodButton
                            key={m.key}
                            mood={m}
                            selected={editSelected === m.key}
                            onClick={() => setEditSelected(m.key)}
                          />
                        ))}
                      </div>
                      <Textarea
                        value={editNote}
                        onChange={(ev) => setEditNote(ev.target.value)}
                        placeholder="Ceritakan hal yang terjadi hari ini..."
                        className="mb-3"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={editSaving}
                          className="rounded-full"
                        >
                          <X className="mr-1 h-3.5 w-3.5" /> Batal
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(e.id)}
                          disabled={editSaving}
                          className="rounded-full bg-gradient-to-r from-primary to-secondary text-white"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" /> {editSaving ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={e.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="text-xl leading-none">{mood.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold ${mood.text}`}>{mood.label}</span>
                        <span className="text-xs text-ink-muted">
                          {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}
                          {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {e.note && <p className="mt-1 text-sm text-ink-muted">{e.note}</p>}

                      {isConfirmingDelete ? (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                          <span className="flex-1">Hapus catatan ini?</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isDeleting}
                            className="rounded-full px-2 py-1 font-medium text-ink-muted hover:bg-white"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(e.id)}
                            disabled={isDeleting}
                            className="rounded-full bg-red-600 px-2.5 py-1 font-semibold text-white hover:bg-red-700"
                          >
                            {isDeleting ? "Menghapus..." : "Ya, hapus"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1.5 flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEdit(e)}
                            className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(e.id)}
                            className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
