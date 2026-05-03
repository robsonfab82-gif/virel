"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  features: string[];
  isHighlighted: boolean;
  isActive: boolean;
  users: number;
}

const initialPlans: Plan[] = [
  {
    id: "1",
    name: "Start",
    slug: "start",
    price: 47,
    features: ["Score de perfil", "5 ideias/dia", "50 hashtags/mês", "10 legendas/mês", "Suporte email"],
    isHighlighted: false,
    isActive: true,
    users: 437,
  },
  {
    id: "2",
    name: "Pro",
    slug: "pro",
    price: 97,
    features: ["Tudo do Start", "Ideias ilimitadas", "Hashtags ilimitadas", "50 legendas/mês", "Análise concorrentes (3)", "Planejador", "Suporte prioritário"],
    isHighlighted: true,
    isActive: true,
    users: 612,
  },
  {
    id: "3",
    name: "Ultra",
    slug: "ultra",
    price: 197,
    features: ["Tudo do Pro", "Legendas ilimitadas", "Análise ilimitada", "API de integração", "Relatórios avançados", "Gerente dedicado"],
    isHighlighted: false,
    isActive: true,
    users: 198,
  },
];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", price: "", features: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", price: "", features: "" });
    setIsModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      features: plan.features.join("\n"),
    });
    setIsModalOpen(true);
  };

  const save = () => {
    const features = form.features.split("\n").filter((f) => f.trim());
    if (editing) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, name: form.name, price: Number(form.price), features }
            : p
        )
      );
    } else {
      setPlans((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: form.name,
          slug: form.name.toLowerCase(),
          price: Number(form.price),
          features,
          isHighlighted: false,
          isActive: true,
          users: 0,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleActive = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Planos</h1>
          <p className="text-white/50 mt-1">Gerencie os planos da plataforma em tempo real</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} />
          Novo Plano
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.isHighlighted ? "border-virel-purple-500" : ""}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-black text-xl">{plan.name}</h3>
                <span className="text-2xl font-black text-white">R${plan.price}<span className="text-white/40 text-sm font-normal">/mês</span></span>
              </div>
              <div className="flex gap-1">
                <Badge variant={plan.isActive ? "success" : "error"}>
                  {plan.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70 text-xs">
                  <Check size={12} className="text-virel-purple-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-virel-dark-border flex items-center justify-between">
              <span className="text-white/40 text-xs">{plan.users} usuários</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(plan)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:bg-red-500/5" onClick={() => deletePlan(plan.id)}>
                  <Trash2 size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleActive(plan.id)}
                >
                  {plan.isActive ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar Plano" : "Novo Plano"}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nome do Plano"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Start, Pro, Ultra"
          />
          <Input
            label="Preço (R$)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="47"
          />
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">
              Recursos (um por linha)
            </label>
            <textarea
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full h-28 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
              placeholder={"Score de perfil\n5 ideias/dia\n50 hashtags/mês"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
