"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookHeart, Brain, Moon, Flame, ArrowRight } from "lucide-react";
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
  const [moodAvg, setMoodAvg] = useState(0);
  const [stressAvg, setStressAvg] = useState(0);
  const [sleepAvg, setSleepAvg] = useState(0);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      setEntries(data.entries || []);

      if (data.entries && data.entries.length > 0) {
        const moodSum = data.entries.reduce((acc: number, e: Entry) => acc + e.mood_score, 0);
        const stressSum = data.entries.reduce((acc: number, e: Entry) => acc + e.stress_score, 0);
        const sleepSum = data.entries.reduce((acc: number, e: Entry) => acc + e.sleep_score, 0);

        setMoodAvg(Math.round((moodSum / data.entries.length) * 10) / 10);
        setStressAvg(Math.round((stressSum / data.entries.length) * 10) / 10);
        setSleepAvg(Math.round((sleepSum / data.entries.length) * 10) / 10);
      }
    } catch (error) {
      console.error("Gagal fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }

  const streak = entries?.length ?? 0;
  const todaysEntries = entries.filter((e) => {
    const today = new Date().toDateString();
    const entryDate = new Date(e.created_at).toDateString();
    return today === entryDate;
  });

  const monthName = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });
  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="space-y-6">
      {/* BARIS 1: MOOD (BESAR) + STRES & TIDUR (KOLOM KANAN) */}
      <div className="grid gap-4 lg:grid-cols-3 items-stretch">
        {/* MOOD TRACKER — PALING BESAR */}
        <Card className="group relative lg:col-span-2 flex flex-col justify-center border-l-4 border-l-primary transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-softLg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <span className="text-lg">😊</span> Mood Hari Ini
          </div>
          <div className="text-4xl font-extrabold transition-colors duration-300 group-hover:text-primary">
            {moodAvg || "—"}
          </div>
          <div className="mb-4 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
          <Progress value={moodAvg * 10} className="transition-all duration-700 ease-out" />

          {/* Aquarium */}
          <div className="relative mt-4 h-48 w-full overflow-hidden rounded-lg bg-gradient-to-b from-blue-100 to-blue-50">
            <InteractiveAquarium />
          </div>

          {/* SISI KANAN: Rekap Mood Hari Ini + CTA ke halaman isi mood */}
          <div className="relative flex w-full flex-col gap-3 p-2 sm:p-3 xl:w-2/3 xl:border-l xl:border-gray-100 xl:pl-8">
            <h3 className="flex items-center justify-center gap-2 text-center text-base font-semibold text-gray-700 sm:text-lg">
              📅 Rekap Mood Hari Ini
            </h3>

            {todaysEntries.length === 0 ? (
              <p className="text-center text-sm text-gray-500">Belum ada catatan hari ini</p>
            ) : (
              <div>
                {todaysEntries.map((entry) => (
                  <div key={entry.id} className="text-xs text-gray-600">
                    Mood: {entry.mood_score}/10
                    {entry.note && <p className="mt-1 italic">"{entry.note}"</p>}
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-sm text-gray-500">
              Ingin mencatat perasaanmu sekarang?
            </p>

            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
              <Link href="/dashboard/diary">
                <Button className="group flex items-center gap-1 rounded-full bg-gradient-to-r from-[#9b72b0] to-[#7c5a94] px-3 py-1.5 text-[11px] font-bold text-white shadow-md shadow-purple-200 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-300 active:scale-95">
                  <span className="transition-transform duration-300 ease-out group-hover:-rotate-6">💖</span>
                  Isi Mood Sekarang
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* KOLOM KANAN: STRES (atas) + KUALITAS TIDUR (bawah) */}
        <div className="flex h-full flex-col gap-4">
          <Card className="group flex flex-1 flex-col justify-center border-l-4 border-l-secondary transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-softLg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:delay-75">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <Brain className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-6" />
              Stres
            </div>
            <div className="text-3xl font-extrabold transition-colors duration-300 group-hover:text-secondary">
              {stressAvg || "—"}
            </div>
            <div className="mb-2 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
            <Progress value={stressAvg * 10} className="transition-all duration-700 ease-out" />
          </Card>

          <Card className="group flex flex-1 flex-col justify-center border-l-4 border-l-amber-500 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-softLg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:delay-150">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <Moon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" />
              Kualitas Tidur
            </div>
            <div className="text-3xl font-extrabold transition-colors duration-300 group-hover:text-amber-500">
              {sleepAvg || "—"}
            </div>
            <div className="mb-2 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
            <Progress value={sleepAvg * 10} className="transition-all duration-700 ease-out" />
          </Card>
        </div>
      </div>

      {/* BARIS 2: JURNAL */}
      <Card className="border-none p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink sm:text-xl">Waktunya Jurnal!</h3>
          <Link href="/dashboard/diary" className="text-sm font-semibold text-primary hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary-lighter bg-primary-bg/40 px-6 py-10 text-center transition-colors duration-300 hover:border-primary/40">
          <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-primary-lighter">
            <BookHeart className="h-7 w-7 text-primary" />
          </div>

          {todaysEntries.length === 0 ? (
            <>
              <p className="text-base font-semibold text-ink">Belum ada jurnal hari ini</p>
              <p className="max-w-xs text-sm text-ink-muted">
                Catat mood-mu untuk otomatis mengisi jurnal harianmu.
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-ink">
                {todaysEntries.length} jurnal tercatat hari ini
              </p>
              <p className="max-w-xs text-sm text-ink-muted">
                Mantap, kamu sudah menulis perasaanmu hari ini!
              </p>
            </>
          )}

          <div className={`mt-1 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-muted shadow-sm ${streak === 0 ? "motion-safe:animate-pulse" : ""}`}>
            <Flame className="h-3.5 w-3.5 text-secondary" />
            {streak} <span className="opacity-70">/ 7 hari berturut-turut</span>
          </div>

          <Link href="/dashboard/diary" className="mt-2">
            <Button className="bg-gradient-to-r from-primary to-secondary px-5 text-white transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
              + Tulis Jurnal
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
