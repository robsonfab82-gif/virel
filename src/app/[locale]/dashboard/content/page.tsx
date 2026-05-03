"use client";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Sparkles, Video, Image } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ideas = [
  {
    id: "1",
    title: "POV: Minha rotina de manhã que mudou tudo",
    description: "Mostre os bastidores da sua rotina matinal com foco nos hábitos que mais impactam o seu resultado.",
    format: "Reels" as const,
    difficulty: "easy" as const,
    category: "Lifestyle",
  },
  {
    id: "2",
    title: "5 erros que cometi e como você pode evitar",
    description: "Conteúdo educativo compartilhando aprendizados reais — gera muito engajamento e salvamentos.",
    format: "Post" as const,
    difficulty: "medium" as const,
    category: "Educação",
  },
  {
    id: "3",
    title: "Antes e depois: minha transformação em 90 dias",
    description: "Transformações são sempre virais. Mostre sua evolução de forma autêntica e inspiradora.",
    format: "Reels" as const,
    difficulty: "hard" as const,
    category: "Motivação",
  },
  {
    id: "4",
    title: "Respondendo as 10 perguntas mais frequentes",
    description: "Use os DMs e comentários para criar este conteúdo. Alta taxa de engajamento garantida.",
    format: "Stories" as const,
    difficulty: "easy" as const,
    category: "Interação",
  },
  {
    id: "5",
    title: "Tutorial passo a passo do meu processo",
    description: "Ensine algo que você domina. Conteúdo educativo tem alta taxa de salvamentos.",
    format: "Reels" as const,
    difficulty: "medium" as const,
    category: "Tutorial",
  },
  {
    id: "6",
    title: "Bastidores: o que ninguém te mostra",
    description: "Autenticidade é o que mais conecta em 2024. Mostre a realidade por trás dos posts perfeitos.",
    format: "Stories" as const,
    difficulty: "easy" as const,
    category: "Autenticidade",
  },
  {
    id: "7",
    title: "Trend do momento com o meu toque pessoal",
    description: "Participe de trends mas adapte para o seu nicho e personalidade.",
    format: "Reels" as const,
    difficulty: "easy" as const,
    category: "Trends",
  },
  {
    id: "8",
    title: "Revisão honesta do produto/serviço X",
    description: "Reviews autênticos geram confiança e aumentam a autoridade no nicho.",
    format: "Post" as const,
    difficulty: "medium" as const,
    category: "Review",
  },
  {
    id: "9",
    title: "Desafio de 7 dias: resultados reais",
    description: "Crie uma série de 7 posts documentando um desafio. Aumenta retorno ao perfil.",
    format: "Post" as const,
    difficulty: "hard" as const,
    category: "Série",
  },
];

const formatIcons = {
  Reels: Video,
  Stories: Sparkles,
  Post: Image,
};

const difficultyColors = {
  easy: "success" as const,
  medium: "warning" as const,
  hard: "error" as const,
};

const difficultyLabels = { easy: "Fácil", medium: "Médio", hard: "Difícil" };

export default function ContentPage() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Ideias de Conteúdo</h1>
        <p className="text-white/50 mt-1">Geradas pela IA para o seu nicho • Atualizado hoje</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const FormatIcon = formatIcons[idea.format];
          const isSaved = saved.has(idea.id);
          return (
            <Card
              key={idea.id}
              className="group hover:border-virel-purple-500/30 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FormatIcon size={16} className="text-virel-purple-400" />
                  <Badge variant="purple" className="text-xs">{idea.format}</Badge>
                </div>
                <button
                  onClick={() => toggleSave(idea.id)}
                  className={cn(
                    "transition-colors",
                    isSaved ? "text-virel-purple-400" : "text-white/20 hover:text-white/60"
                  )}
                >
                  {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>

              <h3 className="text-white font-semibold text-sm mb-2 flex-1">{idea.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{idea.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={difficultyColors[idea.difficulty]} className="text-xs">
                    {difficultyLabels[idea.difficulty]}
                  </Badge>
                  <span className="text-white/30 text-xs">{idea.category}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="secondary">Gerar mais ideias</Button>
      </div>
    </div>
  );
}
