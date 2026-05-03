import { BarChart3, Lightbulb, Hash, Sparkles, Calendar, Users2 } from "lucide-react";

interface BenefitsProps {
  t: Record<string, string>;
}

const benefits = [
  { icon: BarChart3, titleKey: "scoreTitle", descKey: "scoreDesc", color: "from-virel-purple-500 to-virel-purple-700" },
  { icon: Lightbulb, titleKey: "contentTitle", descKey: "contentDesc", color: "from-virel-blue-500 to-virel-blue-700" },
  { icon: Hash, titleKey: "hashtagsTitle", descKey: "hashtagsDesc", color: "from-cyan-500 to-cyan-700" },
  { icon: Sparkles, titleKey: "captionsTitle", descKey: "captionsDesc", color: "from-pink-500 to-pink-700" },
  { icon: Calendar, titleKey: "plannerTitle", descKey: "plannerDesc", color: "from-orange-500 to-orange-700" },
  { icon: Users2, titleKey: "competitorsTitle", descKey: "competitorsDesc", color: "from-green-500 to-green-700" },
];

export function Benefits({ t }: BenefitsProps) {
  return (
    <section id="benefits" className="py-24 bg-virel-dark-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.title}</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, titleKey, descKey, color }, i) => (
            <div
              key={i}
              className="group bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 hover:border-virel-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-virel-purple-500/10"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{t[titleKey]}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{t[descKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
