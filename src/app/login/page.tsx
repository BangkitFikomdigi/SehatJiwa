"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(
        error.message === "Invalid email or password"
          ? "Email atau password salah."
          : error.message ?? "Gagal masuk."
      );
      return;
    }
    toast.success("Berhasil masuk! Mengarahkan ke dashboard...");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-bg px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-softLg"
      >
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-2xl font-extrabold text-primary">
          <Image src="/logo.png" alt="MindMe" width={28} height={28} className="h-7 w-7" />
          Mind<span className="text-secondary">Me</span>
        </Link>
        <h1 className="mb-1 text-center text-xl font-bold text-ink">Selamat datang kembali</h1>
        <p className="mb-6 text-center text-sm text-ink-muted">
          Masuk untuk melanjutkan perjalanan kesehatan mentalmu.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                id="email"
                type="email"
                required
                placeholder="masukkan@email.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
