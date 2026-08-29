import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, moodEntries, screeningResults, aiMessages } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const [userCount] = await db
      .select({ count: count() })
      .from(user);

    const [entriesCount] = await db
      .select({ count: count() })
      .from(moodEntries);

    const [screeningCount] = await db
      .select({ count: count() })
      .from(screeningResults);

    const [messagesCount] = await db
      .select({ count: count() })
      .from(aiMessages);

    return NextResponse.json({
      totalUsers: userCount.count || 0,
      totalEntries: entriesCount.count || 0,
      totalScreening: screeningCount.count || 0,
      totalMessages: messagesCount.count || 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Gagal fetch stats" },
      { status: 500 }
    );
  }
}
