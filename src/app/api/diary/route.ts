import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, session.user.id))
    .orderBy(desc(moodEntries.createdAt))
    .limit(30);

  // Bentuk response disamakan dengan format lama (snake_case) supaya
  // frontend (src/app/dashboard/diary/page.tsx) tidak perlu diubah.
  const entries = rows.map((e) => ({
    id: e.id,
    mood_score: e.moodScore,
    stress_score: e.stressScore,
    sleep_score: e.sleepScore,
    note: e.note,
    created_at: e.createdAt.toISOString(),
  }));

  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const { mood_score, stress_score, sleep_score, note } = await req.json();

  if (
    typeof mood_score !== "number" ||
    typeof stress_score !== "number" ||
    typeof sleep_score !== "number" ||
    mood_score < 0 || mood_score > 10 ||
    stress_score < 0 || stress_score > 10 ||
    sleep_score < 0 || sleep_score > 10
  ) {
    return NextResponse.json({ error: "Data mood tidak valid." }, { status: 400 });
  }

  const [entry] = await db
    .insert(moodEntries)
    .values({
      userId: session.user.id,
      moodScore: mood_score,
      stressScore: stress_score,
      sleepScore: sleep_score,
      note: note || null,
    })
    .returning();

  return NextResponse.json({
    entry: {
      id: entry.id,
      mood_score: entry.moodScore,
      stress_score: entry.stressScore,
      sleep_score: entry.sleepScore,
      note: entry.note,
      created_at: entry.createdAt.toISOString(),
    },
  });
}
