"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

interface BlogListClientProps {
  locale: string;
  initialPosts: BlogPost[];
}

export function BlogListClient({ locale, initialPosts }: BlogListClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    const fromStorage = getPublishedPosts();
    if (fromStorage.length > 0) {
      setPosts(fromStorage);
    }
  }, []);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40 text-lg">Nenhum post publicado ainda.</p>
      </div>
    );
  }

  return (
    <>
      {/* Featured post */}
      <div className="mb-12">
        <Link href={`/${locale}/blog/${posts[0].slug}`} className="group block">
          <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl overflow-hidden hover:border-virel-purple-500/30 transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto lg:h-80 bg-gradient-to-br from-virel-purple-500/20 to-virel-blue-500/20 relative overflow-hidden">
                <img
                  src={posts[0].coverImage}
                  alt={posts[0].title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-virel-dark/20" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {posts[0].categories.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-virel-purple-500/10 border border-virel-purple-500/20 text-virel-purple-400 text-xs font-semibold rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-black text-white mb-3 group-hover:text-virel-purple-300 transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{posts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/40 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {posts[0].date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {posts[0].readTime} min
                    </span>
                  </div>
                  <span className="text-virel-purple-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ler mais <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Post grid */}
      {posts.length > 1 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group block">
              <article className="bg-virel-dark-card border border-virel-dark-border rounded-2xl overflow-hidden hover:border-virel-purple-500/30 transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-virel-purple-500/10 to-virel-blue-500/10 relative overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.categories.slice(0, 2).map((cat) => (
                      <span key={cat} className="px-2.5 py-0.5 bg-virel-purple-500/10 border border-virel-purple-500/20 text-virel-purple-400 text-xs font-medium rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-virel-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-virel-dark-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-virel rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {post.authorAvatar}
                      </div>
                      <span className="text-white/40 text-xs">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/30 text-xs">
                      <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}min</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
