import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DemoButton } from "@/components/landing/DemoButton";

interface HeroProps {
  locale: string;
  t: Record<string, string>;
}

export function Hero({ locale, t }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-virel-dark pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-virel-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-virel-blue-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge variant="purple" className="mb-6 inline-flex">
              <Zap size={12} />
              {t.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {t.title}{" "}
              <span className="bg-gradient-virel bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl lg:max-w-none">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={`/${locale}/register`}>
                <Button size="xl" className="w-full sm:w-auto">
                  {t.ctaPrimary}
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <DemoButton label={t.ctaSecondary} />
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-white">2.3M+</div>
                <div className="text-white/50 text-xs mt-1">{t.statsFollowers}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-white">4.8%</div>
                <div className="text-white/50 text-xs mt-1">{t.statsEngagement}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-white">50K+</div>
                <div className="text-white/50 text-xs mt-1">{t.statsCreators}</div>
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative hidden lg:block animate-float">
            <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/40 text-xs">Score do Perfil</p>
                  <div className="text-4xl font-black text-white mt-1">82<span className="text-2xl text-white/40">/100</span></div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-virel-purple-500 flex items-center justify-center">
                  <TrendingUp size={24} className="text-virel-purple-400" />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Bio", val: 90 },
                  { label: "Consistência", val: 75 },
                  { label: "Hashtags", val: 88 },
                  { label: "Engajamento", val: 85 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{item.label}</span>
                      <span className="text-white font-medium">{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-virel rounded-full"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Seguidores", val: "12.4K", up: true },
                  { label: "Engajamento", val: "4.8%", up: true },
                  { label: "Posts", val: "127", up: false },
                ].map((m) => (
                  <div key={m.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-white font-bold text-sm">{m.val}</div>
                    <div className="text-white/40 text-xs mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-virel-dark-card border border-virel-dark-border rounded-xl p-3 shadow-xl animate-pulse-slow">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-virel-purple-400" />
                <span className="text-white text-xs font-medium">+342 seguidores hoje</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-virel-dark-card border border-virel-dark-border rounded-xl p-3 shadow-xl animate-pulse-slow" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                <span className="text-white text-xs font-medium">Nova legenda viral gerada!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
