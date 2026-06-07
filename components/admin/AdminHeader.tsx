"use client";

import { Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function AdminHeader({
  title,
  adminName,
  adminEmail,
  onMenuClick,
}: {
  title: string;
  adminName: string;
  adminEmail: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight">{adminName}</p>
          <p className="text-xs text-muted-foreground">{adminEmail}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
          {getInitials(adminName) || "AI"}
        </span>
      </div>
    </header>
  );
}
