"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

const scoreBreakdown = [
  { label: "Bio & Apresentação", score: 90, max: 100 },
  { label: "Consistência de Posts", score: 75, max: 100 },
  { label: "Uso de Hashtags", score: 88, max: 100 },
  { label: "Taxa de Engajamento", score: 85, max: 100 },
  { label: "Qualidade do Conteúdo", score: 78, max: 100 },
  { label: "Estética Visual", score: 80, max: 100 },
];

const suggestions = [
  { priority: "high", text: "Adicione palavras-chave relacionadas ao seu nicho na bio" },
  { priority: "high", text: "Aumente a frequência de posts para 5x por semana" },
  { priority: "medium", text: "Use mais hashtags de nicho (micro: 10-100K seguidores)" },
  { priority: "medium", text: "Responda comentários nas primeiras 2 horas após publicar" },
  { priority: "low", text: "Teste formato Reels para ampliar alcance orgânico" },
  { priority: "low", text: "Mantenha consistência de paleta de cores no feed" },
];

const totalScore = Math.round(
  scoreBreakdown.reduce((acc, item) => acc + item.score, 0) / scoreBreakdown.length
);

const circumference = 2 * Math.PI * 54;

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Análise de Perfil</h1>
          <p className="text-white/50 mt-1">Score detalhado do seu @joaosilva</p>
        </div>
        <Button variant="secondary" onClick={refresh} loading={loading} size="sm">
          <RefreshCw size={16} />
          Atualizar
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Score Circle */}
        <Card className="flex flex-col items-center justify-center text-center py-8">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (totalScore / 100) * circumference}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-black text-white">{totalScore}</span>
              <span className="text-white/40 text-xs">/100</span>
            </div>
          </div>
          <h2 className="text-white font-bold text-lg mb-1">Score do Perfil</h2>
          <Badge variant={totalScore >= 80 ? "success" : totalScore >= 60 ? "warning" : "error"}>
            {totalScore >= 80 ? "Excelente" : totalScore >= 60 ? "Bom" : "Precisa melhorar"}
          </Badge>
        </Card>

        {/* Breakdown */}
        <Card className="lg:col-span-2">
          <h2 className="text-white font-bold mb-6">Breakdown por Categoria</h2>
          <div className="space-y-4">
            {scoreBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70">{item.label}</span>
                  <span className="text-white font-semibold">{item.score}/100</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-virel transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <h2 className="text-white font-bold mb-4">Sugestões de Melhoria</h2>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
              <Badge
                variant={s.priority === "high" ? "error" : s.priority === "medium" ? "warning" : "info"}
                className="shrink-0 mt-0.5"
              >
                {s.priority === "high" ? "Alta" : s.priority === "medium" ? "Média" : "Baixa"}
              </Badge>
              <p className="text-white/70 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
