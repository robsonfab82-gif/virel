import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { MOCK_POSTS } from "@/lib/blog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getMessages } from "next-intl/server";
import { BlogListClient } from "@/components/blog/BlogListClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Blog VIREL — Estratégias de Crescimento no Instagram com IA",
    description: "Dicas, estratégias e novidades sobre crescimento no Instagram com inteligência artificial. Conteúdo exclusivo para criadores de conteúdo.",
    openGraph: {
      title: "Blog VIREL — Crescimento no Instagram com IA",
      description: "Conteúdo exclusivo sobre estratégias de Instagram, IA e marketing digital.",
      url: `https://virel.com.br/${locale}/blog`,
      siteName: "VIREL",
      type: "website",
      images: [{ url: "https://virel.com.br/og-image.png", width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://virel.com.br/${locale}/blog` },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string>>;
  const initialPosts = MOCK_POSTS.filter((p) => p.status === "published");

  return (
    <div className="min-h-screen bg-virel-dark flex flex-col">
      <Navbar locale={locale} messages={{ nav: messages.nav }} />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-virel-purple-500/10 border border-virel-purple-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-virel-purple-400 text-xs font-semibold uppercase tracking-wider">Blog VIREL</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Estratégias para{" "}
              <span className="bg-gradient-virel bg-clip-text text-transparent">Crescer no Instagram</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Dicas, tutoriais e insights sobre crescimento no Instagram com inteligência artificial.
            </p>
          </div>

          <BlogListClient locale={locale} initialPosts={initialPosts} />
        </div>
      </main>

      <Footer locale={locale} messages={{ footer: messages.footer }} />
    </div>
  );
}
