import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Carreiras — VIREL",
  description: "Faça parte do time que está revolucionando o crescimento no Instagram com IA. Veja nossas vagas abertas.",
};

export default async function CarreirasPage({
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
      pageKey="carreiras"
      defaultTitle="Carreiras na VIREL"
      defaultContent="Estamos sempre em busca de talentos apaixonados por tecnologia e marketing digital.\n\n## Vagas Abertas\n\n- Desenvolvedor Full-Stack (React/Next.js)\n- Designer UI/UX\n- Especialista em Growth Marketing\n- Engenheiro de Machine Learning\n\n## Benefícios\n\n- Trabalho 100% remoto\n- Horário flexível\n- Plano de saúde\n- Stock options\n- Budget para cursos e conferências"
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
