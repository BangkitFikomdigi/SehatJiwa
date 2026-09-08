"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { toast } from "sonner";
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Trash2, Check, X, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Daftar mood — warnanya disamakan dengan halaman Dashboard & Diary supaya konsisten.
const MOODS = [
  { key: "sangat_bahagia", label: "Sangat Bahagia", emoji: "😄", score: 9, ring: "border-yellow-200", text: "text-yellow-600", color: "#eab308" },
  { key: "bahagia", label: "Bahagia", emoji: "🙂", score: 7, ring: "border-green-200", text: "text-green-600", color: "#22c55e" },
  { key: "netral", label: "Netral", emoji: "😐", score: 5, ring: "border-gray-200", text: "text-gray-500", color: "#9ca3af" },
  { key: "sedih", label: "Sedih", emoji: "🙁", score: 3, ring: "border-blue-200", text: "text-blue-600", color: "#3b82f6" },
  { key: "sangat_sedih", label: "Sangat Sedih", emoji: "😢", score: 1, ring: "border-purple-200", text: "text-purple-600", color: "#8b5cf6" },
] as const;

type MoodKey = (typeof MOODS)[number]["key"];

function scoreToMood(score: number) {
  return MOODS.reduce((closest, m) => (Math.abs(m.score - score) < Math.abs(closest.score - score) ? m : closest));
}

type Entry = {
  id: string;
  mood_score: number;
  stress_score: number;
  sleep_score: number;
  note: string | null;
  created_at: string;
};

const WEEK_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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

export default function CalendarPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulan yang sedang ditampilkan di kalender.
  const [viewDate, setViewDate] = useState(() => new Date());
  // Tanggal yang diklik user untuk memfilter daftar jurnal di bawah kalender.
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  // Mode "Semua Riwayat" menampilkan seluruh jurnal yang pernah diinput, lintas bulan.
  const [showAll, setShowAll] = useState(false);

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
        toast.error(data.error ?? "Gagal memuat data kalender");
      }
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

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
      body: JSON.stringify({ mood_score: mood.score, note: editNote }),
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

  // ================= DATA KALENDER =================
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();
  const todayDate = today.getDate();
  const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Warna mood per tanggal di bulan yang sedang dilihat, diurutkan lama -> baru per hari,
  // supaya kalau ada beberapa mood di hari yang sama, warnanya ikut menumpuk (bukan hanya warna terakhir).
  const moodColorsByDay: Record<number, string[]> = {};
  entries
    .filter((e) => {
      const d = new Date(e.created_at);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .forEach((e) => {
      const day = new Date(e.created_at).getDate();
      const color = scoreToMood(e.mood_score ?? 5).color;
      (moodColorsByDay[day] ??= []).push(color);
    });

  function buildDayStackStyle(colors?: string[]): CSSProperties | undefined {
    if (!colors || colors.length === 0) return undefined;
    if (colors.length === 1) return { backgroundColor: colors[0] };
    const step = 100 / colors.length;
    const stops = colors.map((c, i) => `${c} ${i * step}%, ${c} ${(i + 1) * step}%`).join(", ");
    return { backgroundImage: `linear-gradient(to top, ${stops})` };
  }

  function goPrevMonth() {
    setSelectedDay(null);
    setShowAll(false);
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function goNextMonth() {
    setSelectedDay(null);
    setShowAll(false);
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function goToday() {
    const now = new Date();
    setViewDate(now);
    setSelectedDay(now.getDate());
    setShowAll(false);
  }
  function handleDayClick(day: number) {
    setShowAll(false);
    setSelectedDay((prev) => (prev === day ? null : day));
  }

  // ================= DAFTAR JURNAL YANG DITAMPILKAN =================
  const sortedEntries = useMemo(
    () => entries.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [entries]
  );

  const filteredEntries = useMemo(() => {
    if (showAll) return sortedEntries;
    return sortedEntries.filter((e) => {
      const d = new Date(e.created_at);
      if (d.getFullYear() !== year || d.getMonth() !== month) return false;
      if (selectedDay != null) return d.getDate() === selectedDay;
      return true;
    });
  }, [sortedEntries, showAll, year, month, selectedDay]);

  const listTitle = showAll
    ? "Semua Jurnal Yang Pernah Diinput"
    : selectedDay
    ? `Jurnal · ${selectedDay} ${monthLabel}`
    : `Jurnal · ${monthLabel}`;

  return (
    <div className="flex h-full min-h-[calc(100vh-2rem)] flex-col gap-6 md:min-h-[calc(100vh-4rem)]">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <CalendarDays className="h-6 w-6 text-primary" /> Kalender Mood
        </h1>
        <p className="text-sm text-ink-muted">
          Lihat seluruh jurnal yang sudah kamu tulis langsung dari kalender ini. Untuk isi mood baru, buka halaman{" "}
          <span className="font-semibold text-primary">Diary Mood</span>.
        </p>
      </div>

      <div className="grid flex-1 items-stretch gap-4 lg:grid-cols-5">
        {/* ================= KALENDER ================= */}
        <Card className="flex h-full flex-col border-none p-5 shadow-sm sm:p-8 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-primary-bg hover:text-primary"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold capitalize text-ink">{monthLabel}</span>
              {!isViewingCurrentMonth && (
                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-full border border-primary-light px-2.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary-bg"
                >
                  Hari ini
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={goNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-primary-bg hover:text-primary"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-medium text-ink-muted sm:gap-y-6">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="sm:text-sm">{d}</div>
            ))}
            {calendarCells.map((day, idx) => {
              const dayColors = day ? moodColorsByDay[day] : undefined;
              const hasMood = !!dayColors?.length;
              const isToday = isViewingCurrentMonth && day === todayDate;
              const isSelected = day != null && selectedDay === day && !showAll;
              return (
                <button
                  type="button"
                  key={idx}
                  disabled={!day}
                  onClick={() => day && handleDayClick(day)}
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all sm:h-14 sm:w-14 sm:text-base ${
                    hasMood
                      ? "font-bold text-white"
                      : isToday
                      ? "bg-primary font-bold text-white"
                      : day
                      ? "text-ink-muted hover:bg-primary-bg"
                      : "cursor-default"
                  } ${isToday && hasMood ? "ring-2 ring-primary ring-offset-1" : ""} ${
                    isSelected ? "ring-2 ring-secondary ring-offset-1" : ""
                  }`}
                  style={{
                    ...buildDayStackStyle(dayColors),
                    ...(hasMood ? { textShadow: "0 1px 2px rgba(0,0,0,0.35)" } : {}),
                  }}
                  title={hasMood ? `${dayColors!.length} mood tercatat` : undefined}
                >
                  {day ?? ""}
                </button>
              );
            })}
          </div>
          </div>

          {/* Legenda warna mood */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 border-t border-gray-100 pt-6">
            {MOODS.slice().reverse().map((m) => (
              <span
                key={m.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-muted shadow-sm"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
        </Card>

        {/* ================= DAFTAR JURNAL ================= */}
        <div className="flex h-full flex-col lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-ink sm:text-xl">
              <ListChecks className="h-5 w-5 text-primary" /> {listTitle}
            </h3>
            <div className="flex gap-2">
              {(selectedDay != null || showAll) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setShowAll(false);
                  }}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Kembali ke bulan ini
                </button>
              )}
              {!showAll && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAll(true);
                    setSelectedDay(null);
                  }}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Lihat semua jurnal
                </button>
              )}
            </div>
          </div>

          <Card className="flex flex-1 flex-col overflow-y-auto border-none p-5 shadow-sm sm:p-6">
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-ink-muted">Memuat jurnal...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center">
                <p className="text-base font-semibold text-ink">Belum ada jurnal</p>
                <p className="max-w-xs text-sm text-ink-muted">
                  {showAll || selectedDay != null
                    ? "Tidak ada catatan mood pada rentang ini."
                    : "Catatan moodmu akan muncul di sini setelah kamu menyimpan perasaanmu."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredEntries.map((e) => {
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
                        <Button variant="outline" size="sm" onClick={cancelEdit} disabled={editSaving} className="rounded-full">
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
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: `${mood.color}22` }}
                    >
                      {mood.emoji}
                    </span>
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
    </div>
  );
}