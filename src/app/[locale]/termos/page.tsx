import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DynamicPage } from "@/components/layout/DynamicPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Termos de Uso — VIREL",
  description: "Leia os Termos de Uso da plataforma VIREL.",
};

export default async function TermosPage({
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
      pageKey="termos"
      defaultTitle="Termos de Uso"
      defaultContent="Última atualização: 02 de maio de 2026\n\n## 1. Aceitação dos Termos\n\nAo utilizar os serviços da VIREL, você concorda com estes Termos de Uso.\n\n## 2. Uso do Serviço\n\nO VIREL é uma plataforma de análise e otimização de perfis do Instagram. Ao usar nosso serviço, você concorda em:\n\n- Fornecer informações precisas\n- Não usar o serviço para fins ilegais\n- Respeitar os Termos de Serviço do Instagram\n\n## 3. Propriedade Intelectual\n\nTodo o conteúdo da plataforma VIREL é protegido por direitos autorais."
      messages={{ nav: messages.nav, footer: messages.footer }}
    />
  );
}
