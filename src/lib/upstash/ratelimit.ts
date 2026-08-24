import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Batasi setiap pengguna maksimal 15 pesan AI per menit, supaya biaya
// Google Cloud AI (Gemini) terkontrol dan mencegah spam.
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
  prefix: "mindme:ai",
});

// Cache ringan untuk konten Perpustakaan Psikologi (artikel) selama 1 jam.
export async function getCached<T>(key: string): Promise<T | null> {
  return (await redis.get<T>(key)) ?? null;
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds = 3600
) {
  await redis.set(key, value, { ex: ttlSeconds });
}
