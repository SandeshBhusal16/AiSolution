import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

/** Shared chrome (navbar + footer) for all public marketing pages. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
