import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadCalc AI - Interactive Calculator & Lead Magnet Generator",
  description:
    "Generate custom ROI, pricing, and savings calculators in 30 seconds with AI. Embed anywhere with a single script tag and capture 3x more high-intent B2B leads.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">LeadCalc AI</span>
              <span>— Product #1 by Autonomous Technology Solutions (ATS)</span>
            </div>
            <div className="flex items-center space-x-6">
              <span>Zero-cost Serverless Stack</span>
              <span>Stripe Global Payments</span>
              <span>Gemini AI Engine</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
