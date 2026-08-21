import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button";
import { Bot, BookHeart, Library, ClipboardCheck, Smile, Brain, Moon } from "lucide-react";

export default async function DashboardHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil 7 entri mood terakhir dari tabel `mood_entries` (lihat supabase/schema.sql)
  const { data: entries } = await supabase
    .from("mood_entries")
    .select("mood_score, stress_score, sleep_score, created_at")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(7);

  const avg = (key: "mood_score" | "stress_score" | "sleep_score") => {
    if (!entries || entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + (e[key] ?? 0), 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const moodAvg = avg("mood_score");
  const stressAvg = avg("stress_score");
  const sleepAvg = avg("sleep_score");
  const streak = entries?.length ?? 0;
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
          <div className="rounded-lg bg-primary-bg px-4 py-2 text-sm text-ink-muted"> Hari/tanggl: {today}</div>
        </div>
      </div>

      {/* MACRO GRID */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <Smile className="h-4 w-4" /> Mood
          </div>
          <div className="text-3xl font-extrabold">{moodAvg || "—"}</div>
          <div className="mb-2 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
          <Progress value={moodAvg * 10} />
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <Brain className="h-4 w-4" /> Stres
          </div>
          <div className="text-3xl font-extrabold">{stressAvg || "—"}</div>
          <div className="mb-2 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
          <Progress value={stressAvg * 10} />
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <Moon className="h-4 w-4" /> Kualitas Tidur
          </div>
          <div className="text-3xl font-extrabold">{sleepAvg || "—"}</div>
          <div className="mb-2 text-xs text-ink-muted">dari 10 · rata-rata 7 hari</div>
          <Progress value={sleepAvg * 10} />
        </Card>
      </div>

      {/* REMINDER + AI */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary to-secondary py-10 text-center text-white shadow-softLg">
          
          <h3 className="text-lg font-bold">Waktunya Jurnal!</h3>
          <p className="text-sm opacity-90">Tulislah perasaanmu hari ini </p>
          <div className="my-2 text-sm font-semibold">
            {streak} <span className="opacity-80">/ 7 hari berturut-turut</span>
          </div>
          <Link href="/dashboard/diary">
            <Button className="bg-white text-primary hover:bg-primary-bg">Tulis Diary</Button>
          </Link>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 font-bold">
            <Bot className="h-5 w-5 text-primary" /> Ngobrol dengan AI
          </div>
          <p className="mb-4 text-sm text-ink-muted">
            Butuh teman cerita? Kawan SehatJiwa siap mendengarkan kapan saja,
            dengan empati dan tanpa menghakimi.
          </p>
          <Link href="/dashboard/ai">
            <Button variant="soft" className="w-full justify-center">Mulai Chat</Button>
          </Link>
        </Card>
      </div>

      {/* QUICK LINKS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink href="/dashboard/ai" icon={Bot} label="AI" desc="Teman cerita 24/7" />
        <QuickLink href="/dashboard/diary" icon={BookHeart} label="Diary Mood" desc="Catat perasaanmu" />
        <QuickLink href="/dashboard/library" icon={Library} label="Perpustakaan" desc="Artikel psikologi" />
        <QuickLink href="/dashboard/screening" icon={ClipboardCheck} label="Screening" desc="Tes PHQ-9 & GAD-7" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed border-primary-light bg-primary-bg p-4 text-xs text-ink-muted">
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

function QuickLink({
  href,
  icon: Icon,
  label,
  desc,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:-translate-y-1 hover:shadow-softLg">
        <Icon className="mb-2 h-6 w-6 text-primary" />
        <div className="font-bold">{label}</div>
        <div className="text-xs text-ink-muted">{desc}</div>
      </Card>
    </Link>
  );
}
