import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiMessages } from "@/lib/db/schema";
import { aiRateLimiter } from "@/lib/upstash/ratelimit";
import { generateAiReply } from "@/lib/ai/gemini";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER_ID = "test-user-1";

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

  // Rate limit pakai Upstash Redis — 15 pesan/menit per pengguna
  const { success, remaining } = await aiRateLimiter.limit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Terlalu banyak pesan. Coba lagi sebentar lagi ya 🙏" },
      { status: 429 }
    );
  }

  const { history } = await req.json();
  if (!Array.isArray(history) || history.length === 0) {
    return NextResponse.json({ error: "Pesan kosong." }, { status: 400 });
  }

  try {
    const reply = await generateAiReply(history);

    // Simpan riwayat percakapan ke Postgres (opsional, untuk histori pengguna)
    await db.insert(aiMessages).values([
      { userId, role: "user", content: history[history.length - 1].text },
      { userId, role: "model", content: reply },
    ]);

    return NextResponse.json({ reply, remaining });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "AI sedang tidak bisa merespons. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
