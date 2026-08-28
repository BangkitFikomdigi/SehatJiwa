import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries, screeningResults, aiMessages } from "@/lib/db/schema";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

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
  let userId: string | null = null;

  if (SKIP_AUTH) {
    userId = DUMMY_USER_ID;
  } else {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    userId = session.user.id;
  }

  // ---------- 1. Seed 14 hari mood_entries ----------
  const moodRows = Array.from({ length: 14 }).map((_, i) => {
    const daysAgo = 13 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(20, 0, 0, 0);

    return {
      userId,
      moodScore: wobble(6.5, 2.5),
      stressScore: wobble(4.5, 2.5),
      sleepScore: wobble(6, 2),
      note: diaryNotes[i % diaryNotes.length],
      createdAt: date,
    };
  });
  await db.insert(moodEntries).values(moodRows);

  // ---------- 2. Seed 2 hasil screening (PHQ-9 & GAD-7) ----------
  const screeningRows = [
    {
      userId,
      testId: "phq9" as const,
      totalScore: 7,
      severity: "Ringan",
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      userId,
      testId: "gad7" as const,
      totalScore: 5,
      severity: "Ringan",
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
  ];
  await db.insert(screeningResults).values(screeningRows);

  // ---------- 3. Seed contoh percakapan AI ----------
  const aiRows = [
    { userId, role: "user" as const, content: "Akhir-akhir ini aku sering merasa cemas soal kerjaan." },
    {
      userId,
      role: "model" as const,
      content:
        "Terima kasih sudah cerita 🌱 Wajar merasa cemas soal pekerjaan, apalagi kalau tuntutannya banyak. Boleh cerita lebih detail, bagian mana yang paling bikin cemas?",
    },
  ];
  await db.insert(aiMessages).values(aiRows);

  return NextResponse.json({
    success: true,
    inserted: { mood_entries: moodRows.length, screening_results: screeningRows.length, ai_messages: aiRows.length },
  });
}

// Hapus semua data demo/pribadi milik user yang sedang login (reset akun).
export async function DELETE() {
  let userId: string | null = null;

  if (SKIP_AUTH) {
    userId = DUMMY_USER_ID;
  } else {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    userId = session.user.id;
  }

  await Promise.all([
    db.delete(moodEntries).where(eq(moodEntries.userId, userId)),
    db.delete(screeningResults).where(eq(screeningResults.userId, userId)),
    db.delete(aiMessages).where(eq(aiMessages.userId, userId)),
  ]);

  return NextResponse.json({ success: true });
}
