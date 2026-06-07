import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/shared/Logo";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { DEFAULT_ADMIN } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the AI-Solution admin dashboard.",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-4 py-12">
      <div className="absolute inset-0 bg-hero-grid" aria-hidden />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Logo invert />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-soft">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Admin login</h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to manage customer data.
                </p>
              </div>
            </div>

            <Suspense fallback={<div className="h-64" />}>
              <AdminLoginForm />
            </Suspense>

            <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Demo credentials</p>
              <p className="mt-1">
                Email: <span className="font-mono">{DEFAULT_ADMIN.email}</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono">{DEFAULT_ADMIN.password}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
