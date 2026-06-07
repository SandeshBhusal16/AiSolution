"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/inquiries": "Customer Inquiries",
  "/admin/demo-requests": "Demo Requests",
  "/admin/event-registrations": "Event Registrations",
  "/admin/events": "Event Management",
};

function titleFor(pathname: string): string {
  const match = Object.keys(TITLES).find((key) => pathname.startsWith(key));
  return match ? TITLES[match] : "Admin";
}

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={titleFor(pathname)}
          adminName={adminName}
          adminEmail={adminEmail}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
