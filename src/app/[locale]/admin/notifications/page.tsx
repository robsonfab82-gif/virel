"use client";
import { useState } from "react";
import { Bell, Send, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const pastNotifications = [
  {
    id: "1",
    title: "Nova funcionalidade: IA de Legendas v2",
    message: "Melhoramos o motor de geração de legendas com novos modelos de IA. Experimente agora!",
    target: "Todos",
    date: "01 Mai 2026",
    sent: 1247,
  },
  {
    id: "2",
    title: "Manutenção programada — 30/04 às 02h",
    message: "Realizaremos uma manutenção de 30 minutos. A plataforma ficará indisponível brevemente.",
    target: "Todos",
    date: "29 Abr 2026",
    sent: 1203,
  },
  {
    id: "3",
    title: "Seu trial está acabando!",
    message: "Você tem 2 dias restantes no período de teste. Faça upgrade para continuar crescendo.",
    target: "Trial",
    date: "28 Abr 2026",
    sent: 43,
  },
];

const targetOptions = [
  { value: "all", label: "Todos os usuários" },
  { value: "plan_start", label: "Plano Start" },
  { value: "plan_pro", label: "Plano Pro" },
  { value: "plan_ultra", label: "Plano Ultra" },
  { value: "trialing", label: "Usuários em Trial" },
];

export default function AdminNotificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", target: "all" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    setIsModalOpen(false);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notificações</h1>
          <p className="text-white/50 mt-1">Envie mensagens para os usuários da plataforma</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus size={16} />
          Nova Notificação
        </Button>
      </div>

      {sent && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-400 text-sm font-medium flex items-center gap-2">
            <Send size={16} />
            Notificação enviada com sucesso!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {pastNotifications.map((n) => (
          <Card key={n.id} className="hover:border-virel-purple-500/20 transition-all">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-virel-purple-400 flex-shrink-0" />
                <h3 className="text-white font-semibold text-sm">{n.title}</h3>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="purple" className="text-xs">{n.target}</Badge>
                <span className="text-white/30 text-xs">{n.date}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm">{n.message}</p>
            <p className="text-white/30 text-xs mt-2">{n.sent.toLocaleString()} usuários notificados</p>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Notificação"
        description="Envie uma notificação para os usuários selecionados"
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={send} loading={loading}>
              <Send size={16} />
              Enviar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Nova funcionalidade disponível!"
          />
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Mensagem</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full h-24 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
              placeholder="Escreva a mensagem para os usuários..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Destinatários</label>
            <div className="grid grid-cols-2 gap-2">
              {targetOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, target: opt.value })}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg border text-xs transition-all",
                    form.target === opt.value
                      ? "border-virel-purple-500 bg-virel-purple-500/10 text-virel-purple-300"
                      : "border-virel-dark-border text-white/50 hover:border-virel-purple-500/30"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
