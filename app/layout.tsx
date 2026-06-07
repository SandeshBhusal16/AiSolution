import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "AI-Solution — Smarter Work with AI",
    template: "%s | AI-Solution",
  },
  description:
    "AI-Solution is a Sunderland-based AI start-up delivering AI-powered virtual assistants, affordable prototyping, software support and promotional events for businesses worldwide.",
  keywords: [
    "AI",
    "virtual assistant",
    "prototyping",
    "software support",
    "AI-Solution",
    "Sunderland",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
