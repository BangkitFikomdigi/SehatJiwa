import { NextResponse } from "next/server";
import { getCached, setCached } from "@/lib/upstash/ratelimit";
import { articles } from "@/lib/library-data";

export async function GET() {
  const cacheKey = "library:articles";

  const cached = await getCached<typeof articles>(cacheKey);
  if (cached) {
    return NextResponse.json({ articles: cached, source: "cache (Upstash)" });
  }

  // Simulasikan sumber data (mis. tabel Supabase `articles`), lalu cache 1 jam.
  await setCached(cacheKey, articles, 3600);
  return NextResponse.json({ articles, source: "origin" });
}
