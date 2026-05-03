import { Users, DollarSign, TrendingDown, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

const stats = [
  { label: "Total de Usuários", value: 1247, growth: 12.4, icon: Users, color: "text-virel-purple-400", bg: "bg-virel-purple-500/10" },
  { label: "MRR", value: "R$48.293", growth: 8.7, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", isString: true },
  { label: "Churn", value: "2.1%", growth: -0.3, icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", isString: true, invertGrowth: true },
  { label: "Conversão", value: "8.3%", growth: 1.2, icon: TrendingUp, color: "text-virel-blue-400", bg: "bg-virel-blue-500/10", isString: true },
];

const recentUsers = [
  { name: "Ana Beatriz Santos", email: "ana@email.com", plan: "Pro", status: "active", date: "02 Mai 2026" },
  { name: "Carlos Lima", email: "carlos@email.com", plan: "Start", status: "trialing", date: "01 Mai 2026" },
  { name: "Mariana Costa", email: "mariana@email.com", plan: "Ultra", status: "active", date: "30 Abr 2026" },
  { name: "Pedro Rocha", email: "pedro@email.com", plan: "Pro", status: "active", date: "29 Abr 2026" },
  { name: "Juliana Alves", email: "ju@email.com", plan: "Start", status: "active", date: "28 Abr 2026" },
];

const planDistribution = [
  { name: "Pro", count: 612, percent: 49 },
  { name: "Start", count: 437, percent: 35 },
  { name: "Ultra", count: 198, percent: 16 },
];

const statusColors = {
  active: "success" as const,
  trialing: "warning" as const,
  suspended: "error" as const,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard Admin</h1>
        <p className="text-white/50 mt-1">Visão geral da plataforma VIREL</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const isPositive = s.invertGrowth ? s.growth <= 0 : s.growth >= 0;
          return (
            <Card key={s.label}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} className={s.color} />
                </div>
                <Badge variant={isPositive ? "success" : "error"} className="gap-0.5">
                  {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {Math.abs(s.growth)}%
                </Badge>
              </div>
              <div className="text-2xl font-black text-white">
                {s.isString ? s.value : formatNumber(s.value as number)}
              </div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-white font-bold mb-4">Usuários Recentes</h2>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-virel-dark-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-virel rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-white/40 text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="purple" className="text-xs">{u.plan}</Badge>
                  <Badge variant={statusColors[u.status as keyof typeof statusColors]} className="text-xs capitalize">{u.status}</Badge>
                  <span className="text-white/30 text-xs hidden md:block">{u.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-white font-bold mb-4">Distribuição de Planos</h2>
          <div className="space-y-4">
            {planDistribution.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/70">{p.name}</span>
                  <span className="text-white font-semibold">{p.count} ({p.percent}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-virel"
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-virel-dark-border">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Total ativo</span>
              <span className="text-white font-bold">1.247</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-white/50">Trial</span>
              <span className="text-yellow-400 font-bold">43</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
