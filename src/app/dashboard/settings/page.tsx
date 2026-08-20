import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
        <Settings className="h-6 w-6 text-primary" /> Pengaturan
      </h1>
      <Card className="space-y-3">
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Nama</div>
          <div>{(user?.user_metadata?.full_name as string) || "—"}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Email</div>
          <div>{user?.email}</div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted">Bergabung sejak</div>
          <div>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })
              : "—"}
          </div>
        </div>
      </Card>
      <p className="text-xs text-ink-muted">
        Manajemen profil lengkap (ganti password, hapus akun) bisa ditambahkan
        di sini menggunakan Supabase Auth Admin API.
      </p>
    </div>
  );
}
