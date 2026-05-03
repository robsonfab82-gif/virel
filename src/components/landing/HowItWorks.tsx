import { AtSign, Brain, TrendingUp } from "lucide-react";

interface HowItWorksProps {
  t: Record<string, string>;
}

const steps = [
  { icon: AtSign, color: "virel-purple", num: "01" },
  { icon: Brain, color: "virel-blue", num: "02" },
  { icon: TrendingUp, color: "green", num: "03" },
];

export function HowItWorks({ t }: HowItWorksProps) {
  const stepData = [
    { titleKey: "step1Title", descKey: "step1Desc" },
    { titleKey: "step2Title", descKey: "step2Desc" },
    { titleKey: "step3Title", descKey: "step3Desc" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-virel-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-virel-dark-50/30 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.title}</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-virel-purple-500 to-virel-blue-500 z-0" />

          {steps.map((step, i) => {
            const { icon: Icon } = step;
            const data = stepData[i];
            return (
              <div key={i} className="relative z-10 text-center group">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-virel rounded-2xl flex items-center justify-center shadow-lg shadow-virel-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={28} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-virel-dark border border-virel-purple-500 rounded-full flex items-center justify-center text-virel-purple-400 text-xs font-black">
                      {step.num}
                    </div>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{t[data.titleKey]}</h3>
                <p className="text-white/50 leading-relaxed">{t[data.descKey]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
