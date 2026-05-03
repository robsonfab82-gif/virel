import { getMessages, setRequestLocale } from "next-intl/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";

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

  // Fetch real user from Supabase
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data: { user } } = await supabase.auth.getUser();

  const userData = user
    ? {
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
        email: user.email || "",
        instagram: user.user_metadata?.instagram_handle || "",
        plan: "pro", // TODO: fetch from subscriptions table
      }
    : {
        name: "Usuário",
        email: "",
        instagram: "",
        plan: "pro",
      };

  return (
    <div className="min-h-screen bg-virel-dark flex">
      <Sidebar
        locale={locale}
        user={userData}
        messages={{ dashboard: messages.dashboard }}
      />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
