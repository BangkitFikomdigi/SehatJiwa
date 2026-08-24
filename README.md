# 🌿 SehatJiwa — Platform Kesehatan Mental

Website psikologi fullstack dengan alur:

```
Landing Page → Login/Register → Dashboard (4 menu)
                                   ├─ 🤖 AI (chat empatik)
                                   ├─ 📖 Diary Mood
                                   ├─ 📚 Perpustakaan Psikologi
                                   └─ 🧪 Tes Screening (PHQ-9 & GAD-7)
```

Desain mengikuti tema biru pada 2 mockup HTML yang diberikan (SehatJiwa —
Landing Page & Dashboard Blue Theme), dibangun ulang jadi aplikasi Next.js
production-ready.

## Tech Stack

| Tool | Fungsi di project ini |
|---|---|
| **Next.js 14 (App Router)** | Framework fullstack: routing, Server Components, API Routes |
| **React 18** | UI library |
| **Tailwind CSS** | Styling, mengikuti token warna dari mockup (`primary #2563eb`, dst) |
| **Shadcn UI (pola)** | Komponen `Button`, `Card`, `Input`, dsb di `src/components/ui` |
| **Supabase** | Auth (email/password) + Database Postgres (diary, chat history, hasil screening) + RLS |
| **Upstash** | Redis untuk rate-limit chat AI (15 pesan/menit) & cache artikel Perpustakaan |
| **Google Cloud AI (Gemini API)** | Model `gemini-1.5-flash` untuk fitur "Kawan SehatJiwa" (AI chat empatik) |
| **Motion (Framer Motion)** | Animasi fade-in, transisi chat, hover card |

## 1. Instalasi

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` dengan kredensial kamu (lihat bagian di bawah).

## 2. Setup Supabase

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor** → jalankan isi file `supabase/schema.sql` (membuat tabel
   `mood_entries`, `ai_messages`, `screening_results` + Row Level Security).
3. Buka **Project Settings → API**, salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (opsional, untuk operasi admin)
4. Di **Authentication → Providers**, pastikan Email provider aktif.

## 3. Setup Upstash

1. Buat database Redis baru di https://upstash.com
2. Salin `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` dari dashboard
   ke `.env.local`.

## 4. Setup Google Cloud AI (Gemini)

1. Buat API key di https://aistudio.google.com/apikey (bagian dari Google Cloud AI)
2. Isi `GOOGLE_AI_API_KEY` di `.env.local`.

## 5. Jalankan secara lokal

```bash
npm run dev
```

Buka http://localhost:3000

## Struktur Folder

```
src/
  app/
    page.tsx                 → Landing Page
    login/page.tsx           → Login (Supabase Auth)
    register/page.tsx        → Register (Supabase Auth)
    dashboard/
      layout.tsx              → Sidebar + auth guard
      page.tsx                → Overview (statistik dari Supabase)
      ai/page.tsx              → Chat AI (Gemini + Upstash rate-limit)
      diary/page.tsx           → Diary Mood + grafik tren
      library/page.tsx         → Perpustakaan Psikologi (cache Upstash)
      screening/page.tsx       → PHQ-9 & GAD-7
    api/
      ai/chat/route.ts         → Endpoint chat AI
      diary/route.ts           → CRUD mood entries
      screening/route.ts       → Simpan hasil tes
      library/route.ts         → Artikel + cache
  components/
    ui/                        → Button, Card, Input, dst (pola Shadcn)
    dashboard/sidebar.tsx       → Sidebar 4 menu
  lib/
    supabase/                  → client/server/middleware
    upstash/                   → redis client + rate limiter + cache
    ai/gemini.ts                → wrapper Google Generative AI
  middleware.ts                 → proteksi route /dashboard/*
supabase/schema.sql              → skema database + RLS
```

## Deploy

Direkomendasikan deploy ke **Vercel** (dibuat oleh tim Next.js):

```bash
npm i -g vercel
vercel
```

Jangan lupa set semua environment variable dari `.env.example` di dashboard
Vercel sebelum deploy production.

## Catatan Keamanan & Etik

⚠️ SehatJiwa (termasuk fitur AI dan Tes Screening) **bukan pengganti**
diagnosis atau perawatan profesional. Untuk situasi darurat, hubungi Layanan
Sejiwa **119 ext. 8** atau psikolog/psikiater terdekat.
