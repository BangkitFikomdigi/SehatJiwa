"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Bot,
  BookHeart,
  Library,
  ClipboardCheck,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ai", label: "AI", icon: Bot },
  { href: "/dashboard/diary", label: "Diary Mood", icon: BookHeart },
  { href: "/dashboard/library", label: "Perpustakaan Psikologi", icon: Library },
  { href: "/dashboard/screening", label: "Tes Screening", icon: ClipboardCheck },
];

export function Sidebar({ userEmail, userName }: { userEmail: string; userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initial = (userName || userEmail || "U").charAt(0).toUpperCase();

  return (
    <aside className="sticky top-0 z-40 flex h-auto w-full shrink-0 flex-col border-b border-primary/10 bg-white p-4 md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r md:p-6">
      <Link href="/dashboard" className="mb-3 flex items-center gap-2 text-xl font-extrabold text-primary md:mb-8">
        <Image src="/logo.png" alt="MindMe" width={28} height={28} className="h-7 w-7" />
        Mind<span className="text-secondary">Me</span>
      </Link>

      <ul className="flex flex-wrap gap-1 md:flex-1 md:flex-col md:flex-nowrap md:space-y-1 md:gap-0">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:bg-primary-bg hover:text-primary md:gap-3 md:px-4 md:py-3 md:text-sm",
                  active && "bg-primary-lighter font-semibold text-primary"
                )}
              >
                <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto hidden border-t border-primary/10 pt-4 md:block">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-ink-muted hover:bg-primary-bg hover:text-primary"
        >
          <Settings className="h-5 w-5" /> Pengaturan
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-ink-muted hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" /> Keluar
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-lg bg-primary-bg px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{userName || "Pengguna"}</div>
            <div className="truncate text-xs text-ink-muted">{userEmail}</div>
          </div>
        </div>
      </div>

      {/* Tombol keluar ringkas untuk mobile (bottom-menu disembunyikan di layar kecil) */}
      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-muted hover:bg-red-50 hover:text-red-600 md:hidden"
      >
        <LogOut className="h-4 w-4" /> Keluar
      </button>
    </aside>
  );
}
