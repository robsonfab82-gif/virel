"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

interface BlogPostClientProps {
  locale: string;
  slug: string;
  initialPost: BlogPost | null;
  initialRelated: BlogPost[];
}

export function BlogPostClient({ locale, slug, initialPost, initialRelated }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [related, setRelated] = useState<BlogPost[]>(initialRelated);

  useEffect(() => {
    const fromStorage = getPostBySlug(slug);
    if (fromStorage) {
      setPost(fromStorage);
      const allPublished = getPublishedPosts();
      setRelated(allPublished.filter((p) => p.slug !== slug).slice(0, 3));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-lg">Post não encontrado.</p>
        <Link href={`/${locale}/blog`} className="text-virel-purple-400 text-sm mt-4 inline-block hover:underline">
          Voltar ao blog
        </Link>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-2xl font-black text-white mt-8 mb-4">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-bold text-white mt-6 mb-3">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="text-white/70 text-base leading-relaxed ml-4 mb-1 list-disc">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <li key={i} className="text-white/70 text-base leading-relaxed ml-4 mb-1 list-decimal">
              {line.replace(/^\d+\. /, "")}
            </li>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="text-white font-bold text-base mb-3">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.trim() === "") return <br key={i} />;
        return (
          <p key={i} className="text-white/70 text-base leading-relaxed mb-4">
            {line}
          </p>
        );
      });
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar ao Blog
        </Link>
      </div>

      {/* Article header */}
      <article>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <span key={cat} className="px-3 py-1 bg-virel-purple-500/10 border border-virel-purple-500/20 text-virel-purple-400 text-xs font-semibold rounded-full">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-6">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-virel-dark-border text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-virel rounded-full flex items-center justify-center text-white text-xs font-bold">
                {post.authorAvatar}
              </div>
              <span>{post.author}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime} min de leitura
            </span>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gradient-to-br from-virel-purple-500/20 to-virel-blue-500/20">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-virel-dark-border">
          <span className="flex items-center gap-1.5 text-white/40 text-xs">
            <Tag size={12} />
            Tags:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-white/50 text-xs rounded-full hover:border-virel-purple-500/30 hover:text-virel-purple-400 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* CTA Box */}
      <div className="mt-12 bg-gradient-to-br from-virel-purple-500/10 to-virel-blue-500/10 border border-virel-purple-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-black text-white mb-2">Pronto para crescer no Instagram?</h3>
        <p className="text-white/50 text-sm mb-6">Junte-se a 50.000+ criadores que usam VIREL para dominar o Instagram.</p>
        <Link
          href={`/${locale}/register`}
          className="inline-flex items-center gap-2 bg-gradient-virel text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          Começar Grátis por 7 Dias
        </Link>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-black text-white mb-6">Posts Relacionados</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((rp) => (
              <Link key={rp.id} href={`/${locale}/blog/${rp.slug}`} className="group block">
                <div className="bg-virel-dark-card border border-virel-dark-border rounded-xl overflow-hidden hover:border-virel-purple-500/30 transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={rp.coverImage}
                      alt={rp.title}
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-white text-sm font-bold group-hover:text-virel-purple-300 transition-colors line-clamp-2">
                      {rp.title}
                    </h4>
                    <p className="text-white/40 text-xs mt-1">{rp.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
