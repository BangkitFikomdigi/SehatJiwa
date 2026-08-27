import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: headers() });

  // middleware.ts sudah menjaga route ini (cek cookie), redirect ini
  // sebagai lapisan kedua yang benar-benar memvalidasi session ke DB.
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-primary-bg md:flex-row">
      <Sidebar
        userEmail={session.user.email ?? ""}
        userName={session.user.name ?? ""}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
