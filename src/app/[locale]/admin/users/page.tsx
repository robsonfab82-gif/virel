"use client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const users = Array.from({ length: 15 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ["Ana Beatriz", "Carlos Lima", "Mariana Costa", "Pedro Rocha", "Juliana Alves", "Roberto Silva", "Camila Dias", "Fernando Gomes", "Lucia Oliveira", "Miguel Santos", "Isabel Ferreira", "Diego Costa", "Beatriz Lima", "Rafael Souza", "Tatiana Mendes"][i],
  email: `user${i + 1}@email.com`,
  instagram: `@user${i + 1}`,
  plan: ["Start", "Pro", "Ultra", "Pro", "Start", "Pro", "Ultra", "Start", "Pro", "Pro", "Start", "Ultra", "Pro", "Start", "Pro"][i],
  status: ["active", "active", "active", "trialing", "active", "suspended", "active", "active", "trialing", "active", "active", "active", "trialing", "active", "active"][i] as "active" | "trialing" | "suspended",
  date: `0${(i % 9) + 1} Mai 2026`,
  mrr: [47, 97, 197, 97, 47, 97, 197, 47, 97, 97, 47, 197, 97, 47, 97][i],
}));

const statusBadge = {
  active: "success" as const,
  trialing: "warning" as const,
  suspended: "error" as const,
};

const statusLabels = { active: "Ativo", trialing: "Trial", suspended: "Suspenso" };

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Usuários</h1>
          <p className="text-white/50 mt-1">{users.length} usuários cadastrados</p>
        </div>
        <Button variant="secondary" size="sm">
          <Filter size={16} />
          Filtros
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-virel-dark-border">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            prefixIcon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-virel-dark-border">
                {["Usuário", "Instagram", "Plano", "MRR", "Status", "Cadastro", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white/40 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-virel-dark-border hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-virel rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-white/40 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-sm">{user.instagram}</td>
                  <td className="px-4 py-3">
                    <Badge variant="purple" className="text-xs">{user.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white text-sm font-medium">R${user.mrr}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[user.status]} className="text-xs">
                      {statusLabels[user.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">{user.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-2">Ver</Button>
                      <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-red-400 hover:bg-red-500/5">Suspender</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
