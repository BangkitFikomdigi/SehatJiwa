"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Fish, Pencil, Trash2, Check, X, BookHeart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InteractiveAquarium } from "../interactive-aquarium";
import { EmojiPickerButton } from "./emoji-picker";

const MOODS = [
  { key: "sangat_bahagia", label: "Sangat Bahagia", emoji: "😄", score: 9, ring: "border-yellow-200", text: "text-yellow-600", color: "#eab308" },
  { key: "bahagia", label: "Bahagia", emoji: "🙂", score: 7, ring: "border-green-200", text: "text-green-600", color: "#22c55e" },
  { key: "netral", label: "Netral", emoji: "😐", score: 5, ring: "border-gray-200", text: "text-gray-500", color: "#9ca3af" },
  { key: "sedih", label: "Sedih", emoji: "🙁", score: 3, ring: "border-blue-200", text: "text-blue-600", color: "#3b82f6" },
  { key: "sangat_sedih", label: "Sangat Sedih", emoji: "😢", score: 1, ring: "border-purple-200", text: "text-purple-600", color: "#8b5cf6" },
] as const;

type MoodKey = (typeof MOODS)[number]["key"];

function scoreToMood(score: number) {
  return MOODS.reduce((closest, m) =>
    Math.abs(m.score - score) < Math.abs(closest.score - score) ? m : closest
  );
}

type MoodEntry = {
  id: string;
  mood_score: number;
  stress_score: number;
  sleep_score: number;
  mood_emoji: string | null;
  created_at: string;
};

type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
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
  // --- Mood ---
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loadingMood, setLoadingMood] = useState(true);
  const [savingMood, setSavingMood] = useState(false);
  const [selected, setSelected] = useState<MoodKey | null>(null);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null);
  const [editMoodSelected, setEditMoodSelected] = useState<MoodKey | null>(null);
  const [editMoodEmoji, setEditMoodEmoji] = useState<string | null>(null);
  const [editMoodSaving, setEditMoodSaving] = useState(false);
  const [confirmDeleteMoodId, setConfirmDeleteMoodId] = useState<string | null>(null);
  const [deletingMoodId, setDeletingMoodId] = useState<string | null>(null);

  // --- Jurnal ---
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loadingJournal, setLoadingJournal] = useState(true);
  const [savingJournal, setSavingJournal] = useState(false);
  const [note, setNote] = useState("");
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [editJournalContent, setEditJournalContent] = useState("");
  const [editJournalSaving, setEditJournalSaving] = useState(false);
  const [confirmDeleteJournalId, setConfirmDeleteJournalId] = useState<string | null>(null);
  const [deletingJournalId, setDeletingJournalId] = useState<string | null>(null);

  // --- Tab riwayat ---
  const [historyTab, setHistoryTab] = useState<"mood" | "jurnal">("mood");

  async function loadMoodEntries() {
    setLoadingMood(true);
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      if (res.ok) {
        setMoodEntries(data.entries ?? []);
      } else {
        toast.error(data.error ?? "Gagal memuat data mood");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoadingMood(false);
    }
  }

  async function loadJournalEntries() {
    setLoadingJournal(true);
    try {
      const res = await fetch("/api/diary/journal");
      const data = await res.json();
      if (res.ok) {
        setJournalEntries(data.entries ?? []);
      } else {
        toast.error(data.error ?? "Gagal memuat jurnal");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoadingJournal(false);
    }
  }

  useEffect(() => {
    loadMoodEntries();
    loadJournalEntries();
  }, []);

  const counts = useMemo(
    () =>
      MOODS.reduce<Record<string, number>>((acc, m) => {
        acc[m.key] = moodEntries.filter((e) => scoreToMood(e.mood_score).key === m.key).length;
        return acc;
      }, {}),
    [moodEntries]
  );

  const lastMoodExpression: "senang" | "netral" | "sedih" | undefined = useMemo(() => {
    if (moodEntries.length === 0) return undefined;
    const last = scoreToMood(moodEntries[0].mood_score ?? 5);
    if (last.key === "bahagia" || last.key === "sangat_bahagia") return "senang";
    if (last.key === "sedih" || last.key === "sangat_sedih") return "sedih";
    return "netral";
  }, [moodEntries]);

  const moodColors = useMemo(
    () =>
      moodEntries
        .slice()
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((e) => scoreToMood(e.mood_score ?? 5).color),
    [moodEntries]
  );

  // ---------- Mood: simpan / edit / hapus ----------

  async function handleSaveMood() {
    if (!selected) {
      toast.error("Pilih dulu perasaanmu hari ini ya 🙂");
      return;
    }
    setSavingMood(true);
    const mood = MOODS.find((m) => m.key === selected)!;
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood_score: mood.score,
        stress_score: 5,
        sleep_score: 5,
        mood_emoji: emoji,
      }),
    });
    const data = await res.json();
    setSavingMood(false);

    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast.success("Mood tersimpan — air di akuariummu bertambah 💧");
    setSelected(null);
    setEmoji(null);
    loadMoodEntries();
  }

  function startEditMood(entry: MoodEntry) {
    setConfirmDeleteMoodId(null);
    setEditingMoodId(entry.id);
    setEditMoodSelected(scoreToMood(entry.mood_score).key);
    setEditMoodEmoji(entry.mood_emoji ?? null);
  }

  function cancelEditMood() {
    setEditingMoodId(null);
    setEditMoodSelected(null);
    setEditMoodEmoji(null);
  }

  async function saveEditMood(id: string) {
    if (!editMoodSelected) {
      toast.error("Pilih dulu perasaannya ya 🙂");
      return;
    }
    setEditMoodSaving(true);
    const mood = MOODS.find((m) => m.key === editMoodSelected)!;
    const res = await fetch(`/api/diary/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood_score: mood.score,
        mood_emoji: editMoodEmoji,
      }),
    });
    const data = await res.json();
    setEditMoodSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal memperbarui mood");
      return;
    }
    toast.success("Mood berhasil diperbarui");
    cancelEditMood();
    loadMoodEntries();
  }

  async function handleDeleteMood(id: string) {
    setDeletingMoodId(id);
    const res = await fetch(`/api/diary/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setDeletingMoodId(null);
    setConfirmDeleteMoodId(null);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus mood");
      return;
    }
    toast.success("Catatan mood dihapus");
    if (editingMoodId === id) cancelEditMood();
    loadMoodEntries();
  }

  // ---------- Jurnal: simpan / edit / hapus ----------

  async function handleSaveJournal() {
    if (!note.trim()) {
      toast.error("Tulis dulu jurnalmu ya 📝");
      return;
    }
    setSavingJournal(true);
    const res = await fetch("/api/diary/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: note }),
    });
    const data = await res.json();
    setSavingJournal(false);

    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    toast.success("Jurnal tersimpan 📖");
    setNote("");
    loadJournalEntries();
  }

  function startEditJournal(entry: JournalEntry) {
    setConfirmDeleteJournalId(null);
    setEditingJournalId(entry.id);
    setEditJournalContent(entry.content);
  }

  function cancelEditJournal() {
    setEditingJournalId(null);
    setEditJournalContent("");
  }

  async function saveEditJournal(id: string) {
    if (!editJournalContent.trim()) {
      toast.error("Jurnal tidak boleh kosong");
      return;
    }
    setEditJournalSaving(true);
    const res = await fetch(`/api/diary/journal/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editJournalContent }),
    });
    const data = await res.json();
    setEditJournalSaving(false);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal memperbarui jurnal");
      return;
    }
    toast.success("Jurnal berhasil diperbarui");
    cancelEditJournal();
    loadJournalEntries();
  }

  async function handleDeleteJournal(id: string) {
    setDeletingJournalId(id);
    const res = await fetch(`/api/diary/journal/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setDeletingJournalId(null);
    setConfirmDeleteJournalId(null);

    if (!res.ok) {
      toast.error(data.error ?? "Gagal menghapus jurnal");
      return;
    }
    toast.success("Jurnal dihapus");
    if (editingJournalId === id) cancelEditJournal();
    loadJournalEntries();
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
            <InteractiveAquarium
              totalMoods={moodEntries.length}
              lastMoodExpression={lastMoodExpression}
              moodColors={moodColors}
              showHint={false}
            />
            <span className="rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
              {loadingMood ? "Memuat..." : `${moodEntries.length} catatan mood tersimpan`}
            </span>
          </motion.div>

          <div className="w-full space-y-6 xl:w-2/3">
            <div className="rounded-2xl border border-primary-lighter/60 bg-primary-bg/30 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="block text-ink">Perasaan — isi ini biar akuariummu terisi 🐟</Label>
                <EmojiPickerButton value={emoji} onChange={setEmoji} />
              </div>
              <div className="mb-2 grid grid-cols-3 gap-2">
                {MOODS.slice(0, 3).map((m) => (
                  <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
                ))}
              </div>
              <div className="mb-4 grid max-w-[260px] grid-cols-2 gap-2">
                {MOODS.slice(3).map((m) => (
                  <MoodButton key={m.key} mood={m} selected={selected === m.key} onClick={() => setSelected(m.key)} />
                ))}
              </div>
              <Button
                onClick={handleSaveMood}
                disabled={savingMood}
                className="w-full justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-purple-200 transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-lg active:scale-95"
              >
                {savingMood ? "Menyimpan..." : "💾 Simpan Mood"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/60 p-4">
          <Label htmlFor="note" className="mb-3 block text-ink">Jurnal</Label>
          <Textarea
            id="note"
            placeholder="Ceritakan hal yang terjadi hari ini..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleSaveJournal}
            disabled={savingJournal}
            variant="outline"
            className="w-full justify-center rounded-full border-primary/30 text-primary hover:bg-primary-bg"
          >
            {savingJournal ? "Menyimpan..." : "📝 Simpan Jurnal"}
          </Button>
        </div>
      </Card>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryTab("mood")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              historyTab === "mood" ? "bg-primary text-white shadow-sm" : "bg-white text-ink-muted border border-gray-200"
            }`}
          >
            Riwayat Mood
          </button>
          <button
            type="button"
            onClick={() => setHistoryTab("jurnal")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              historyTab === "jurnal" ? "bg-primary text-white shadow-sm" : "bg-white text-ink-muted border border-gray-200"
            }`}
          >
            Riwayat Jurnal
          </button>
        </div>

        {historyTab === "mood" ? (
          <Card className="border-none p-5 shadow-sm sm:p-6">
            {loadingMood ? (
              <p className="py-6 text-center text-sm text-ink-muted">Memuat riwayat mood...</p>
            ) : moodEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center">
                <p className="text-base font-semibold text-ink">Belum ada catatan mood</p>
                <p className="max-w-xs text-sm text-ink-muted">
                  Catatan moodmu akan muncul di sini setiap kali kamu menyimpan perasaanmu.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {moodEntries.map((e) => {
                  const mood = scoreToMood(e.mood_score);
                  const date = new Date(e.created_at);
                  const isEditing = editingMoodId === e.id;
                  const isConfirmingDelete = confirmDeleteMoodId === e.id;
                  const isDeleting = deletingMoodId === e.id;

                  if (isEditing) {
                    return (
                      <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="mb-2 flex justify-end">
                          <EmojiPickerButton value={editMoodEmoji} onChange={setEditMoodEmoji} />
                        </div>
                        <div className="mb-3 grid grid-cols-5 gap-1.5">
                          {MOODS.map((m) => (
                            <MoodButton
                              key={m.key}
                              mood={m}
                              selected={editMoodSelected === m.key}
                              onClick={() => setEditMoodSelected(m.key)}
                            />
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditMood}
                            disabled={editMoodSaving}
                            className="rounded-full"
                          >
                            <X className="mr-1 h-3.5 w-3.5" /> Batal
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEditMood(e.id)}
                            disabled={editMoodSaving}
                            className="rounded-full bg-gradient-to-r from-primary to-secondary text-white"
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> {editMoodSaving ? "Menyimpan..." : "Simpan"}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={e.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="text-xl leading-none">{e.mood_emoji || mood.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-semibold ${mood.text}`}>{mood.label}</span>
                          <span className="text-xs text-ink-muted">
                            {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {isConfirmingDelete ? (
                          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                            <span className="flex-1">Hapus catatan ini?</span>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMoodId(null)}
                              disabled={isDeleting}
                              className="rounded-full px-2 py-1 font-medium text-ink-muted hover:bg-white"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMood(e.id)}
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
                              onClick={() => startEditMood(e)}
                              className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-primary"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMoodId(e.id)}
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
        ) : (
          <Card className="border-none p-5 shadow-sm sm:p-6">
            {loadingJournal ? (
              <p className="py-6 text-center text-sm text-ink-muted">Memuat riwayat jurnal...</p>
            ) : journalEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center">
                <BookHeart className="h-6 w-6 text-primary" />
                <p className="text-base font-semibold text-ink">Belum ada jurnal</p>
                <p className="max-w-xs text-sm text-ink-muted">
                  Tulisanmu akan muncul di sini setiap kali kamu menyimpan jurnal.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {journalEntries.map((e) => {
                  const date = new Date(e.created_at);
                  const isEditing = editingJournalId === e.id;
                  const isConfirmingDelete = confirmDeleteJournalId === e.id;
                  const isDeleting = deletingJournalId === e.id;

                  if (isEditing) {
                    return (
                      <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                        <Textarea
                          value={editJournalContent}
                          onChange={(ev) => setEditJournalContent(ev.target.value)}
                          placeholder="Ceritakan hal yang terjadi hari ini..."
                          className="mb-3"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditJournal}
                            disabled={editJournalSaving}
                            className="rounded-full"
                          >
                            <X className="mr-1 h-3.5 w-3.5" /> Batal
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEditJournal(e.id)}
                            disabled={editJournalSaving}
                            className="rounded-full bg-gradient-to-r from-primary to-secondary text-white"
                          >
                            <Check className="mr-1 h-3.5 w-3.5" /> {editJournalSaving ? "Menyimpan..." : "Simpan"}
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={e.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <BookHeart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-ink-muted">
                            {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">{e.content}</p>

                        {isConfirmingDelete ? (
                          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                            <span className="flex-1">Hapus jurnal ini?</span>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteJournalId(null)}
                              disabled={isDeleting}
                              className="rounded-full px-2 py-1 font-medium text-ink-muted hover:bg-white"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteJournal(e.id)}
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
                              onClick={() => startEditJournal(e)}
                              className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-primary"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteJournalId(e.id)}
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
        )}
      </div>
    </div>
  );
}