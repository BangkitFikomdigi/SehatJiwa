import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

// Dummy user ID untuk testing tanpa auth
const DUMMY_USER_ID = "test-user-1";

export async function GET() {
  let userId: string | null = null;

  if (SKIP_AUTH) {
    // Gunakan dummy user ID jika auth di-skip
    userId = DUMMY_USER_ID;
  } else {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }
    userId = session.user.id;
  }

  const rows = await db
    .select()
    .from(moodEntries)
    .where(eq(moodEntries.userId, userId))
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
      userId,
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
