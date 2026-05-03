"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface DynamicPageProps {
  locale: string;
  pageKey: string;
  defaultTitle: string;
  defaultContent: string;
  messages: {
    nav: Record<string, string>;
    footer: Record<string, string>;
  };
}

const STORAGE_KEY = "virel_pages_content";

function renderMarkdown(content: string) {
  return content.split("\n").map((line, i) => {
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
        <li key={i} className="text-white/70 text-base leading-relaxed ml-4 mb-1.5 list-disc">
          {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    const boldified = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    return (
      <p
        key={i}
        className="text-white/70 text-base leading-relaxed mb-3"
        dangerouslySetInnerHTML={{ __html: boldified }}
      />
    );
  });
}

export function DynamicPage({ locale, pageKey, defaultTitle, defaultContent, messages }: DynamicPageProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const pages = JSON.parse(stored);
        const found = pages.find((p: { key: string; title: string; content: string }) => p.key === pageKey);
        if (found) {
          setTitle(found.title);
          setContent(found.content);
        }
      }
    } catch {}
  }, [pageKey]);

  return (
    <div className="min-h-screen bg-virel-dark flex flex-col">
      <Navbar locale={locale} messages={messages} />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              <ArrowLeft size={14} />
              Início
            </Link>
          </div>

          <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-8">
            <h1 className="text-3xl font-black text-white mb-8">{title}</h1>
            <div className="prose-custom">
              {renderMarkdown(content)}
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} messages={{ footer: messages.footer }} />
    </div>
  );
}
