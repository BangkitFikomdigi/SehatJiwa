"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Leaf, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
    router.push("/login");
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
          <Leaf className="h-6 w-6" /> Sehat<span className="text-secondary">Jiwa</span>
        </Link>
        <h1 className="mb-1 text-center text-xl font-bold text-ink">Buat akun baru 🌱</h1>
        <p className="mb-6 text-center text-sm text-ink-muted">
          Mulai jaga kesehatan mentalmu bersama SehatJiwa.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                id="name"
                required
                placeholder="Nama kamu"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                id="email"
                type="email"
                required
                placeholder="kamu@email.com"
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
                placeholder="Minimal 6 karakter"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
