import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

const SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
const DUMMY_USER = { email: "test@example.com", name: "Tester" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = DUMMY_USER.email;
  let userName = DUMMY_USER.name;

  if (!SKIP_AUTH) {
    const session = await auth.api.getSession({ headers: headers() });
    if (!session) redirect("/login");
    userEmail = session.user.email ?? "";
    userName = session.user.name ?? "";
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary-bg md:flex-row">
      <Sidebar userEmail={userEmail} userName={userName} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
