import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { MOCK_POSTS } from "@/lib/blog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getMessages } from "next-intl/server";
import { BlogPostClient } from "@/components/blog/BlogPostClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  const slugParams = MOCK_POSTS.map((post) => ({ slug: post.slug }));
  const localeParams = routing.locales.flatMap((locale) =>
    slugParams.map((s) => ({ locale, ...s }))
  );
  return localeParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = MOCK_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post não encontrado — VIREL Blog" };
  }

  return {
    title: `${post.title} — Blog VIREL`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://virel.com.br/${locale}/blog/${post.slug}`,
      siteName: "VIREL",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.coverImage, width: 800, height: 450 }],
    },
    alternates: { canonical: `https://virel.com.br/${locale}/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const messages = await getMessages() as Record<string, Record<string, string>>;

  const initialPost = MOCK_POSTS.find((p) => p.slug === slug && p.status === "published") ?? null;
  const initialRelated = MOCK_POSTS.filter(
    (p) => p.slug !== slug && p.status === "published"
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-virel-dark flex flex-col">
      <Navbar locale={locale} messages={{ nav: messages.nav }} />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostClient
            locale={locale}
            slug={slug}
            initialPost={initialPost}
            initialRelated={initialRelated}
          />
        </div>
      </main>

      <Footer locale={locale} messages={{ footer: messages.footer }} />
    </div>
  );
}
