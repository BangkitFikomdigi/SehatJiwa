"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ClipboardCheck, ArrowLeft, Phone, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { tests, options, scoreResult, type TestId } from "@/lib/screening-data";

export default function ScreeningPage() {
  const [activeTest, setActiveTest] = useState<TestId | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ total: number; severity: ReturnType<typeof scoreResult> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedResultId, setSavedResultId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function startTest(id: TestId) {
    setActiveTest(id);
    setAnswers(new Array(tests[id].questions.length).fill(-1));
    setResult(null);
    setSavedResultId(null);
  }

  function answer(qIndex: number, value: number) {
    const next = [...answers];
    next[qIndex] = value;
    setAnswers(next);
  }

  async function submitTest() {
    if (!activeTest) return;
    if (answers.some((a) => a === -1)) {
      toast.error("Mohon jawab semua pertanyaan terlebih dahulu.");
      return;
    }
    const total = answers.reduce((a, b) => a + b, 0);
    const severity = scoreResult(activeTest, total);
    setResult({ total, severity });

    setSaving(true);
    const res = await fetch("/api/screening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_id: activeTest, total_score: total, severity: severity.label }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setSavedResultId(data.result?.id ?? null);
      toast.success("Hasil tersimpan di riwayatmu.");
    } else {
      toast.error("Gagal menyimpan hasil. Unduh PDF mungkin tidak tersedia.");
    }
  }

  async function downloadResultPDF() {
    if (!activeTest || !savedResultId) {
      toast.error("Hasil belum tersimpan, coba ulangi tesnya.");
      return;
    }
    setDownloading(true);
    try {
      const res = await fetch(`/api/screening/${savedResultId}/pdf`);
      if (!res.ok) throw new Error("Gagal mengambil PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `screening-${activeTest}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF hasil tes berhasil diunduh.");
    } catch {
      toast.error("Gagal mengunduh PDF. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  if (activeTest && !result) {
    const test = tests[activeTest];
    const answered = answers.filter((a) => a !== -1).length;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => setActiveTest(null)}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink">{test.emoji} {test.title} — {test.subtitle}</h1>
          <p className="text-sm text-ink-muted">Selama 2 minggu terakhir, seberapa sering kamu terganggu oleh masalah berikut?</p>
        </div>
        <Progress value={(answered / test.questions.length) * 100} />

        <div className="space-y-4">
          {test.questions.map((q, i) => (
            <Card key={i}>
              <p className="mb-3 font-medium">{i + 1}. {q}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => answer(i, opt.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      answers[i] === opt.value
                        ? "border-primary bg-primary text-white"
                        : "border-primary-lighter bg-white text-ink-muted hover:bg-primary-bg"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={submitTest} disabled={saving} className="w-full justify-center" size="lg">
          {saving ? "Menyimpan..." : "Lihat Hasil"}
        </Button>
      </div>
    );
  }

  if (activeTest && result) {
    const test = tests[activeTest];
    const isHigh = result.severity.label === "Berat" || result.severity.label === "Cukup Berat";
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="text-5xl">{test.emoji}</div>
        <h1 className="text-2xl font-bold text-ink">Hasil {test.title} Kamu</h1>
        <Card className="space-y-3">
          <div className="text-5xl font-extrabold" style={{ color: result.severity.color }}>
            {result.total}
          </div>
          <div
            className="mx-auto w-fit rounded-full px-4 py-1 text-sm font-bold text-white"
            style={{ backgroundColor: result.severity.color }}
          >
            {result.severity.label}
          </div>
          <p className="text-sm text-ink-muted">
            Ini adalah alat skrining, bukan diagnosis. Hasil ini bisa jadi bahan
            diskusi awal dengan psikolog atau psikiater profesional.
          </p>
        </Card>

        {isHigh && (
          <Card className="border border-red-200 bg-red-50 text-left">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-700">Kamu tidak sendirian.</p>
                <p className="text-sm text-red-600">
                  Jika kamu merasa kewalahan, hubungi Layanan Sejiwa 119 ext. 8 atau
                  psikolog/psikiater terdekat. Bicaralah dengan orang yang kamu percaya.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => setActiveTest(null)}>Kembali ke Daftar Tes</Button>
          <Button variant="soft" onClick={downloadResultPDF} disabled={downloading || !savedResultId}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Unduh PDF
          </Button>
          <Button onClick={() => startTest(activeTest)}>Ulangi Tes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
          <ClipboardCheck className="h-6 w-6 text-primary" /> Tes Screening
        </h1>
        <p className="text-sm text-ink-muted">
          Alat skrining mandiri untuk memahami kondisi mentalmu. Bukan pengganti diagnosis profesional.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(tests) as TestId[]).map((id) => {
          const t = tests[id];
          return (
            <motion.div key={id} whileHover={{ y: -4 }}>
              <Card className="h-full">
                <div className="mb-3 text-4xl">{t.emoji}</div>
                <h3 className="mb-1 text-lg font-bold">{t.title}</h3>
                <p className="mb-1 text-sm font-semibold text-primary">{t.subtitle}</p>
                <p className="mb-4 text-sm text-ink-muted">{t.description}</p>
                <Button onClick={() => startTest(id)} className="w-full justify-center">
                  Mulai Tes ({t.questions.length} pertanyaan)
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
