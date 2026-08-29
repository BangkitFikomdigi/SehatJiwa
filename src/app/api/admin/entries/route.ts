import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const entries = await db
      .select({
        id: moodEntries.id,
        user_id: moodEntries.userId,
        mood_score: moodEntries.moodScore,
        stress_score: moodEntries.stressScore,
        sleep_score: moodEntries.sleepScore,
        note: moodEntries.note,
        created_at: moodEntries.createdAt,
      })
      .from(moodEntries)
      .orderBy(desc(moodEntries.createdAt))
      .limit(100);

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Admin entries error:", error);
    return NextResponse.json(
      { error: "Gagal fetch entries" },
      { status: 500 }
    );
  }
}
