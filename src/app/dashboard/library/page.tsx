"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Library, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/library-data";

export default function LibraryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    fetch("/api/library")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];
  const filtered =
    category === "Semua" ? articles : articles.filter((a) => a.category === category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <Library className="h-6 w-6 text-primary" /> Perpustakaan Psikologi
        </h1>
        <p className="text-sm text-ink-muted">Artikel terverifikasi seputar kesehatan mental.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "bg-primary text-white"
                : "bg-white text-ink-muted hover:bg-primary-bg"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Memuat artikel...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full cursor-pointer hover:-translate-y-1 hover:shadow-softLg">
                <div className="mb-2 text-3xl">{a.emoji}</div>
                <Badge className="mb-2">{a.category}</Badge>
                <h3 className="mb-2 font-bold leading-snug">{a.title}</h3>
                <p className="mb-3 text-sm text-ink-muted">{a.excerpt}</p>
                <div className="flex items-center gap-1 text-xs text-ink-muted">
                  <Clock className="h-3.5 w-3.5" /> {a.readTime} baca
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
