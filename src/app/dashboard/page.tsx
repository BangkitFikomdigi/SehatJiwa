import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
import { Bot, BookHeart, Library, ClipboardCheck, Smile, Brain, Moon, Flame } from "lucide-react";
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
  
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
 
  const name = (user?.user_metadata?.full_name as string) || "Sahabat";
 
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Halo, {name.split(" ")[0]}
          </h1>
          <p className="text-sm text-ink-muted">Mari Kita Pantau kesehatan mentalmu di sini</p>
        </div>
        <div className="flex items-center gap-2">
          {(entries?.length ?? 0) === 0 && <SeedDemoButton variant="seed" />}
          <div className="rounded-lg bg-primary-bg px-4 py-2 text-sm text-ink-muted transition-colors duration-300 hover:bg-primary-bg/70">
            Hari/tanggal: {today}
          </div>
        </div>
      </div>
 
      {/* MACRO GRID */}
      <div className="grid gap-4 sm:grid-cols-3">
        
        <Card className="col-span-1 sm:col-span-3 border-none p-6 shadow-softLg transition-all duration-300 ease-out motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
            
            {/* SISI KIRI: Karakter Bola Air & Total Data */}
            <div className="flex w-full flex-col items-center justify-center gap-6 lg:w-1/3 lg:pt-8">
              
              {/* 2. GANTI BAGIAN GAMBAR DENGAN KOMPONEN INI */}
              <InteractiveAquarium totalMoods={savedMoodCount} />

              {/* Badge Jumlah Data */}
              <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 shadow-sm">
                ✨ {savedMoodCount} catatan mood tersimpan ✨
              </div>
            </div>

            {/* SISI KANAN: Kotak Interaktif Form Mood */}
            <div className="flex w-full flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm lg:w-2/3 lg:p-8">
              
              {/* Rekap Mood (Atas) */}
              <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-2 lg:gap-3 rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
                <div className="flex items-center gap-1.5 rounded-full border border-yellow-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span className="text-yellow-400">○</span> 🥰 Sangat Bahagia <span className="font-bold text-yellow-500">3x</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span className="text-green-400">○</span> 😌 Bahagia <span className="font-bold text-green-500">2x</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span className="text-gray-400">○</span> 😐 Netral <span className="font-bold text-gray-500">10x</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span className="text-blue-400">○</span> 😢 Sedih <span className="font-bold text-blue-500">3x</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <span className="text-purple-400">○</span> 😭 Sangat Sedih <span className="font-bold text-purple-500">14x</span>
                </div>
              </div>

              {/* Pertanyaan */}
              <h3 className="text-center text-sm font-semibold text-gray-700 sm:text-base">
                🥰 Bagaimana perasaanmu sekarang?
              </h3>

              {/* Pilihan Mood */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
                <button className="rounded-full border-2 border-yellow-400 bg-white px-4 py-2 text-sm font-semibold text-yellow-500 transition-colors hover:bg-yellow-50">
                  🥰 Sangat Bahagia
                </button>
                <button className="rounded-full border-2 border-green-400 bg-white px-4 py-2 text-sm font-semibold text-green-500 transition-colors hover:bg-green-50">
                  😌 Bahagia
                </button>
                <button className="rounded-full border-2 border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50">
                  😐 Netral
                </button>
                <button className="rounded-full border-2 border-blue-400 bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-50">
                  😢 Sedih
                </button>
                <button className="rounded-full border-2 border-purple-400 bg-white px-4 py-2 text-sm font-semibold text-purple-500 transition-colors hover:bg-purple-50">
                  😭 Sangat Sedih
                </button>
              </div>

              {/* Textarea */}
              <div className="mx-auto flex w-full flex-col gap-2">
                <label className="text-center text-sm font-medium text-gray-600">
                  📝 Catatan perasaan <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <textarea
                  className="w-full rounded-2xl border border-purple-100 bg-white p-4 text-sm placeholder:text-gray-300 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  placeholder="Tulis perasaanmu... 💭"
                  rows={3}
                />
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-center mt-2">
                <Button className="rounded-full bg-[#9b72b0] px-8 py-6 text-base font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-[#866099]">
                  💖 Simpan Mood 💖
                </Button>
              </div>
            </div>

          </div>
        </Card>

        {/* KARTU STRES & TIDUR */}
        <Card className="group sm:col-span-1.5 lg:col-span-1 border-l-4 border-l-secondary transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-softLg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:delay-75">
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
        
        <Card className="group sm:col-span-1.5 lg:col-span-1 border-l-4 border-l-amber-500 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-softLg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:delay-150">
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
 
      {/* REMINDER + AI */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-primary to-secondary bg-[length:200%_200%] py-10 text-center text-white shadow-softLg transition-all duration-500 ease-out hover:scale-[1.01] hover:bg-right hover:shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/5" />
          <h3 className="text-lg font-bold">Waktunya Jurnal!</h3>
          <p className="text-sm opacity-90">Tulislah perasaanmu hari ini</p>
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