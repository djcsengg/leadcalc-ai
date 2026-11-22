"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Users, CreditCard, PlusCircle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // If in embed view, do not display the main site navbar
  if (pathname?.startsWith("/embed/") || pathname?.startsWith("/c/")) {
    return null;
  }

  const links = [
    { href: "/builder", label: "AI Generator", icon: Sparkles },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">LeadCalc</span>
              <span className="ml-1 rounded bg-brand-100 px-1.5 py-0.5 text-xs font-semibold text-brand-700">AI</span>
            </div>
          </Link>

          <nav className="hidden md:flex md:space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ATS Pro Member</span>
          </div>

          <Link
            href="/builder"
            className="inline-flex items-center space-x-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Calculator</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
