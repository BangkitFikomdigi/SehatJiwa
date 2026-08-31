import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { articles, adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  image_url: z.string().url().optional().nullable(),
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await db
      .select()
      .from(articles)
      .where(eq(articles.id, params.id))
      .limit(1);

    if (!article || article.length === 0) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ article: article[0] });
  } catch (error) {
    console.error("GET article error:", error);
    return NextResponse.json(
      { error: "Gagal fetch artikel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Hanya admin yang bisa edit artikel" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = updateArticleSchema.parse(body);

    const [updatedArticle] = await db
      .update(articles)
      .set(validated)
      .where(eq(articles.id, params.id))
      .returning();

    if (!updatedArticle) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }
    console.error("PUT article error:", error);
    return NextResponse.json(
      { error: "Gagal update artikel" },
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
    const isAdmin = await checkAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Hanya admin yang bisa hapus artikel" },
        { status: 403 }
      );
    }

    const result = await db
      .delete(articles)
      .where(eq(articles.id, params.id))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE article error:", error);
    return NextResponse.json(
      { error: "Gagal hapus artikel" },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
