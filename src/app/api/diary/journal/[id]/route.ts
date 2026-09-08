import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, moodJournals } from "@/lib/db/schema";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

async function ensureDummyUser() {
  await db.insert(user).values({
    id: DUMMY_USER_ID,
    name: "Tester",
    email: "test@example.com",
    emailVerified: true,
  }).onConflictDoNothing({ target: user.id });
}

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) {
    await ensureDummyUser();
    return DUMMY_USER_ID;
  }
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    const { content } = await req.json();
    const trimmed = typeof content === "string" ? content.trim() : "";

    if (!trimmed) {
      return NextResponse.json({ error: "Jurnal tidak boleh kosong." }, { status: 400 });
    }

    const [updated] = await db
      .update(moodJournals)
      .set({ content: trimmed })
      .where(and(eq(moodJournals.id, params.id), eq(moodJournals.userId, userId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Jurnal tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      entry: {
        id: updated.id,
        content: updated.content,
        created_at: updated.createdAt.toISOString(),
        updated_at: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PUT journal entry error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui jurnal." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();

    const result = await db
      .delete(moodJournals)
      .where(and(eq(moodJournals.id, params.id), eq(moodJournals.userId, userId)))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Jurnal tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE journal entry error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus jurnal." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
