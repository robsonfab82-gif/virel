import { getMessages, setRequestLocale } from "next-intl/server";
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string>>;

  return (
    <AdminLayoutClient locale={locale} messages={{ admin: messages.admin }}>
      {children}
    </AdminLayoutClient>
  );
}
