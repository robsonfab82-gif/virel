import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DemoPageClient } from "@/components/demo/DemoPageClient";
import type { Metadata } from "next";
import Link from "next/link";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Veja o VIREL em Ação — Demonstração",
    description: "Assista à demonstração do VIREL e descubra como a IA pode transformar sua presença no Instagram.",
    openGraph: {
      title: "Veja o VIREL em Ação",
      description: "Demonstração completa das funcionalidades do VIREL.",
      url: `https://virel.com.br/${locale}/demo`,
      siteName: "VIREL",
      type: "website",
    },
    alternates: { canonical: `https://virel.com.br/${locale}/demo` },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string>>;

  return (
    <div className="min-h-screen bg-virel-dark flex flex-col">
      <Navbar locale={locale} messages={{ nav: messages.nav }} />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-virel-purple-500/10 border border-virel-purple-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-virel-purple-400 text-xs font-semibold uppercase tracking-wider">Demonstração</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Veja o{" "}
              <span className="bg-gradient-virel bg-clip-text text-transparent">VIREL em Ação</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Descubra como o VIREL usa inteligência artificial para turbinar seu crescimento no Instagram.
            </p>
          </div>

          {/* Video Player */}
          <DemoPageClient />

          {/* Benefits */}
          <div className="mt-20">
            <h2 className="text-2xl font-black text-white text-center mb-10">
              Por que usar o VIREL?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "⚡",
                  title: "Rápido e Inteligente",
                  desc: "Gere legendas, hashtags e análises em segundos com IA treinada para o Instagram.",
                },
                {
                  icon: "📈",
                  title: "Crescimento Real",
                  desc: "Criadores que usam VIREL reportam aumento médio de 23% no engajamento.",
                },
                {
                  icon: "🎯",
                  title: "Estratégia Personalizada",
                  desc: "Recomendações baseadas no seu perfil e audiência específica.",
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 text-center hover:border-virel-purple-500/30 transition-all"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-virel-purple-500/10 to-virel-blue-500/10 border border-virel-purple-500/20 rounded-2xl p-10">
              <h2 className="text-3xl font-black text-white mb-3">Pronto para começar?</h2>
              <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">
                Junte-se a 50.000+ criadores que já usam o VIREL para dominar o Instagram.
              </p>
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center gap-2 bg-gradient-virel text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-base"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} messages={{ footer: messages.footer }} />
    </div>
  );
}
