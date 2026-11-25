"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Sparkles, LayoutDashboard, Users, CreditCard, PlusCircle, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // If in embed view, do not display the main site navbar
  if (pathname?.startsWith("/embed/") || pathname?.startsWith("/c/")) {
    return null;
  }

  const links = [
    { href: "/calculators", label: "Templates", icon: Calculator },
    { href: "/builder", label: "Calculator Builder", icon: Sparkles },
    { href: "/dashboard", label: "My Calculators", icon: LayoutDashboard },
    { href: "/leads", label: "Leads CRM", icon: Users },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                LeadCalc <span className="text-brand-600">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-wide uppercase">
                Interactive Calculator Builder
              </span>
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
                  className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/pricing"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            $49 Lifetime Deal
          </Link>

          <Link
            href="/builder"
            className="inline-flex items-center space-x-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all shadow-brand-500/20 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Calculator</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
