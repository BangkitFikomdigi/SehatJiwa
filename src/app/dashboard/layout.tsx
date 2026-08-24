import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware.ts sudah menjaga route ini, redirect ini sebagai lapisan kedua.
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-primary-bg md:flex-row">
      <Sidebar
        userEmail={user.email ?? ""}
        userName={(user.user_metadata?.full_name as string) ?? ""}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
