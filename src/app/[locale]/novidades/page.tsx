import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Novidades — VIREL Changelog",
  description: "Acompanhe todas as novidades, atualizações e melhorias do VIREL.",
};

export default async function NovidadesPage({
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
      pageKey="novidades"
      defaultTitle="Novidades VIREL"
      defaultContent="## Changelog\n\n### v2.5.0 — Maio 2026\n- Nova IA de legendas com 3 novos estilos\n- Análise de concorrentes melhorada\n- Dashboard redesenhado\n\n### v2.4.0 — Abril 2026\n- Planejador de conteúdo com drag-and-drop\n- Relatórios avançados para plano Ultra\n- Suporte a múltiplos perfis\n\n### v2.3.0 — Março 2026\n- Score de perfil v2 mais preciso\n- Integração com Meta Business Suite\n- App mobile em beta"
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
