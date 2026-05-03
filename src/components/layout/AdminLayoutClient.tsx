"use client";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

interface AdminLayoutClientProps {
  locale: string;
  messages: { admin: Record<string, string> };
  children: React.ReactNode;
}

export function AdminLayoutClient({ locale, messages, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === `/${locale}/admin/login`;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-virel-dark flex">
      <AdminSidebar locale={locale} messages={messages} />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
