"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

interface AdminLayoutClientProps {
  locale: string;
  messages: { admin: Record<string, string> };
  children: React.ReactNode;
}

export function AdminLayoutClient({ locale, messages, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const isLoginPage = pathname === `/${locale}/admin/login`;

  useEffect(() => {
    if (isLoginPage) return;
    
    const adminSession = localStorage.getItem("virel_admin_session");
    if (adminSession !== "true") {
      router.push(`/${locale}/admin/login`);
    } else {
      setIsAuthorized(true);
    }
  }, [isLoginPage, locale, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-virel-dark flex items-center justify-center">
        <div className="text-white">Verificando acesso...</div>
      </div>
    );
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
