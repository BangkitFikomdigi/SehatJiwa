"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Library, Share2, ChevronDown, Tag, Search, BookOpen } from "lucide-react";
import type { Article } from "@/lib/library-data";

export default function LibraryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];
  
  const filtered = articles.filter((a) => {
    const matchesCategory = category === "Semua" ? true : a.category === category;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Library className="h-6 w-6 text-purple-600" /> Perpustakaan Psikologi
          </h1>
          <p className="mt-1 text-sm text-slate-500">Artikel terverifikasi seputar kesehatan mental.</p>
        </div>

        {/* INPUT SEARCH */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      {/* BARIS KATEGORI */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                category === c
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-10 text-xs font-semibold text-purple-700 shadow-sm outline-none transition-all hover:border-purple-300 focus:ring-2 focus:ring-purple-200 cursor-pointer sm:w-auto"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "Semua" ? "Semua Kategori" : c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-purple-600" />
        </div>
      </div>

      {/* GRID BUKU / ARTIKEL */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-slate-400">
          Memuat artikel perpustakaan...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-slate-400">
          <p className="text-sm font-medium">Artikel tidak ditemukan.</p>
          <p className="mt-1 text-xs text-slate-400">Coba kata kunci atau filter kategori lain.</p>
        </div>
      ) : (
        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* CARD BUKU */}
                <div className="group flex h-full gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-purple-100 hover:shadow-md">
                  
                  {/* Kiri: Cover Buku (Tanpa Emote) */}
                  <div className="relative flex h-36 w-28 shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-2 text-white shadow-inner sm:h-40 sm:w-32">
                    <BookOpen className="h-10 w-10 text-purple-300 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Kanan: Detail Informasi Buku */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-purple-700 sm:text-lg">
                        {a.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:line-clamp-3 sm:text-sm">
                        {a.excerpt}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700">
                          <Tag className="h-3 w-3 text-purple-600" />
                          {a.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-200">
                          Baca Artikel
                        </button>
                        <button className="p-1.5 text-slate-400 transition-colors hover:text-purple-600 sm:hidden" title="Bagikan">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}