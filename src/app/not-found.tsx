import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-primary-bg px-6 text-center">
      <div className="text-6xl">🌿</div>
      <h1 className="text-2xl font-bold text-ink">Halaman Tidak Ditemukan</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        Sepertinya halaman yang kamu cari sudah pindah atau tidak tersedia.
      </p>
      <Link href="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}
