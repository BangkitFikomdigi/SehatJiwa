import { Redis } from "@upstash/redis";

// Instance Redis Upstash — dipakai untuk cache & rate limiting.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
