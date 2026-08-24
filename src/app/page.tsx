"use client";

import Link from "next/link";
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
} from "lucide-react";

const whyItems = [
  { icon: Bot, title: "AI yang Empatik", desc: "AI kami dirancang untuk mendengarkan dan merespons dengan cara yang hangat dan mendukung." },
  { icon: LineChart, title: "Pantau Perkembangan", desc: "Lihat tren mood dan kesehatan mentalmu dari waktu ke waktu dengan grafik yang mudah dipahami." },
  { icon: BookOpen, title: "Edukasi Terpercaya", desc: "Artikel dan video dari para ahli psikologi yang sudah terverifikasi." },
  { icon: ClipboardCheck, title: "Screening Mandiri", desc: "Lakukan tes PHQ-9, GAD-7, dan lainnya untuk memahami kondisi mentalmu." },
  { icon: Lock, title: "Privasi Terjaga", desc: "Data pribadimu aman dan hanya kamu yang bisa mengaksesnya." },
  { icon: Smartphone, title: "Akses Kapan Saja", desc: "Buka di mana saja, kapan saja — di ponsel, tablet, atau desktop." },
];

const steps = [
  { num: "1", title: "Daftar / Masuk", desc: "Buat akun atau login dengan email dan password." },
  { num: "2", title: "Pilih Fitur", desc: "Pilih salah satu dari 4 fitur utama: AI, Diary, Library, atau Screening." },
  { num: "3", title: "Mulai Gunakan", desc: "Chat dengan AI, tulis jurnal, baca artikel, atau ikuti tes screening." },
  { num: "4", title: "Pantau Perkembangan", desc: "Lihat riwayat dan perkembangan kesehatan mentalmu di dashboard." },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden w-full">
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          
          {/* 1. BAGIAN KIRI: Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <Image src="/logo.png" alt="MindMe" width={32} height={32} className="h-8 w-8" priority />
            Mind<span className="text-secondary">Me</span>
          </Link>
          {/* 2. BAGIAN TENGAH: Menu Navigasi */}
          <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <li><a href="#tentang" className="text-sm font-medium text-ink hover:text-primary">Tentang</a></li>
            <li><a href="#kenapa" className="text-sm font-medium text-ink hover:text-primary">Kenapa Kita</a></li>
            <li><a href="#cara" className="text-sm font-medium text-ink hover:text-primary">Cara Penggunaan</a></li>
          </ul>

          {/* 3. BAGIAN KANAN: Tombol Auth */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/login" className="text-sm font-medium text-ink hover:text-primary">Masuk</Link>
            <Link href="/register"><Button size="sm">Daftar</Button></Link>
          </div>

          {/* Tombol Daftar Mobile */}
          <Link href="/register" className="md:hidden">
            <Button size="sm">Daftar</Button>
          </Link>
          
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-6 py-16 text-center"
      >
        <h1 className="mb-4 text-4xl font-extrabold leading-tight text-ink md:text-5xl">
          Jaga Kesehatan Mentalmu <br />
          dengan <span className="text-gradient">MindMe</span> 🌱
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-ink-muted">
          Temani harimu dengan AI, catat mood, baca artikel psikologi, dan
          lakukan tes screening — semua dalam satu platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="rounded-full">Mulai Sekarang</Button>
          </Link>
          <a href="#tentang">
            <Button size="lg" className="rounded-full">Pelajari Lebih</Button>
          </a>
        </div>
      </motion.section>

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
            <h2 className="mb-14 text-center text-4xl font-extrabold text-white sm:text-5xl">Kenapa MindMe?</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    scale: 1.04,
                    rotate: i % 2 === 0 ? -1.5 : 1.5,
                  }}
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 120,
                    delay: i * 0.1, // Stagger delay per item
                  }}
                  className={`group cursor-pointer rounded-lg border border-white/40 bg-white/95 p-7 shadow-lg backdrop-blur-sm transition-shadow relative hover:border-white ${
                    i % 3 === 0
                      ? "hover:shadow-[0_20px_45px_-10px_rgba(74,144,226,0.55)]"
                      : i % 3 === 1
                      ? "hover:shadow-[0_20px_45px_-10px_rgba(34,197,94,0.5)]"
                      : "hover:shadow-2xl"
                  }`}
                >
                  {/* Efek partikel kecil di sudut saat hover */}
                  <div className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Container Ikon */}
                  <div
                    className={`relative mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-lg ${
                      i % 3 === 0
                        ? "bg-primary/10 text-primary ring-1 ring-primary/15 group-hover:bg-primary group-hover:text-white group-hover:ring-primary"
                        : i % 3 === 1
                        ? "bg-secondary/15 text-secondary-dark ring-1 ring-secondary/20 group-hover:bg-secondary group-hover:text-white group-hover:ring-secondary"
                        : "border border-ink/10 bg-white text-ink ring-1 ring-ink/5 group-hover:bg-ink group-hover:text-white group-hover:ring-ink"
                    }`}
                  >
                    <item.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h4 className="mb-2.5 text-lg font-bold">{item.title}</h4>
                  <p className="text-sm text-ink-muted/90 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* CARA PENGGUNAAN */}
      <section id="cara" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold text-ink">Cara Penggunaan</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-ink-muted">
          Ikuti 4 langkah ini untuk mulai menggunakan Website MindMe.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {s.num}
              </div>
              <h4 className="mb-1 font-bold">{s.title}</h4>
              <p className="text-sm text-ink-muted">{s.desc}</p>
            </div>
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
