import { Users, DollarSign, TrendingDown, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";

const stats = [
  { label: "Total de Usuários", value: 0 as number | string, growth: 0, icon: Users, color: "text-virel-purple-400", bg: "bg-virel-purple-500/10" },
  { label: "MRR", value: "R$0" as number | string, growth: 0, icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10", isString: true },
  { label: "Churn", value: "0%" as number | string, growth: 0, icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", isString: true, invertGrowth: true },
  { label: "Conversão", value: "0%" as number | string, growth: 0, icon: TrendingUp, color: "text-virel-blue-400", bg: "bg-virel-blue-500/10", isString: true },
];

const recentUsers: { name: string; email: string; status: string; date: string }[] = [];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-white/50 mt-1">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.invertGrowth ? stat.growth < 0 : stat.growth > 0;
          const Arrow = isPositive ? ArrowUp : ArrowDown;

          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">
                    {stat.isString ? stat.value : formatNumber(stat.value)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Arrow size={14} className={isPositive ? "text-green-400" : "text-red-400"} />
                <span className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {Math.abs(stat.growth)}%
                </span>
                <span className="text-white/30 text-sm"> vs mês anterior</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Usuários Recentes</h3>
          {recentUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/30">Nenhum usuário cadastrado ainda.</p>
              <p className="text-white/20 text-sm mt-1">Os usuários aparecerão aqui quando se cadastrarem.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between p-3 bg-virel-dark/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-virel flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.status === "active" ? "success" : user.status === "trialing" ? "warning" : "error"}>
                      {user.status === "active" ? "Ativo" : user.status === "trialing" ? "Trial" : "Cancelado"}
                    </Badge>
                    <span className="text-white/30 text-xs">{user.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Planos</h3>
          <div className="space-y-4">
            {[
              { name: "Start", users: 0, color: "bg-green-500" },
              { name: "Pro", users: 0, color: "bg-virel-blue-500" },
              { name: "Ultra", users: 0, color: "bg-virel-purple-500" },
            ].map((plan) => (
              <div key={plan.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-sm">{plan.name}</span>
                  <span className="text-white font-bold text-sm">{plan.users}</span>
                </div>
                <div className="h-2 bg-virel-dark-border rounded-full overflow-hidden">
                  <div className={`h-full ${plan.color} rounded-full`} style={{ width: "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
