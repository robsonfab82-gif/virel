"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CTAFinalProps {
  t: Record<string, string>;
}

export function CTAFinal({ t }: CTAFinalProps) {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 relative overflow-hidden bg-virel-dark">
      <div className="absolute inset-0 bg-gradient-virel opacity-10" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-virel-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
          {t.title}
        </h2>
        <p className="text-white/60 text-xl mb-10">{t.subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-virel-purple-500 text-sm"
          />
          <Button size="lg" className="shrink-0">
            {t.button}
            <ArrowRight size={18} />
          </Button>
        </div>

        <p className="text-white/30 text-sm">{t.noCreditCard}</p>
      </div>
    </section>
  );
}
