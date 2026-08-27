import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const user = session?.user;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
        <Settings className="h-6 w-6 text-primary" /> Pengaturan
      </h1>
      <Card className="space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Nama</div>
          <div>{user?.name || "—"}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Email</div>
          <div>{user?.email}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Bergabung sejak</div>
          <div>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })
              : "—"}
          </div>
        </div>
      </Card>
      <p className="text-xs text-ink-muted">
        Manajemen profil lengkap (ganti password, hapus akun) bisa ditambahkan
        di sini menggunakan Better Auth API (mis. auth.api.changePassword,
        auth.api.deleteUser).
      </p>
    </div>
  );
}
