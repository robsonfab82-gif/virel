"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQProps {
  t: Record<string, string>;
}

export function FAQ({ t }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = Array.from({ length: 8 }, (_, i) => ({
    q: t[`q${i + 1}`],
    a: t[`a${i + 1}`],
  }));

  return (
    <section className="py-24 bg-virel-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.title}</h2>
          <p className="text-white/50 text-lg">{t.subtitle}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-virel-dark-card border border-virel-dark-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <span className="text-white font-medium text-sm pr-4 group-hover:text-virel-purple-300 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-white/40 flex-shrink-0 transition-transform duration-200",
                    openIndex === i && "rotate-180 text-virel-purple-400"
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-white/60 text-sm leading-relaxed border-t border-virel-dark-border pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
