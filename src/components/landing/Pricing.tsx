import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PricingProps {
  locale: string;
  t: Record<string, string | string[]>;
}

export function Pricing({ locale, t }: PricingProps) {
  const plans = [
    {
      nameKey: "startName",
      priceKey: "startPrice",
      featuresKey: "startFeatures",
      ctaKey: "ctaStart",
      highlighted: false,
      slug: "start",
    },
    {
      nameKey: "proName",
      priceKey: "proPrice",
      featuresKey: "proFeatures",
      ctaKey: "ctaPro",
      highlighted: true,
      slug: "pro",
    },
    {
      nameKey: "ultraName",
      priceKey: "ultraPrice",
      featuresKey: "ultraFeatures",
      ctaKey: "ctaUltra",
      highlighted: false,
      slug: "ultra",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-virel-dark-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.title as string}</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">{t.subtitle as string}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const features = t[plan.featuresKey] as string[];
            return (
              <div
                key={plan.slug}
                className={cn(
                  "relative rounded-2xl p-6 flex flex-col",
                  plan.highlighted
                    ? "bg-gradient-to-b from-virel-purple-600/20 to-virel-blue-600/20 border-2 border-virel-purple-500 shadow-2xl shadow-virel-purple-500/20 scale-105"
                    : "bg-virel-dark-card border border-virel-dark-border"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-virel text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Zap size={12} />
                      {t.popular as string}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white font-black text-2xl mb-2">{t[plan.nameKey] as string}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{t[plan.priceKey] as string}</span>
                    <span className="text-white/40 text-sm mb-1">/{t.monthly as string}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={16} className="text-virel-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/${locale}/register?plan=${plan.slug}`}>
                  <Button
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    className="w-full"
                  >
                    {t[plan.ctaKey] as string}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
