import Link from "next/link";

interface FooterProps {
  locale: string;
  messages: {
    footer: Record<string, string>;
  };
}

export function Footer({ locale, messages }: FooterProps) {
  const t = messages.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-virel-dark border-t border-virel-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-virel rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">VIREL</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">{t.description}</p>
            <div className="flex gap-3 mt-4">
              {["instagram", "twitter", "linkedin", "youtube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-virel-purple-500/50 transition-all"
                >
                  <span className="text-xs uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.product}</h4>
            <ul className="space-y-2">
              {[
                [t.features, `/${locale}#benefits`],
                [t.pricing, `/${locale}#pricing`],
                [t.changelog, `/${locale}/novidades`],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.company}</h4>
            <ul className="space-y-2">
              {[
                [t.about, `/${locale}/sobre`],
                [t.blog, `/${locale}/blog`],
                [t.careers, `/${locale}/carreiras`],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.support}</h4>
            <ul className="space-y-2">
              {[
                [t.help, `/${locale}/ajuda`],
                [t.contact, `/${locale}/contato`],
                [t.terms, `/${locale}/termos`],
                [t.privacy, `/${locale}/privacidade`],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-virel-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {year} VIREL. {t.rights}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-white/20 text-xs">
              Made with ♥ in Brazil
            </p>
            <Link
              href={`/${locale}/admin/login`}
              className="text-white/15 hover:text-white/40 text-xs transition-colors"
            >
              Administração
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
