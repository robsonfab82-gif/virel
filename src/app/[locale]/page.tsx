import { getMessages, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Benefits } from "@/components/landing/Benefits";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTAFinal } from "@/components/landing/CTAFinal";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

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
    title: "VIREL — Cresça no Instagram com Inteligência Artificial",
    description:
      "Analise seu perfil, gere ideias de conteúdo, hashtags inteligentes e legendas virais com IA. Junte-se a mais de 50.000 criadores.",
    alternates: {
      canonical: `https://virel.com.br/${locale}`,
      languages: {
        "pt-BR": `https://virel.com.br/pt-BR`,
        en: `https://virel.com.br/en`,
        es: `https://virel.com.br/es`,
        fr: `https://virel.com.br/fr`,
        zh: `https://virel.com.br/zh`,
      },
    },
    openGraph: {
      title: "VIREL — Cresça no Instagram com IA",
      description: "Analise seu perfil, gere ideias de conteúdo e legendas virais com IA. 7 dias grátis.",
      url: `https://virel.com.br/${locale}`,
      siteName: "VIREL",
      type: "website",
      images: [{ url: "https://virel.com.br/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string | string[]>>;

  return (
    <div className="min-h-screen bg-virel-dark">
      <Navbar locale={locale} messages={{ nav: messages.nav as Record<string, string> }} />
      <main>
        <Hero locale={locale} t={messages.hero as Record<string, string>} />
        <HowItWorks t={messages.howItWorks as Record<string, string>} />
        <Benefits t={messages.benefits as Record<string, string>} />
        <Testimonials t={messages.testimonials as Record<string, string>} />
        <Pricing locale={locale} t={messages.pricing} />
        <FAQ t={messages.faq as Record<string, string>} />
        <CTAFinal t={messages.cta as Record<string, string>} />
      </main>
      <Footer locale={locale} messages={{ footer: messages.footer as Record<string, string> }} />
    </div>
  );
}
