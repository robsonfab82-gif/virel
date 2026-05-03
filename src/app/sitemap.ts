import { MetadataRoute } from "next";
import { MOCK_POSTS } from "@/lib/blog";

const BASE_URL = "https://virel.com.br";
const LOCALES = ["pt-BR", "en", "es", "fr", "zh"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/sobre",
    "/carreiras",
    "/ajuda",
    "/contato",
    "/termos",
    "/privacidade",
    "/novidades",
  ];

  const staticUrls = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1.0 : 0.8,
    }))
  );

  const blogUrls = LOCALES.flatMap((locale) =>
    MOCK_POSTS.filter((p) => p.status === "published").map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...blogUrls];
}
