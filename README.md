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
| **PostgreSQL (local)** | Database (diary, chat history, hasil screening) |
| **Drizzle ORM** | Query builder & migration ke Postgres, type-safe |
| **Better Auth** | Auth (email/password), session disimpan di Postgres |
| **Upstash** | Redis untuk rate-limit chat AI (15 pesan/menit) & cache artikel Perpustakaan |
| **Google Cloud AI (Gemini API)** | Model `gemini-1.5-flash` untuk fitur "Kawan SehatJiwa" (AI chat empatik) |
| **Motion (Framer Motion)** | Animasi fade-in, transisi chat, hover card |

## 1. Instalasi

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` dengan kredensial kamu (lihat bagian di bawah).

## 2. Setup PostgreSQL local

Paling gampang pakai Docker (kalau belum punya Postgres native ter-install):

```bash
docker compose up -d
```

Ini akan menjalankan Postgres di `localhost:5432` dengan user/password/db
`sehatjiwa` (lihat `docker-compose.yml`). Kalau kamu sudah punya Postgres
sendiri, cukup sesuaikan `DATABASE_URL` di `.env.local`.

Generate secret untuk Better Auth:

```bash
openssl rand -base64 32
```

Isi hasilnya ke `BETTER_AUTH_SECRET` di `.env.local`.

Setelah `DATABASE_URL` terisi, push schema Drizzle ke database (tabel
`user`, `session`, `account`, `verification` dari Better Auth + tabel
aplikasi `mood_entries`, `ai_messages`, `screening_results`):

```bash
npm run db:push
```

(Untuk workflow migration file berversi, pakai `npm run db:generate` lalu
terapkan lewat migrator Drizzle. `db:push` cukup untuk dev cepat.)

Cek isi database kapan saja dengan Drizzle Studio:

```bash
npm run db:studio
```

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
      auth/[...all]/route.ts    → Handler Better Auth (sign-in, sign-up, session, dst)
      ai/chat/route.ts         → Endpoint chat AI
      diary/route.ts           → CRUD mood entries
      screening/route.ts       → Simpan hasil tes
      library/route.ts         → Artikel + cache
  components/
    ui/                        → Button, Card, Input, dst (pola Shadcn)
    dashboard/sidebar.tsx       → Sidebar 4 menu
  lib/
    db/schema.ts                → Skema Drizzle (tabel Better Auth + tabel aplikasi)
    db/index.ts                  → Koneksi Drizzle ke Postgres
    auth.ts                      → Konfigurasi Better Auth (server)
    auth-client.ts                → Client Better Auth (dipakai di komponen)
    upstash/                   → redis client + rate limiter + cache
    ai/gemini.ts                → wrapper Google Generative AI
  middleware.ts                 → proteksi route /dashboard/* (cek session cookie)
drizzle.config.ts                → konfigurasi drizzle-kit
docker-compose.yml                → Postgres local untuk dev
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
