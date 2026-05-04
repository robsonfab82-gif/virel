import { getMessages, setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

  // Check if user is logged in
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Check if user is admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", user.email)
    .single();

  if (!adminData) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <AdminLayoutClient locale={locale} messages={{ admin: messages.admin }}>
      {children}
    </AdminLayoutClient>
  );
}
