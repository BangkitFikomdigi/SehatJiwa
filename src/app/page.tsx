"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Bot,
  BookOpen,
  ClipboardCheck,
  Lock,
  LineChart,
  Smartphone,
  HeartPulse,
  ArrowRight,
  UserPlus,
  MousePointerClick,
  Sparkles,
  TrendingUp,
  Brain,
  Leaf,
  Heart,
  ShieldCheck,
} from "lucide-react";

const whyItems = [
  { icon: Bot, title: "AI yang Empatik", desc: "AI kami dirancang untuk mendengarkan dan merespons dengan cara yang hangat dan mendukung.", from: "from-blue-500", to: "to-indigo-500", glow: "rgba(59,130,246,0.45)" },
  { icon: LineChart, title: "Pantau Perkembangan", desc: "Lihat tren mood dan kesehatan mentalmu dari waktu ke waktu dengan grafik yang mudah dipahami.", from: "from-emerald-500", to: "to-teal-500", glow: "rgba(16,185,129,0.45)" },
  { icon: BookOpen, title: "Edukasi Terpercaya", desc: "Artikel dan video dari para ahli psikologi yang sudah terverifikasi.", from: "from-amber-500", to: "to-orange-500", glow: "rgba(245,158,11,0.45)" },
  { icon: ClipboardCheck, title: "Screening Mandiri", desc: "Lakukan tes PHQ-9, GAD-7, dan lainnya untuk memahami kondisi mentalmu.", from: "from-violet-500", to: "to-purple-500", glow: "rgba(139,92,246,0.45)" },
  { icon: Lock, title: "Privasi Terjaga", desc: "Data pribadimu aman dan hanya kamu yang bisa mengaksesnya.", from: "from-rose-500", to: "to-pink-500", glow: "rgba(244,63,94,0.45)" },
  { icon: Smartphone, title: "Akses Kapan Saja", desc: "Buka di mana saja, kapan saja — di ponsel, tablet, atau desktop.", from: "from-cyan-500", to: "to-sky-500", glow: "rgba(6,182,212,0.45)" },
];

const team = [
  { photo: "/team/Upin.jpeg", initials: "A1", handle: "@banglundong", name: "Annas Khoirul Amri", role: "Frontend Developer", color: "bg-blue-600", from: "from-blue-500", to: "to-indigo-500" },
  { photo: "/team/ipin.jpeg", initials: "A2", handle: "@nama.anggota2", name: "Caesar Ryo Firza Suprapto", role: "Backend Developer", color: "bg-emerald-600", from: "from-emerald-500", to: "to-teal-500" },
  { photo: "/team/apin.jpeg", initials: "A3", handle: "@wawa.nwaa", name: "Nazwa Arifin", role: "Backend Developer", color: "bg-orange-500", from: "from-amber-500", to: "to-orange-500" },
  { photo: "/team/nana.jpeg", initials: "A4", handle: "@rchldrgn", name: "Shulha Diyana", role: "Frontend Developer", color: "bg-violet-600", from: "from-violet-500", to: "to-purple-500" },
];

const steps = [
  { num: "1", icon: UserPlus, title: "Daftar / Masuk", desc: "Buat akun atau login dengan email dan password." },
  { num: "2", icon: MousePointerClick, title: "Pilih Fitur", desc: "Pilih salah satu dari 4 fitur utama: AI, Diary, Library, atau Screening." },
  { num: "3", icon: Sparkles, title: "Mulai Gunakan", desc: "Chat dengan AI, tulis jurnal, baca artikel, atau ikuti tes screening." },
  { num: "4", icon: TrendingUp, title: "Pantau Perkembangan", desc: "Lihat riwayat dan perkembangan kesehatan mentalmu di dashboard." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const showcaseRef = useRef<HTMLElement>(null);
  const { scrollYProgress: showcaseProgress } = useScroll({
    target: showcaseRef,
    offset: ["start 90%", "center 40%"],
  });
  const showcaseMockupY = useTransform(showcaseProgress, [0, 1], [120, 0]);
  const showcaseMockupScale = useTransform(showcaseProgress, [0, 1], [0.9, 1]);
  const showcaseMockupRotateX = useTransform(showcaseProgress, [0, 1], [18, 0]);
  const showcaseHeadingY = useTransform(showcaseProgress, [0, 1], [40, 0]);
  const showcaseHeadingOpacity = useTransform(showcaseProgress, [0, 0.6], [0, 1]);
  const [moodRange, setMoodRange] = useState<"3bulan" | "30hari" | "7hari">("3bulan");

  const moodPaths: Record<string, { area: string; line: string; points: { x: number; y: number }[] }> = {
    "3bulan": {
      area: "M0,220 C80,220 100,120 180,120 C260,120 280,220 360,220 C440,220 460,60 540,60 C620,60 640,190 720,190 C760,190 780,150 800,150 L800,300 L0,300 Z",
      line: "M0,220 C80,220 100,120 180,120 C260,120 280,220 360,220 C440,220 460,60 540,60 C620,60 640,190 720,190 C760,190 780,150 800,150",
      points: [{ x: 0, y: 220 }, { x: 180, y: 120 }, { x: 360, y: 220 }, { x: 540, y: 60 }, { x: 720, y: 190 }, { x: 800, y: 150 }],
    },
    "30hari": {
      area: "M0,180 C60,150 100,90 160,90 C220,90 240,180 300,190 C380,200 420,80 500,70 C580,60 620,160 680,170 C730,178 770,120 800,110 L800,300 L0,300 Z",
      line: "M0,180 C60,150 100,90 160,90 C220,90 240,180 300,190 C380,200 420,80 500,70 C580,60 620,160 680,170 C730,178 770,120 800,110",
      points: [{ x: 0, y: 180 }, { x: 160, y: 90 }, { x: 300, y: 190 }, { x: 500, y: 70 }, { x: 680, y: 170 }, { x: 800, y: 110 }],
    },
    "7hari": {
      area: "M0,140 C50,160 90,60 150,60 C210,60 250,180 320,180 C400,180 440,40 520,40 C590,40 640,150 700,150 C740,150 770,90 800,90 L800,300 L0,300 Z",
      line: "M0,140 C50,160 90,60 150,60 C210,60 250,180 320,180 C400,180 440,40 520,40 C590,40 640,150 700,150 C740,150 770,90 800,90",
      points: [{ x: 0, y: 140 }, { x: 150, y: 60 }, { x: 320, y: 180 }, { x: 520, y: 40 }, { x: 700, y: 150 }, { x: 800, y: 90 }],
    },
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="w-full">
    <>
      {/* NAVBAR */}
      <div
        className={`sticky inset-x-0 z-50 transition-all duration-500 ease-out ${
          scrolled ? "top-4 px-4" : "top-0 px-0"
        }`}
      >
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.1 }}
          className={`mx-auto border bg-white/90 backdrop-blur-md transition-all duration-500 ease-out ${
            scrolled
              ? "max-w-6xl rounded-full border-primary/10 shadow-softLg"
              : "max-w-full rounded-none border-x-0 border-t-0 border-b-primary/10 shadow-none"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-6 py-3.5">

            {/* 1. BAGIAN KIRI: Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/" className="group flex items-center gap-2.5 text-4xl font-extrabold text-primary">
                <motion.span
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="relative flex items-center justify-center"
                >
                  <span className="absolute inset-0 rounded-full bg-primary/20 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Image src="/logo.png" alt="MindMe" width={44} height={44} className="relative h-11 w-11 drop-shadow-sm" priority />
                </motion.span>
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-[length:200%_auto] bg-clip-text text-transparent transition-[background-position] duration-500 group-hover:bg-[position:100%_center]">
                  Mind<span className="text-secondary">Me</span>
                </span>
              </Link>
            </motion.div>
            {/* 2. BAGIAN TENGAH: Menu Navigasi */}
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="hidden flex-1 items-center justify-center gap-8 md:flex"
            >
              <li>
                <a href="#tentang" className="relative rounded-full px-4 py-2 text-base font-medium text-ink transition-all duration-300 hover:bg-primary/10 hover:text-primary">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#kenapa" className="relative rounded-full px-4 py-2 text-base font-medium text-ink transition-all duration-300 hover:bg-primary/10 hover:text-primary">
                  Kenapa Kita
                </a>
              </li>
              <li>
                <a href="#cara" className="relative rounded-full px-4 py-2 text-base font-medium text-ink transition-all duration-300 hover:bg-primary/10 hover:text-primary">
                  Cara Penggunaan
                </a>
              </li>
              <li>
                <a href="#profil" className="relative rounded-full px-4 py-2 text-base font-medium text-ink transition-all duration-300 hover:bg-primary/10 hover:text-primary">
                  Profil
                </a>
              </li>
            </motion.ul>

            {/* 3. BAGIAN KANAN: Tombol Auth */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden items-center gap-6 md:flex"
            >
              <Link href="/login" className="text-sm font-medium text-ink transition-all duration-200 hover:scale-105 hover:text-primary">Masuk</Link>
              <Link href="/register">
                <Button size="sm" className="transition-transform duration-200 hover:scale-105 active:scale-95">Daftar</Button>
              </Link>
            </motion.div>

            {/* Tombol Daftar Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="md:hidden"
            >
              <Link href="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </motion.div>

          </div>
        </motion.nav>
      </div>

      {/* WRAPPER HERO dengan latar belakang grid */}
      <div className="relative overflow-hidden bg-white">
        {/* Pola grid latar belakang */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(37,99,235,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        {/* Glow lembut di belakang hero */}
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-5xl px-6 py-20 text-center"
      >
        <h1
          className="mx-auto mb-5 flex max-w-4xl flex-col gap-1 font-extrabold leading-[1.15] tracking-tight text-ink"
          style={{ fontSize: "clamp(1.85rem, 5.4vw, 3.75rem)" }}
        >
          <span className="block whitespace-nowrap">
            Kendalikan <span className="text-gradient">Kesehatan Mentalmu,</span>
          </span>
          <span className="block whitespace-nowrap">
            bersama <span className="text-gradient">MindMe.</span>
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-ink-muted">
          Pendamping setia untuk perjalanan hidup sehatmu. Ditemani AI empatik,
          jurnal harian, dan tes screening untuk kesehatan mental yang lebih baik.
        </p>

        {/* AI Chat Showcase Card */}
<motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="relative mx-auto max-w-3xl w-full"
>
          {/* Glow gradien di belakang kartu */}
          <div className="absolute -inset-1.5 rounded-[30px] bg-gradient-to-r from-primary via-secondary to-primary opacity-30 blur-xl" />

          <div className="relative rounded-3xl border border-primary/10 bg-white/80 p-2 shadow-softLg backdrop-blur-xl">
            <div className="rounded-2xl border border-primary/10 bg-white px-6 py-6 text-left sm:px-7 sm:py-7">
              {/* Header mini "percakapan" */}
              <div className="mb-5 flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">MindAI</p>
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Siap mendengarkanmu
                  </p>
                </div>
              </div>

              {/* Bubble contoh respons singkat */}
              <div className="mb-4 max-w-[85%] rounded-2xl rounded-tl-sm bg-primary-bg px-4 py-3 text-sm text-ink-muted">
                Halo! Ceritakan apa yang kamu rasakan hari ini, aku di sini untuk membantu. 💙
              </div>

              {/* Input chat ala aplikasi pesan */}
              <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-white px-2 py-2 shadow-sm transition-colors focus-within:border-primary/40 sm:gap-3 sm:px-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="flex-1 truncate text-sm text-ink-muted/80 sm:text-base">
                  Tanya tentang mood, stres, atau kesehatan mentalmu&hellip;
                </p>
                <Link href="/register">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md transition-transform hover:scale-110 hover:shadow-lg">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="rounded-full">Mulai Sekarang</Button>
          </Link>
          <a href="#tentang">
            <Button size="lg" variant="outline" className="rounded-full">Pelajari Lebih</Button>
          </a>
        </div>
      </motion.section>
      </div>

      {/* SHOWCASE: Terus Pantau Kesehatan Mentalmu */}
      <section ref={showcaseRef} className="relative overflow-hidden bg-white px-6 pb-24 pt-4" style={{ perspective: 1200 }}>
        <motion.div
          style={{ y: showcaseHeadingY, opacity: showcaseHeadingOpacity }}
          className="mx-auto mb-6 max-w-3xl text-center"
        >
          <h2 className="text-lg font-bold text-ink sm:text-xl">
            Terus pantau kesehatan mentalmu dengan
          </h2>
          <p className="mt-1 text-4xl font-extrabold leading-none text-gradient sm:text-5xl md:text-6xl">
            MindMe
          </p>
        </motion.div>

        <motion.div
          style={{
            y: showcaseMockupY,
            scale: showcaseMockupScale,
            rotateX: showcaseMockupRotateX,
            transformPerspective: 1200,
          }}
          className="group relative mx-auto max-w-6xl"
        >
          {/* Glow di belakang frame, menyala saat hover */}
          <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />

          {/* Frame browser gelap */}
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-[#1a1d21] p-2.5 shadow-softLg transition-shadow duration-500 group-hover:shadow-2xl sm:p-4">
            {/* Bar browser */}
            <div className="flex items-center gap-3 rounded-t-xl px-4 py-3.5 sm:px-5">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-3.5 w-3.5 rounded-full bg-white/20" />
                <span className="h-3.5 w-3.5 rounded-full bg-white/20" />
              </div>
              <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2">
                <Lock className="h-4 w-4 text-white/60" />
                <span className="text-sm font-medium text-white/70">mindme.app/dashboard</span>
              </div>
              <div className="hidden gap-3 text-white/50 sm:flex">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            {/* Konten dashboard */}
            <div className="rounded-2xl bg-primary-bg px-6 py-4 sm:px-10 sm:py-6">
              <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-ink sm:text-2xl">Tren Mood Harian</h3>
                  <p className="text-sm text-ink-muted sm:text-base">
                    Rata-rata mood-mu selama{" "}
                    {moodRange === "3bulan" ? "3 bulan" : moodRange === "30hari" ? "30 hari" : "7 hari"} terakhir
                  </p>
                </div>
                <div className="flex gap-1.5 rounded-full bg-white p-1.5 shadow-sm">
                  {([
                    { key: "3bulan", label: "3 Bulan" },
                    { key: "30hari", label: "30 Hari" },
                    { key: "7hari", label: "7 Hari" },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setMoodRange(tab.key)}
                      className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                        moodRange === tab.key ? "text-white" : "text-ink-muted hover:text-primary"
                      }`}
                    >
                      {moodRange === tab.key && (
                        <motion.span
                          layoutId="moodTabActive"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grafik gelombang SVG interaktif */}
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-white sm:h-56">
                <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Garis grid horizontal */}
                  {[60, 120, 180, 240].map((y) => (
                    <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  ))}
                  <motion.path
                    key={`area-${moodRange}`}
                    d={moodPaths[moodRange].area}
                    fill="url(#moodGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    key={`line-${moodRange}`}
                    d={moodPaths[moodRange].line}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  {/* Titik data interaktif dengan tooltip */}
                  {moodPaths[moodRange].points.map((pt, i) => (
                    <g key={`${moodRange}-${i}`} className="group/point cursor-pointer">
                      <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="6"
                        fill="white"
                        stroke="#2563eb"
                        strokeWidth="3"
                        className="opacity-0 transition-opacity duration-200 group-hover/point:opacity-100"
                      />
                      <g className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover/point:opacity-100">
                        <rect x={pt.x - 26} y={pt.y - 42} width="52" height="26" rx="8" fill="#0a1a2e" />
                        <text x={pt.x} y={pt.y - 24} textAnchor="middle" fontSize="13" fill="white" fontWeight="600">
                          {Math.round(100 - (pt.y / 300) * 100)}%
                        </text>
                      </g>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="relative overflow-hidden bg-[#f4f6f8] py-24">
        {/* Kartu-kartu mockup UI tersebar di latar belakang */}
        <div className="absolute inset-0 opacity-90">
          {/* Kartu Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
            className="pointer-events-auto absolute -left-6 top-6 hidden w-56 rotate-[-6deg] cursor-pointer rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:block"
          >
            <p className="mb-3 text-xs font-bold text-primary">Masuk akun MindMe</p>
            <div className="mb-2 h-2 w-3/4 rounded-full bg-slate-100" />
            <div className="mb-3 h-2 w-1/2 rounded-full bg-slate-100" />
            <div className="h-7 w-full rounded-full bg-primary/90" />
          </motion.div>

          {/* Kartu Chat AI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 } }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
            className="pointer-events-auto absolute right-2 top-2 w-64 rotate-[5deg] cursor-pointer rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:right-10 sm:top-8"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                <Bot className="h-3.5 w-3.5 text-white" />
              </span>
              <div className="h-2 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="mb-2 h-2 w-full rounded-full bg-slate-100" />
            <div className="h-2 w-2/3 rounded-full bg-slate-100" />
          </motion.div>

          {/* Kartu Screening */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -9, 0] }}
            transition={{ y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 } }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
            className="pointer-events-auto absolute bottom-8 left-4 hidden w-60 rotate-[4deg] cursor-pointer rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:block"
          >
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-ink">
              <ClipboardCheck className="h-3.5 w-3.5 text-primary" /> Tes Screening
            </p>
            <div className="mb-2 h-2 w-full rounded-full bg-slate-100" />
            <div className="mb-2 h-2 w-5/6 rounded-full bg-slate-100" />
            <div className="h-6 w-24 rounded-full bg-primary/90" />
          </motion.div>

          {/* Kartu Mood Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -7, 0] }}
            transition={{ y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
            whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
            className="pointer-events-auto absolute bottom-2 right-6 w-60 rotate-[-4deg] cursor-pointer rounded-2xl bg-white p-4 shadow-lg transition-shadow duration-300 hover:shadow-2xl sm:right-16"
          >
            <p className="mb-2 text-xs font-bold text-ink">Mood Harian</p>
            <svg viewBox="0 0 200 60" className="h-12 w-full">
              <path d="M0,45 C30,45 40,15 70,15 C100,15 110,50 140,50 C165,50 175,25 200,25" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* Vignette putih supaya teks tetap terbaca */}
        <div className="pointer-events-none absolute inset-0 bg-[#f4f6f8]/60" />

        {/* Teks besar menimpa collage */}
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold leading-tight text-primary sm:text-5xl md:text-6xl"
          >
            MindMe hadir sebagai teman setia dalam perjalanan kesehatan mentalmu,
            membantu kamu memahami diri dan mencapai kesejahteraan dengan lebih baik.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-sm italic text-ink-muted sm:text-base"
          >
            <strong>MindMe bukan pengganti profesional medis. Jika darurat, hubungi psikolog terdekat.</strong>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8"
          >
            <Link href="/register">
              <Button size="lg" className="rounded-full shadow-md transition-transform duration-200 hover:scale-105 active:scale-95">
                Mulai Perjalananmu <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* KENAPA */}
        <section id="kenapa" className="relative overflow-hidden bg-gradient-to-br from-primary via-[#3fa9db] to-secondary py-20">
          {/* Pola latar belakang samar untuk kedalaman */}
          <div className="pointer-events-none absolute inset-0 opacity-30 blur-3xl">
            <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-white/30" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-white/20" />
          </div>

          <div className="mx-auto max-w-6xl px-6 relative">
            <div className="mb-14 text-center">
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Kenapa MindMe?</h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
                Enam alasan MindMe jadi teman terbaik untuk kesehatan mentalmu.
              </p>
              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-white/60" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 120,
                    delay: i * 0.1, // Stagger delay per item
                  }}
                  style={{ ["--glow" as string]: item.glow }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-7 shadow-lg backdrop-blur-sm transition-shadow hover:border-white hover:shadow-[0_25px_50px_-12px_var(--glow)]"
                >
                  {/* Garis aksen gradien di bagian atas kartu */}
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.from} ${item.to} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Glow lembut di pojok saat hover */}
                  <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.from} ${item.to} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

                  {/* Container Ikon */}
                  <div
                    className={`relative mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.from} ${item.to} text-white shadow-md transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-xl`}
                  >
                    <item.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h4 className="mb-2.5 text-lg font-bold text-ink">{item.title}</h4>
                  <p className="text-sm text-ink-muted/90 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* CARA PENGGUNAAN */}
      <section id="cara" className="relative mx-auto max-w-6xl overflow-hidden px-6 py-20">
        {/* Aksen dekoratif latar belakang */}
        <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h2 className="mb-3 text-center text-3xl font-bold text-ink sm:text-4xl">Cara Penggunaan</h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-ink-muted">
            Ikuti 4 langkah ini untuk mulai menggunakan Website MindMe.
          </p>
        </motion.div>

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", damping: 18, stiffness: 120, delay: i * 0.12 }}
              className="group relative flex flex-col items-center rounded-2xl border border-primary/10 bg-white px-5 py-8 text-center shadow-sm transition-shadow hover:border-primary/30 hover:shadow-[0_20px_45px_-15px_rgba(74,144,226,0.4)]"
            >
              {/* Ikon utama dengan cincin gradien */}
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <s.icon className="h-7 w-7" />
              </div>

              <h4 className="mb-2 font-bold text-ink">{s.title}</h4>
              <p className="text-sm leading-relaxed text-ink-muted">{s.desc}</p>

              {/* Panah penghubung (desktop, antar-card) */}
              {i < steps.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-12 z-10 hidden -translate-y-1/2 lg:block"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  whileHover={{ scale: 1.25 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-primary/15">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profil pembuat */}
      <section id="profil" className="relative overflow-hidden px-6 pb-20 pt-4">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            <span className="text-gradient">Profil</span>
          </h2>
          <p className="text-ink-muted">
            Kami membuat MindMe dengan sepenuh hati sebagai proyek mahasiswa Informatika.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 mx-auto mt-14 flex max-w-3xl items-center justify-center"
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 16, stiffness: 130, delay: i * 0.08 }}
              style={{ zIndex: i }}
              className={`group relative flex flex-col items-center transition-all duration-300 hover:z-30 ${i === 0 ? "" : "-ml-5 sm:-ml-6"}`}
            >
              {/* Tooltip profil (muncul saat hover) */}
              <div
                className={`pointer-events-none absolute -top-3 left-1/2 z-20 w-48 -translate-x-1/2 -translate-y-full scale-90 rounded-2xl ${member.color} px-4 py-3 text-left text-white opacity-0 shadow-xl transition-all duration-300 ease-out group-hover:-translate-y-[calc(100%+14px)] group-hover:scale-100 group-hover:opacity-100`}
              >
                <p className="text-[11px] font-medium text-white/75">{member.handle}</p>
                <p className="text-sm font-bold leading-snug">{member.name}</p>
                <p className="text-xs text-white/85">{member.role}</p>
                {/* Ekor tooltip */}
                <span className={`absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 ${member.color}`} />
              </div>

              {/* Avatar */}
              <div
                className={`relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${member.from} ${member.to} text-base font-bold text-white shadow-md ring-4 ring-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl sm:h-20 sm:w-20 sm:text-lg`}
              >
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  member.initials
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-primary-lighter bg-white py-8 text-center text-sm text-ink-muted">
        <p>MindMe &copy; 2026 — Informatika Angkatan 2024 </p>
        <p className="mt-1 text-xs">
          AI ini bukan menggantikan profesional medis.tetapi mempermudahkan dalam ilmu medis.
        </p>
      </footer>
    </>
    </main>
  );
}