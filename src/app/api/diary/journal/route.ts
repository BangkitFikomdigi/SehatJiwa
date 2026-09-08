import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
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

export async function GET() {
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

  if (SKIP_AUTH) await ensureDummyUser();

  const rows = await db
    .select()
    .from(moodJournals)
    .where(eq(moodJournals.userId, userId))
    .orderBy(desc(moodJournals.createdAt))
    .limit(500);

  const entries = rows.map((e) => ({
    id: e.id,
    content: e.content,
    created_at: e.createdAt.toISOString(),
    updated_at: e.updatedAt.toISOString(),
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

  if (SKIP_AUTH) await ensureDummyUser();

  const { content } = await req.json();
  const trimmed = typeof content === "string" ? content.trim() : "";

  if (!trimmed) {
    return NextResponse.json({ error: "Jurnal tidak boleh kosong." }, { status: 400 });
  }

  const [entry] = await db
    .insert(moodJournals)
    .values({ userId, content: trimmed })
    .returning();

  return NextResponse.json({
    entry: {
      id: entry.id,
      content: entry.content,
      created_at: entry.createdAt.toISOString(),
      updated_at: entry.updatedAt.toISOString(),
    },
  });
}
