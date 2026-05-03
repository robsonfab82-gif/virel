import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialsProps {
  t: Record<string, string>;
}

const testimonials = [
  {
    name: "Ana Beatriz Santos",
    result: "Cresci de 8K para 28K seguidores em 30 dias",
    text: "Em 30 dias usando o VIREL meu perfil cresceu 4.200 seguidores! As legendas virais são incríveis, o engajamento triplicou.",
    rating: 5,
    niche: "Fitness",
  },
  {
    name: "Marcos Oliveira",
    result: "Alcance dos posts saltou de 500 para 15 mil pessoas",
    text: "As hashtags inteligentes mudaram completamente o alcance dos meus posts. Antes chegava em 500 pessoas, agora chego em 15 mil.",
    rating: 5,
    niche: "Gastronomia",
  },
  {
    name: "Juliana Costa",
    result: "Engajamento subiu de 1,2% para 6,8%",
    text: "O score de perfil me mostrou exatamente o que estava errado. Corrigi tudo e meu engajamento passou de 1.2% para 6.8%!",
    rating: 5,
    niche: "Moda",
  },
  {
    name: "Pedro Henrique Lima",
    result: "Economizei meses de trabalho com análise de concorrentes",
    text: "A análise de concorrentes vale por si só o plano Ultra. Descobri estratégias que minha equipe levaria meses para perceber.",
    rating: 5,
    niche: "Negócios",
  },
  {
    name: "Camila Ferreira",
    result: "Planejo o mês inteiro em 2 horas agora",
    text: "O planejador de conteúdo transformou minha rotina. Agora planejo o mês inteiro em 2 horas. Recomendo demais!",
    rating: 5,
    niche: "Viagens",
  },
  {
    name: "Rafael Duarte",
    result: "Cresci de 12K para 38K seguidores em 3 meses",
    text: "Tentei várias ferramentas antes. O VIREL é de longe a mais completa e com o melhor custo-benefício. Suporte nota 10.",
    rating: 5,
    niche: "Fotografia",
  },
];

export function Testimonials({ t }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-virel-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{t.title}</h2>
          <p className="text-white/50 text-lg">{t.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 hover:border-virel-purple-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=7C3AED&color=fff&size=40`}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{item.name}</p>
                  <p className="text-virel-purple-300 text-xs font-medium">{item.result}</p>
                </div>
                <span className="ml-auto text-virel-purple-400 text-xs font-medium bg-virel-purple-500/10 px-2 py-0.5 rounded-full">
                  {item.niche}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
