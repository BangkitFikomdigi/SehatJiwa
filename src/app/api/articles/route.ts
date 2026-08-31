import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { articles, adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

const createArticleSchema = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  category: z.string().min(1, "Category required"),
  image_url: z.string().url().optional(),
});

async function getUserId(): Promise<string> {
  if (SKIP_AUTH) return DUMMY_USER_ID;
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

async function checkAdmin(userId: string): Promise<boolean> {
  if (SKIP_AUTH) return true;
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return admin.length > 0;
}

export async function GET() {
  try {
    const allArticles = await db
      .select()
      .from(articles)
      .orderBy(articles.createdAt);

    return NextResponse.json({ articles: allArticles });
  } catch (error) {
    console.error("GET articles error:", error);
    return NextResponse.json(
      { error: "Gagal fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Hanya admin yang bisa membuat artikel" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = createArticleSchema.parse(body);

    const [article] = await db
      .insert(articles)
      .values({
        title: validated.title,
        content: validated.content,
        category: validated.category,
        image_url: validated.image_url || null,
        createdBy: userId,
      })
      .returning();

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }
    console.error("POST articles error:", error);
    return NextResponse.json(
      { error: "Gagal buat artikel" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
