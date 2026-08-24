import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRateLimiter } from "@/lib/upstash/ratelimit";
import { generateAiReply } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  // Rate limit pakai Upstash Redis — 15 pesan/menit per pengguna
  const { success, remaining } = await aiRateLimiter.limit(user.id);
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

    // Simpan riwayat percakapan ke Supabase (opsional, untuk histori pengguna)
    await supabase.from("ai_messages").insert([
      { user_id: user.id, role: "user", content: history[history.length - 1].text },
      { user_id: user.id, role: "model", content: reply },
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
