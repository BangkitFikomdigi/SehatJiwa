"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
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
  { photo: "/team/Upin.jpeg", initials: "A1", handle: "@nama.anggota1", name: "Nama Anggota 1", role: "Fullstack Developer", color: "bg-blue-600", from: "from-blue-500", to: "to-indigo-500" },
  { photo: "/team/ipin.jpeg", initials: "A2", handle: "@nama.anggota2", name: "Nama Anggota 2", role: "UI/UX Designer", color: "bg-emerald-600", from: "from-emerald-500", to: "to-teal-500" },
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
              <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary">
                <Image src="/logo.png" alt="MindMe" width={32} height={32} className="h-8 w-8" priority />
                Mind<span className="text-secondary">Me</span>
              </Link>
            </motion.div>
            {/* 2. BAGIAN TENGAH: Menu Navigasi */}
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="hidden flex-1 items-center justify-center gap-8 md:flex"
            >
              <li><a href="#tentang" className="text-sm font-medium text-ink transition-colors hover:text-primary">Tentang</a></li>
              <li><a href="#kenapa" className="text-sm font-medium text-ink transition-colors hover:text-primary">Kenapa Kita</a></li>
              <li><a href="#cara" className="text-sm font-medium text-ink transition-colors hover:text-primary">Cara Penggunaan</a></li>
              <li><a href="#profil" className="text-sm font-medium text-ink transition-colors hover:text-primary">Profil</a></li>
            </motion.ul>

            {/* 3. BAGIAN KANAN: Tombol Auth */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden items-center gap-6 md:flex"
            >
              <Link href="/login" className="text-sm font-medium text-ink transition-colors hover:text-primary">Masuk</Link>
              <Link href="/register"><Button size="sm">Daftar</Button></Link>
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

        {/* Kartu showcase AI chat */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-2xl"
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

      {/* TENTANG */}
      <section id="tentang" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold text-ink">Tentang MindMe</h2>
        <p className="mx-auto mb-10 max-w-xl text-center  text-ink-muted">
          Platform kesehatan mental all-in-one yang dirancang untuk membantumu
          memahami dan menjaga kesehatan mental dengan cara yang mudah dan personal.
        </p>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Mental Health untuk Semua</h3>
            <p className="text-sm italic text-ink-muted">
              <strong>Mind Me</strong> hadir sebagai teman setia dalam perjalanan kesehatan
              mentalmu. Kami percaya setiap orang berhak mendapatkan akses ke
              alat dan informasi yang membantu mereka merasa lebih baik.
              Dengan kombinasi kecerdasan buatan (AI),{" "}
              jurnal harian,perpustakaan edukasi,
              dan tes screening,kami ingin membuat perawatan
              kesehatan mental lebih mudah diakses oleh semua orang.
            </p>
            <p className="text-sm italic text-ink-muted">
              <strong>MindMe bukan pengganti profesional medis. Jika darurat,
              hubungi psikolog terdekat.</strong>
            </p>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl bg-primary-lighter text-6xl">
            🌿🧠
          </div>
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

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 18, stiffness: 100 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#3fa9db] to-secondary px-8 py-14 text-center text-white shadow-softLg sm:py-16"
        >
          {/* Dekorasi blob blur */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

          {/* Ikon dekoratif */}
          <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <HeartPulse className="h-7 w-7 text-white" />
          </div>

          <h2 className="relative mb-2 text-3xl font-extrabold sm:text-4xl">
            Siap Membantu Menjaga Kesehatan Mentalmu?
          </h2>
          <p className="relative mb-8 text-base opacity-90 sm:text-lg">
            daftarkan akunmu sekarang. Gratis dan mudah!
          </p>

          <Link href="/register" className="relative inline-block">
            <Button
              size="lg"
              className="group gap-2 rounded-full bg-white px-8 py-6 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xl"
            >
              Masuk / Daftar Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
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
