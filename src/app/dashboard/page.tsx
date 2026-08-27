import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
import { Bot, BookHeart, Library, ClipboardCheck, Smile, Brain, Moon, Flame, ArrowRight } from "lucide-react";
import { InteractiveAquarium } from "./interactive-aquarium";
 
export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  const { data: entries } = await supabase
    .from("mood_entries")
    .select("mood_score, stress_score, sleep_score, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(7);

  const { count: totalMoods } = await supabase
    .from("mood_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);
 
  const avg = (key: "mood_score" | "stress_score" | "sleep_score") => {
    if (!entries || entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + (e[key] ?? 0), 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };
 
  const moodAvg = avg("mood_score");
  const stressAvg = avg("stress_score");
  const sleepAvg = avg("sleep_score");
  const streak = entries?.length ?? 0;
  const savedMoodCount = totalMoods || 0; 

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
      {/* ================= BARIS 1: MOOD (BESAR) + STRES & TIDUR (KOLOM KANAN) ================= */}
      <div className="grid gap-4 lg:grid-cols-3 items-stretch">

        {/* MOOD TRACKER — PALING BESAR */}
        <Card className="lg:col-span-2 border-none p-4 sm:p-6 shadow-softLg transition-all duration-300 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-center xl:justify-between">
            
            {/* SISI KIRI: Karakter Bola Air Bulat & Total Data */}
            <div className="flex w-full flex-col items-center justify-center gap-4 xl:w-1/3">
              
              <Link href="/dashboard/diary" aria-label="Isi mood sekarang">
                <InteractiveAquarium totalMoods={savedMoodCount} lastMoodExpression={lastMoodExpression} />
              </Link>

              {/* Badge Jumlah Data */}
              <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
                ✨ {savedMoodCount} catatan mood tersimpan ✨
              </div>
            </div>

            {/* SISI KANAN: Rekap Mood Hari Ini + CTA ke halaman isi mood */}
            <div className="relative flex w-full flex-col gap-3 p-2 pb-14 sm:p-3 xl:w-2/3 xl:border-l xl:border-gray-100 xl:pb-16 xl:pl-8">

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

          </div>
        </Card>

        {/* KOLOM KANAN: STRES (atas) + KUALITAS TIDUR (bawah), tinggi sejajar dengan Mood */}
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

      {/* ================= BARIS 2: JURNAL (BESAR) + KALENDER (KOLOM KANAN) ================= */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* JURNAL */}
        <Card className="group relative lg:col-span-2 flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-primary to-secondary bg-[length:200%_200%] p-10 text-center text-white shadow-softLg transition-all duration-500 ease-out hover:scale-[1.005] hover:bg-right hover:shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/5" />
          <BookHeart className="h-8 w-8 opacity-90" />
          <h3 className="text-xl font-bold">Waktunya Jurnal!</h3>
          <p className="text-sm opacity-90">Tulislah perasaanmu hari ini agar lebih lega</p>
          <div className={`my-2 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 ${streak === 0 ? "motion-safe:animate-pulse" : ""}`}>
            <Flame className="h-4 w-4" />
            {streak} <span className="opacity-80">/ 7 hari berturut-turut</span>
          </div>
          <Link href="/dashboard/diary">
            <Button className="bg-white text-primary transition-transform duration-200 ease-out hover:scale-105 hover:bg-primary-bg active:scale-95">
              Tulis Diary
            </Button>
          </Link>
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
 
      {/* QUICK LINKS */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed border-primary-light bg-primary-bg p-4 text-xs text-ink-muted transition-colors duration-300 hover:border-primary/50 mt-4">
        {(entries?.length ?? 0) === 0 ? (
          <span>
            Belum ada data di <strong>Supabase</strong>. Isi Diary Mood, atau klik{" "}
            <strong>&quot;Isi dengan Data Contoh&quot;</strong> di atas untuk melihat dashboard terisi.
          </span>
        ) : (
          <>
            <span>
              Statistik dihitung dari data asli tabel <code>mood_entries</code> di Supabase.
            </span>
            <SeedDemoButton variant="reset" />
          </>
        )}
      </div>
    </div>
  );
}