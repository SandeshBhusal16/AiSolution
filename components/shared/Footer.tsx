import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900 text-slate-300">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo invert />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              AI-Solution is a Sunderland-based AI start-up helping businesses
              work smarter with AI-powered virtual assistants, affordable
              prototyping, software support and hands-on events.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {PUBLIC_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                Sunderland, United Kingdom
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                hello@aisolution.com
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-cyan" />
                +44 (0)191 000 0000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} AI-Solution. Academic prototype for
            CET333 Product Development.
          </p>
          <p>Built with Next.js, TypeScript &amp; JSON file storage.</p>
        </div>
      </div>
    </footer>
  );
}
