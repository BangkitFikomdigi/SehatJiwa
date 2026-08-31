import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { journals } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

const createJournalSchema = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  mood: z.number().int().min(0).max(10).optional(),
});

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) return DUMMY_USER_ID;

  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();

    const userJournals = await db
      .select()
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(journals.createdAt);

    return NextResponse.json({ journals: userJournals });
  } catch (error) {
    console.error("GET journals error:", error);
    return NextResponse.json(
      { error: "Gagal fetch journals" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();

    const validated = createJournalSchema.parse(body);

    const [journal] = await db
      .insert(journals)
      .values({
        userId,
        title: validated.title,
        content: validated.content,
        mood: validated.mood || null,
      })
      .returning();

    return NextResponse.json({ journal }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }
    console.error("POST journals error:", error);
    return NextResponse.json(
      { error: "Gagal buat journal" },
      { status: 500 }
    );
  }
}
