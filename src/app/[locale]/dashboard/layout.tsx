import { getMessages, setRequestLocale } from "next-intl/server";
import { Sidebar } from "@/components/layout/Sidebar";

const mockUser = {
  name: "João Silva",
  email: "joao@email.com",
  instagram: "joaosilva",
  plan: "pro",
};

export default async function DashboardLayout({
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
    <div className="min-h-screen bg-virel-dark flex">
      <Sidebar
        locale={locale}
        user={mockUser}
        messages={{ dashboard: messages.dashboard }}
      />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
