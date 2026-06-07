import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** /admin → dashboard (middleware sends unauthenticated users to login). */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
