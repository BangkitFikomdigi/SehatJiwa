import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { screeningResults } from "@/lib/db/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(screeningResults)
    .where(eq(screeningResults.userId, session.user.id))
    .orderBy(desc(screeningResults.createdAt))
    .limit(10);

  const results = rows.map((r) => ({
    id: r.id,
    test_id: r.testId,
    total_score: r.totalScore,
    severity: r.severity,
    created_at: r.createdAt.toISOString(),
  }));

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { test_id, total_score, severity } = await req.json();
  if (!test_id || (test_id !== "phq9" && test_id !== "gad7") || typeof total_score !== "number" || !severity) {
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
  }

  const [result] = await db
    .insert(screeningResults)
    .values({ userId: session.user.id, testId: test_id, totalScore: total_score, severity })
    .returning();

  return NextResponse.json({
    result: {
      id: result.id,
      test_id: result.testId,
      total_score: result.totalScore,
      severity: result.severity,
      created_at: result.createdAt.toISOString(),
    },
  });
}
