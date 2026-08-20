"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Bot,
  BookOpen,
  ClipboardCheck,
  Lock,
  LineChart,
  Smartphone,
  Leaf,
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
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <Leaf className="h-6 w-6" /> Sehat<span className="text-secondary">Jiwa</span>
          </Link>
          <ul className="hidden items-center gap-6 md:flex">
            <li><a href="#tentang" className="text-sm font-medium text-ink hover:text-primary">Tentang</a></li>
            <li><a href="#kenapa" className="text-sm font-medium text-ink hover:text-primary">Kenapa Kita</a></li>
            <li><a href="#cara" className="text-sm font-medium text-ink hover:text-primary">Cara Penggunaan</a></li>
            <li><Link href="/login" className="text-sm font-medium text-ink hover:text-primary">Masuk</Link></li>
            <li><Link href="/register"><Button size="sm">Daftar</Button></Link></li>
          </ul>
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
          dengan <span className="text-gradient">SehatJiwa</span> 🌱
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-ink-muted">
          Temani harimu dengan AI, catat mood, baca artikel psikologi, dan
          lakukan tes screening — semua dalam satu platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg">✨ Mulai Sekarang</Button>
          </Link>
          <a href="#tentang">
            <Button size="lg" variant="outline">Pelajari Lebih</Button>
          </a>
        </div>
      </motion.section>

      {/* TENTANG */}
      <section id="tentang" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold text-ink">🧠 Tentang SehatJiwa</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-ink-muted">
          Platform kesehatan mental all-in-one yang dirancang untuk membantumu
          memahami dan menjaga kesehatan mental dengan cara yang mudah dan personal.
        </p>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">🌱 Mental Health untuk Semua</h3>
            <p className="text-ink-muted">
              SehatJiwa hadir sebagai teman setia dalam perjalanan kesehatan
              mentalmu. Kami percaya setiap orang berhak mendapatkan akses ke
              alat dan informasi yang membantu mereka merasa lebih baik.
            </p>
            <p className="text-ink-muted">
              Dengan kombinasi <strong>kecerdasan buatan (AI)</strong>,{" "}
              <strong>jurnal harian</strong>, <strong>perpustakaan edukasi</strong>,
              dan <strong>tes screening</strong>, kami ingin membuat perawatan
              kesehatan mental lebih mudah diakses oleh semua orang.
            </p>
            <p className="text-sm italic text-ink-muted">
              ⚠️ SehatJiwa bukan pengganti profesional medis. Jika darurat,
              hubungi psikolog terdekat.
            </p>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl bg-primary-lighter text-6xl">
            🌿🧠
          </div>
        </div>
      </section>

      {/* KENAPA */}
      <section id="kenapa" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold text-ink">❓ Kenapa SehatJiwa?</h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-ink-muted">
            Ada banyak alasan kenapa kamu harus memilih SehatJiwa sebagai teman
            perjalanan kesehatan mentalmu.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="rounded-xl border border-primary-lighter bg-primary-bg p-6 transition-transform hover:-translate-y-1"
              >
                <item.icon className="mb-3 h-8 w-8 text-primary" />
                <h4 className="mb-1 font-bold">{item.title}</h4>
                <p className="text-sm text-ink-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CARA PENGGUNAAN */}
      <section id="cara" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold text-ink">📖 Cara Penggunaan</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-ink-muted">
          Ikuti 4 langkah mudah ini untuk mulai menggunakan SehatJiwa.
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
        <div className="rounded-xl bg-gradient-to-br from-primary to-secondary px-8 py-12 text-center text-white shadow-softLg">
          <h2 className="mb-2 text-3xl font-bold">🎯 Siap Jaga Kesehatan Mentalmu?</h2>
          <p className="mb-6 opacity-90">Mulai sekarang dan rasakan perbedaannya. Gratis dan mudah!</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-primary-bg">
              🚀 Masuk / Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-primary-lighter bg-white py-8 text-center text-sm text-ink-muted">
        <p>🌿 SehatJiwa &copy; 2026 — Dibuat dengan ❤️ untuk kesehatan mentalmu.</p>
        <p className="mt-1 text-xs">
          ⚠️ AI ini bukan pengganti profesional medis. Jika darurat, hubungi psikolog terdekat.
        </p>
      </footer>
    </>
  );
}
