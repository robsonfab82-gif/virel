import { TrendingUp, Users, BarChart3, Star, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

const metrics = [
  {
    label: "Seguidores",
    value: 12400,
    growth: 5.2,
    icon: Users,
    color: "text-virel-purple-400",
    bg: "bg-virel-purple-500/10",
  },
  {
    label: "Engajamento",
    value: "4.8%",
    growth: 1.3,
    icon: TrendingUp,
    color: "text-virel-blue-400",
    bg: "bg-virel-blue-500/10",
    isString: true,
  },
  {
    label: "Posts",
    value: 127,
    growth: -2.1,
    icon: BarChart3,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "Score",
    value: "82/100",
    growth: 3.5,
    icon: Star,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    isString: true,
  },
];

const recentActivities = [
  { text: "Score do perfil atualizado: 82/100", time: "Agora mesmo", type: "score" },
  { text: "12 novas hashtags geradas para fitness", time: "2 horas atrás", type: "hashtag" },
  { text: "3 legendas virais criadas", time: "4 horas atrás", type: "caption" },
  { text: "Análise de concorrentes concluída", time: "1 dia atrás", type: "analysis" },
  { text: "Planejamento semanal criado", time: "2 dias atrás", type: "planner" },
];

const weeklyData = [45, 52, 38, 65, 71, 55, 82];
const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function DashboardHome() {
  const maxVal = Math.max(...weeklyData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Bom dia! 👋</h1>
        <p className="text-white/50 mt-1">Aqui está o resumo do seu perfil hoje</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isPositive = m.growth >= 0;
          return (
            <Card key={m.label} className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${m.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} className={m.color} />
                </div>
                <Badge variant={isPositive ? "success" : "error"} className="gap-0.5">
                  {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {Math.abs(m.growth)}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-white">
                {m.isString ? m.value : formatNumber(m.value as number)}
              </div>
              <div className="text-white/40 text-xs mt-1">{m.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold">Crescimento de Seguidores</h2>
            <Badge variant="purple">Esta semana</Badge>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative flex items-end" style={{ height: "96px" }}>
                  <div
                    className="w-full bg-gradient-virel rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-white/30 text-xs">{days[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-virel-purple-400" />
            <h2 className="text-white font-bold">Atividade Recente</h2>
          </div>
          <ul className="space-y-4">
            {recentActivities.map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-virel-purple-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-sm">{item.text}</p>
                  <p className="text-white/30 text-xs mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
