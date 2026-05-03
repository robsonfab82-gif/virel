import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const competitors = [
  {
    handle: "fitnessmotivabr",
    name: "Fitness Motiva",
    followers: 284000,
    engagement: 6.2,
    score: 91,
    postsPerWeek: 6,
    topFormat: "Reels",
    growth: 8.4,
  },
  {
    handle: "vidalevebr",
    name: "Vida Leve",
    followers: 156000,
    engagement: 4.8,
    score: 84,
    postsPerWeek: 4,
    topFormat: "Post",
    growth: 3.1,
  },
  {
    handle: "transformacaofitness",
    name: "Transformação Fit",
    followers: 92000,
    engagement: 7.1,
    score: 88,
    postsPerWeek: 7,
    topFormat: "Reels",
    growth: 12.3,
  },
  {
    handle: "saudebemestarbr",
    name: "Saúde & Bem-Estar",
    followers: 67000,
    engagement: 5.5,
    score: 79,
    postsPerWeek: 3,
    topFormat: "Carousel",
    growth: -1.2,
  },
  {
    handle: "corpoementebr",
    name: "Corpo e Mente",
    followers: 45000,
    engagement: 8.3,
    score: 85,
    postsPerWeek: 5,
    topFormat: "Stories",
    growth: 5.7,
  },
];

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Análise de Concorrentes</h1>
        <p className="text-white/50 mt-1">Monitore a performance dos seus principais concorrentes</p>
      </div>

      <div className="grid gap-4">
        {competitors.map((c, i) => (
          <Card key={i} className="hover:border-virel-purple-500/30 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-virel flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold truncate">{c.name}</p>
                  <p className="text-white/40 text-xs">@{c.handle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{formatNumber(c.followers)}</div>
                  <div className="text-white/40 text-xs">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{c.engagement}%</div>
                  <div className="text-white/40 text-xs">Engajamento</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{c.score}/100</div>
                  <div className="text-white/40 text-xs">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-sm">{c.postsPerWeek}x/sem</div>
                  <div className="text-white/40 text-xs">Frequência</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className={`flex items-center gap-1 font-bold text-sm ${c.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {c.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(c.growth)}%
                  </div>
                  <div className="text-white/40 text-xs">Crescimento</div>
                </div>
              </div>

              <Badge variant="purple" className="shrink-0 self-start sm:self-center">
                {c.topFormat}
              </Badge>
            </div>

            <div className="mt-4 pt-4 border-t border-virel-dark-border">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/40">Score relativo ao seu</span>
                <span className={c.score > 82 ? "text-red-400" : "text-green-400"}>
                  {c.score > 82 ? `+${c.score - 82} pontos acima` : `${82 - c.score} pontos abaixo`}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-virel"
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
