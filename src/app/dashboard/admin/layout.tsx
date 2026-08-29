import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (SKIP_AUTH) {
    // Jika skip auth, langsung allow admin access
    return (
      <div className="flex min-h-screen flex-col bg-primary-bg md:flex-row">
        <AdminSidebar userName="Admin Tester" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    );
  }

  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    redirect("/login");
  }

  // Cek apakah user adalah admin
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, session.user.id))
    .limit(1);

  if (!admin || admin.length === 0) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary-bg md:flex-row">
      <AdminSidebar userName={session.user.name ?? ""} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
