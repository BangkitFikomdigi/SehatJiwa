import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Menghasilkan variasi angka yang natural (bukan garis lurus membosankan)
function wobble(base: number, range: number) {
  const v = base + (Math.random() * range * 2 - range);
  return Math.max(0, Math.min(10, Math.round(v)));
}

const diaryNotes = [
  "Hari ini cukup produktif, mengerjakan beberapa tugas sampai selesai.",
  "Sedikit capek karena kurang tidur semalam.",
  "Ketemu teman lama, jadi lebih rileks.",
  "Deadline bikin agak tegang, tapi masih bisa dihandle.",
  "Olahraga pagi bikin mood lumayan bagus.",
  "Biasa saja, tidak ada yang spesial hari ini.",
  "Sempat overthinking soal kerjaan, tapi sudah mendingan malam ini.",
  null,
  null,
];

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  // ---------- 1. Seed 14 hari mood_entries ----------
  const moodRows = Array.from({ length: 14 }).map((_, i) => {
    const daysAgo = 13 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(20, 0, 0, 0);

    return {
      user_id: user.id,
      mood_score: wobble(6.5, 2.5),
      stress_score: wobble(4.5, 2.5),
      sleep_score: wobble(6, 2),
      note: diaryNotes[i % diaryNotes.length],
      created_at: date.toISOString(),
    };
  });

  const { error: moodError } = await supabase.from("mood_entries").insert(moodRows);
  if (moodError) {
    return NextResponse.json({ error: `Gagal seed mood_entries: ${moodError.message}` }, { status: 500 });
  }

  // ---------- 2. Seed 2 hasil screening (PHQ-9 & GAD-7) ----------
  const screeningRows = [
    {
      user_id: user.id,
      test_id: "phq9",
      total_score: 7,
      severity: "Ringan",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      user_id: user.id,
      test_id: "gad7",
      total_score: 5,
      severity: "Ringan",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];

  const { error: screeningError } = await supabase
    .from("screening_results")
    .insert(screeningRows);
  if (screeningError) {
    return NextResponse.json(
      { error: `Gagal seed screening_results: ${screeningError.message}` },
      { status: 500 }
    );
  }

  // ---------- 3. Seed contoh percakapan AI ----------
  const aiRows = [
    { user_id: user.id, role: "user", content: "Akhir-akhir ini aku sering merasa cemas soal kerjaan." },
    {
      user_id: user.id,
      role: "model",
      content:
        "Terima kasih sudah cerita 🌱 Wajar merasa cemas soal pekerjaan, apalagi kalau tuntutannya banyak. Boleh cerita lebih detail, bagian mana yang paling bikin cemas?",
    },
  ];
  await supabase.from("ai_messages").insert(aiRows);

  return NextResponse.json({
    success: true,
    inserted: { mood_entries: moodRows.length, screening_results: screeningRows.length, ai_messages: aiRows.length },
  });
}

// Hapus semua data demo/pribadi milik user yang sedang login (reset akun)
export async function DELETE() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  await Promise.all([
    supabase.from("mood_entries").delete().eq("user_id", user.id),
    supabase.from("screening_results").delete().eq("user_id", user.id),
    supabase.from("ai_messages").delete().eq("user_id", user.id),
  ]);

  return NextResponse.json({ success: true });
}
