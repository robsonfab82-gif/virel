import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Central de Ajuda — VIREL",
  description: "Encontre respostas, tutoriais e guias de uso do VIREL.",
};

export default async function AjudaPage({
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
      pageKey="ajuda"
      defaultTitle="Central de Ajuda"
      defaultContent="Encontre respostas para as perguntas mais frequentes sobre o VIREL.\n\n## Primeiros Passos\n\n- Como criar minha conta\n- Como conectar meu Instagram\n- Como interpretar meu Score\n\n## Pagamentos\n\n- Como assinar um plano\n- Como cancelar minha assinatura\n- Política de reembolso\n\n## Suporte\n\nEntre em contato: suporte@virel.com.br"
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
