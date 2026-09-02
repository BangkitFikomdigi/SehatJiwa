import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { moodEntries } from "@/lib/db/schema";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

const updateEntrySchema = z.object({
  mood_score: z.number().int().min(0).max(10),
  note: z.string().nullable().optional(),
});

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) return DUMMY_USER_ID;
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { mood_score, note } = updateEntrySchema.parse(body);

    const [updated] = await db
      .update(moodEntries)
      .set({ moodScore: mood_score, note: note ?? null })
      .where(and(eq(moodEntries.id, params.id), eq(moodEntries.userId, userId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Catatan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      entry: {
        id: updated.id,
        mood_score: updated.moodScore,
        stress_score: updated.stressScore,
        sleep_score: updated.sleepScore,
        note: updated.note,
        created_at: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Data mood tidak valid." }, { status: 400 });
    }
    console.error("PUT diary entry error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui catatan." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();

    const result = await db
      .delete(moodEntries)
      .where(and(eq(moodEntries.id, params.id), eq(moodEntries.userId, userId)))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Catatan tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE diary entry error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus catatan." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
