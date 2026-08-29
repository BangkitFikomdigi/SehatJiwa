import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: headers() });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, session.user.id))
      .limit(1);

    if (!admin || admin.length === 0) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

    return NextResponse.json({ isAdmin: true, role: admin[0].role });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Gagal check admin" },
      { status: 500 }
    );
  }
}
