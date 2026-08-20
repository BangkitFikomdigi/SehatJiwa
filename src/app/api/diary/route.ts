import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { mood_score, stress_score, sleep_score, note } = body;

  if (
    typeof mood_score !== "number" ||
    typeof stress_score !== "number" ||
    typeof sleep_score !== "number"
  ) {
    return NextResponse.json({ error: "Skor mood/stres/tidur wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("mood_entries")
    .insert([{ user_id: user.id, mood_score, stress_score, sleep_score, note }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}
