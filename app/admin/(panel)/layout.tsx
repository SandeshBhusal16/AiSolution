import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

// Admin pages read JSON at request time and must reflect live data.
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard (defence in depth alongside middleware).
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      {children}
    </AdminShell>
  );
}
