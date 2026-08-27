import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
import { BookHeart, Flame } from "lucide-react";
import { InteractiveAquarium } from "./interactive-aquarium";
 
export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  const { data: entries } = await supabase
    .from("mood_entries")
    .select("mood_score, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(7);

  const { count: totalMoods } = await supabase
    .from("mood_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);
 
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
      {/* ================= BARIS 1: MOOD (BESAR) + KALENDER (KOLOM KANAN) ================= */}
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
            <div className="relative flex w-full flex-col gap-3 p-2 sm:p-3 xl:w-2/3 xl:border-l xl:border-gray-100 xl:pl-8">

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
            </div>

          </div>
        </Card>

        {/* KALENDER */}
        <Card className="border-none p-5 shadow-sm transition-all duration-300 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:delay-75">
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

      {/* ================= BARIS 2: JURNAL (PENUH SATU BARIS) ================= */}
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