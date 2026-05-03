"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: string;
  messages: {
    nav: Record<string, string>;
  };
}

const localeNames: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
  fr: "FR",
  zh: "ZH",
};

const locales = ["pt-BR", "en", "es", "fr", "zh"];

export function Navbar({ locale, messages }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const t = messages.nav;

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-virel-dark/80 backdrop-blur-md border-b border-virel-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-virel rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">VIREL</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}#how-it-works`} className="text-white/60 hover:text-white text-sm transition-colors">
              {t.howItWorks}
            </Link>
            <Link href={`/${locale}#pricing`} className="text-white/60 hover:text-white text-sm transition-colors">
              {t.pricing}
            </Link>
            <Link href={`/${locale}#testimonials`} className="text-white/60 hover:text-white text-sm transition-colors">
              {t.testimonials}
            </Link>
            <Link href={`/${locale}/blog`} className="text-white/60 hover:text-white text-sm transition-colors">
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <Globe size={16} />
                {localeNames[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-virel-dark-card border border-virel-dark-border rounded-xl shadow-xl overflow-hidden z-50">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={switchLocale(l)}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors hover:bg-white/5",
                        l === locale ? "text-virel-purple-400" : "text-white/70"
                      )}
                    >
                      {localeNames[l]} — {l}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href={`/${locale}/login`}>
              <Button variant="ghost" size="sm">{t.login}</Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="sm">{t.register}</Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-virel-dark-border flex flex-col gap-3">
            <Link href={`/${locale}#how-it-works`} className="text-white/60 hover:text-white text-sm py-2" onClick={() => setMenuOpen(false)}>
              {t.howItWorks}
            </Link>
            <Link href={`/${locale}#pricing`} className="text-white/60 hover:text-white text-sm py-2" onClick={() => setMenuOpen(false)}>
              {t.pricing}
            </Link>
            <Link href={`/${locale}#testimonials`} className="text-white/60 hover:text-white text-sm py-2" onClick={() => setMenuOpen(false)}>
              {t.testimonials}
            </Link>
            <Link href={`/${locale}/blog`} className="text-white/60 hover:text-white text-sm py-2" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href={`/${locale}/login`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">{t.login}</Button>
              </Link>
              <Link href={`/${locale}/register`} className="flex-1">
                <Button size="sm" className="w-full">{t.register}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
