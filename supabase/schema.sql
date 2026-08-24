-- ============================================================
-- SehatJiwa — Supabase Schema
-- Jalankan file ini di Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- ---------- MOOD_ENTRIES (Diary Mood) ----------
create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mood_score smallint not null check (mood_score between 0 and 10),
  stress_score smallint not null check (stress_score between 0 and 10),
  sleep_score smallint not null check (sleep_score between 0 and 10),
  note text,
  created_at timestamptz not null default now()
);

alter table public.mood_entries enable row level security;

create policy "Users can view their own mood entries"
  on public.mood_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mood entries"
  on public.mood_entries for insert
  with check (auth.uid() = user_id);

-- ---------- AI_MESSAGES (riwayat chat AI) ----------
create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'model')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_messages enable row level security;

create policy "Users can view their own ai messages"
  on public.ai_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ai messages"
  on public.ai_messages for insert
  with check (auth.uid() = user_id);

-- ---------- SCREENING_RESULTS (PHQ-9 / GAD-7) ----------
create table if not exists public.screening_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  test_id text not null check (test_id in ('phq9', 'gad7')),
  total_score smallint not null,
  severity text not null,
  created_at timestamptz not null default now()
);

alter table public.screening_results enable row level security;

create policy "Users can view their own screening results"
  on public.screening_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own screening results"
  on public.screening_results for insert
  with check (auth.uid() = user_id);

-- ---------- Index untuk query dashboard yang sering dipakai ----------
create index if not exists mood_entries_user_created_idx
  on public.mood_entries (user_id, created_at desc);

create index if not exists screening_results_user_created_idx
  on public.screening_results (user_id, created_at desc);
