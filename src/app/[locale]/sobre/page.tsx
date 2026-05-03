import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Sobre o VIREL — A Plataforma de Crescimento no Instagram com IA",
  description: "Conheça a história, missão e equipe por trás do VIREL, a plataforma de crescimento para Instagram com IA mais avançada do Brasil.",
  openGraph: {
    title: "Sobre o VIREL",
    description: "Conheça nossa história, missão e equipe.",
    type: "website",
  },
};

export default async function SobrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string>>;

  return (
    <DynamicPage
      locale={locale}
      pageKey="sobre"
      defaultTitle="Sobre o VIREL"
      defaultContent="Somos uma startup brasileira focada em democratizar o crescimento no Instagram através de inteligência artificial. Fundada em 2024, a VIREL nasceu da frustração de criadores de conteúdo que passavam horas tentando crescer sem resultados consistentes.\n\nNossa missão é simples: dar a todo criador as mesmas ferramentas que as grandes agências usam, de forma acessível e automatizada.\n\n## Nossa Equipe\n\nSomos um time apaixonado por tecnologia, marketing digital e crescimento orgânico."
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
