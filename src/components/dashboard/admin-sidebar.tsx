"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Users,
  Activity,
  TrendingUp,
  LogOut,
  ArrowLeft,
  Shield,
} from "lucide-react";

const adminMenu = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/entries", label: "Mood Entries", icon: Activity },
  { href: "/dashboard/admin/reports", label: "Reports", icon: TrendingUp },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 z-40 flex h-auto w-full shrink-0 flex-col border-b border-primary/10 bg-white p-4 md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r md:p-6">
      <Link href="/dashboard/admin" className="mb-3 flex items-center gap-2 text-xl font-extrabold text-primary md:mb-8">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
          <Shield className="h-4 w-4" />
        </div>
        <span>Admin</span>
      </Link>

      <ul className="flex flex-wrap gap-1 md:flex-1 md:flex-col md:flex-nowrap md:space-y-1 md:gap-0">
        {adminMenu.map((item) => {
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

      <div className="mt-auto hidden border-t border-primary/10 pt-4 md:block space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-ink-muted hover:bg-primary-bg hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" /> Kembali
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" /> Keluar
        </button>

        <div className="mt-3 rounded-lg bg-primary-bg px-4 py-3">
          <div className="text-sm font-semibold text-primary">👑 Super Admin</div>
          <div className="text-xs text-ink-muted mt-1">{userName}</div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-muted hover:bg-red-50 hover:text-red-600 md:hidden"
      >
        <LogOut className="h-4 w-4" /> Keluar
      </button>
    </aside>
  );
}
