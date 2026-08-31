"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookHeart } from "lucide-react";
import { InteractiveAquarium } from "./interactive-aquarium";

type Entry = {
  id: string;
  mood_score: number;
  stress_score: number;
  sleep_score: number;
  note: string | null;
  created_at: string;
};

export default function DashboardHome() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Gagal fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }

  const savedMoodCount = entries?.length ?? 0;

  // Kategori mood berdasarkan skor 0–10 (skala yang sama dipakai di halaman Diary)
  const moodCategories = [
    { label: "Sangat Sedih", emoji: "😭", min: 0, max: 2, ring: "border-purple-200", text: "text-purple-500" },
    { label: "Sedih", emoji: "😢", min: 3, max: 4, ring: "border-blue-200", text: "text-blue-500" },
    { label: "Netral", emoji: "😐", min: 5, max: 6, ring: "border-gray-200", text: "text-gray-500" },
    { label: "Bahagia", emoji: "😌", min: 7, max: 8, ring: "border-green-200", text: "text-green-500" },
    { label: "Sangat Bahagia", emoji: "🥰", min: 9, max: 10, ring: "border-yellow-200", text: "text-yellow-500" },
  ];
  const categoryOf = (score: number) =>
    moodCategories.find((c) => score >= c.min && score <= c.max) ?? moodCategories[2];

  // Emoji & ekspresi mood terakhir yang ditambahkan (entri paling baru)
  const lastCategory = entries && entries.length > 0 ? categoryOf(entries[0].mood_score ?? 5) : undefined;
  const lastMoodExpression: "senang" | "netral" | "sedih" | undefined = lastCategory
    ? lastCategory.label === "Bahagia" || lastCategory.label === "Sangat Bahagia"
      ? "senang"
      : lastCategory.label === "Sedih" || lastCategory.label === "Sangat Sedih"
      ? "sedih"
      : "netral"
    : undefined;

  // Rekap mood hari ini
  const todayStr = new Date().toDateString();
  const todaysEntries = (entries ?? []).filter((e) => new Date(e.created_at).toDateString() === todayStr);
  const todaysRecap = moodCategories
    .map((c) => ({
      ...c,
      count: todaysEntries.filter((e) => categoryOf(e.mood_score ?? 5).label === c.label).length,
    }))
    .filter((c) => c.count > 0);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Minggu
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="space-y-6">
      {/* ================= BARIS 1: MOOD + KALENDER ================= */}
      <div className="grid gap-4 lg:grid-cols-3 items-stretch">

        {/* MOOD TRACKER */}
        <Card className="lg:col-span-2 border-none p-4 sm:p-6 shadow-softLg transition-all duration-300 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-center xl:justify-between">

            {/* SISI KIRI: Karakter Bola Air Bulat & Total Data */}
            <div className="flex w-full flex-col items-center justify-center gap-4 xl:w-1/3">

              <Link href="/dashboard/diary" aria-label="Isi mood sekarang">
                <InteractiveAquarium totalMoods={savedMoodCount} lastMoodExpression={lastMoodExpression} />
              </Link>
            </div>

            {/* SISI KANAN: Rekap Mood Hari Ini + CTA ke halaman isi mood */}
            <div className="flex w-full flex-col gap-3 rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm xl:w-2/3 xl:p-7">

              <h3 className="flex items-center justify-center gap-2 text-center text-base font-semibold text-gray-700 sm:text-lg">
                📅 Rekap Mood Hari Ini
              </h3>

              {todaysRecap.length === 0 ? (
                <p className="py-2 text-center text-sm text-gray-400">
                  Belum ada mood yang dicatat hari ini.
                </p>
              ) : (
                <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2">
                  {todaysRecap.map((c) => (
                    <div
                      key={c.label}
                      className={`flex items-center gap-1.5 rounded-full border ${c.ring} bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm`}
                    >
                      {c.emoji} {c.label} <span className={`font-bold ${c.text}`}>{c.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Card>

        {/* KALENDER */}
        <Card className="border-none p-5 shadow-sm">
          <div className="mb-3 text-center text-sm font-semibold capitalize text-ink">{monthName}</div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-medium text-ink-muted">
            {weekDays.map((d) => (
              <div key={d}>{d}</div>
            ))}
            {calendarCells.map((day, idx) => (
              <div
                key={idx}
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  day === todayDate
                    ? "bg-primary font-bold text-white"
                    : day
                    ? "text-ink-muted hover:bg-primary-bg"
                    : ""
                }`}
              >
                {day ?? ""}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ================= BARIS 2: RIWAYAT JURNAL ================= */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink sm:text-xl">Riwayat Jurnal</h3>
          <Link href="/dashboard/diary" className="text-sm font-semibold text-primary hover:underline">
            Lihat Semua
          </Link>
        </div>

        <Card className="border-none p-5 shadow-sm sm:p-6">
          {loading ? (
            <p className="py-6 text-center text-sm text-ink-muted">Memuat riwayat jurnal...</p>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center">
              <BookHeart className="h-7 w-7 text-primary" />
              <p className="text-base font-semibold text-ink">Belum ada jurnal</p>
              <p className="max-w-xs text-sm text-ink-muted">
                Catatan moodmu akan muncul di sini setelah kamu mengisi diary.
              </p>
              <Link href="/dashboard/diary" className="mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-200 transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
                  + Isi Jurnal
                </span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {entries.slice(0, 5).map((e) => {
                const cat = categoryOf(e.mood_score ?? 5);
                const date = new Date(e.created_at);
                return (
                  <div key={e.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold ${cat.text}`}>{cat.label}</span>
                        <span className="text-xs text-ink-muted">
                          {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}
                          {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {e.note && <p className="mt-1 text-sm text-ink-muted">{e.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* QUICK LINKS */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed border-primary-light bg-primary-bg p-4 text-xs text-ink-muted transition-colors duration-300 hover:border-primary/50 mt-4">
        {loading ? (
          <span>Memuat data...</span>
        ) : (entries?.length ?? 0) === 0 ? (
          <span>
            Belum ada data mood. Isi Diary Mood untuk mulai melihat dashboard terisi.
          </span>
        ) : (
          <span>
            Statistik dihitung dari {entries.length} catatan mood terakhir.
          </span>
        )}
      </div>
    </div>
  );
}