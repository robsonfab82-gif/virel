import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Política de Privacidade — VIREL",
  description: "Como o VIREL coleta, usa e protege seus dados pessoais (LGPD).",
};

export default async function PrivacidadePage({
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
      pageKey="privacidade"
      defaultTitle="Política de Privacidade"
      defaultContent="Última atualização: 02 de maio de 2026\n\n## 1. Informações que Coletamos\n\n- Dados de conta (nome, email)\n- Dados públicos do Instagram\n- Dados de uso da plataforma\n\n## 2. Como Usamos Suas Informações\n\n- Fornecer e melhorar nossos serviços\n- Personalizar sua experiência\n- Enviar comunicações relevantes\n\n## 3. Compartilhamento de Dados\n\nNão vendemos seus dados pessoais. Compartilhamos apenas com parceiros necessários para operar o serviço.\n\n## 4. Seus Direitos (LGPD)\n\nVocê tem direito a acessar, corrigir e deletar seus dados a qualquer momento."
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
