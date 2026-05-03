import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Entre em Contato — VIREL",
  description: "Fale com o time VIREL. Suporte, parcerias e dúvidas.",
};

export default async function ContatoPage({
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
      pageKey="contato"
      defaultTitle="Entre em Contato"
      defaultContent="Estamos aqui para ajudar!\n\n## Canais de Atendimento\n\n- **Email:** contato@virel.com.br\n- **Suporte técnico:** suporte@virel.com.br\n- **Parcerias:** parcerias@virel.com.br\n\n## Horário de Atendimento\n\nSegunda a sexta, das 9h às 18h (horário de Brasília).\n\n## Tempo de Resposta\n\nRespondemos em até 24 horas úteis."
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
