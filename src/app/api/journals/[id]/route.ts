import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { journals } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

const updateJournalSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  mood: z.number().int().min(0).max(10).optional(),
});

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) return DUMMY_USER_ID;
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const journal = await db
      .select()
      .from(journals)
      .where(and(eq(journals.id, params.id), eq(journals.userId, userId)))
      .limit(1);

    if (!journal || journal.length === 0) {
      return NextResponse.json({ error: "Journal tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ journal: journal[0] });
  } catch (error) {
    console.error("GET journal error:", error);
    return NextResponse.json(
      { error: "Gagal fetch journal" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const body = await req.json();

    const validated = updateJournalSchema.parse(body);

    const [updatedJournal] = await db
      .update(journals)
      .set(validated)
      .where(and(eq(journals.id, params.id), eq(journals.userId, userId)))
      .returning();

    if (!updatedJournal) {
      return NextResponse.json({ error: "Journal tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ journal: updatedJournal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }
    console.error("PUT journal error:", error);
    return NextResponse.json(
      { error: "Gagal update journal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();

    const result = await db
      .delete(journals)
      .where(and(eq(journals.id, params.id), eq(journals.userId, userId)))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Journal tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE journal error:", error);
    return NextResponse.json(
      { error: "Gagal hapus journal" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
