import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const payments: any[] = [];

const statusBadge = {
  paid: "success" as const,
  pending: "warning" as const,
  failed: "error" as const,
};

const statusLabels = { paid: "Pago", pending: "Pendente", failed: "Falhou" };

const totalMRR = payments.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Pagamentos</h1>
        <p className="text-white/50 mt-1">Histórico de transações • MRR: <span className="text-green-400 font-bold">R${totalMRR}</span></p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Pago", val: `R$${totalMRR}`, color: "text-green-400" },
          { label: "Pendente", val: `R${payments.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0)}`, color: "text-yellow-400" },
          { label: "Falhou", val: `R$${payments.filter((p) => p.status === "failed").reduce((a, p) => a + p.amount, 0)}`, color: "text-red-400" },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-virel-dark-border">
                {["ID", "Usuário", "Plano", "Valor", "Status", "Data"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-white/40 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-virel-dark-border hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-white/40 text-xs font-mono">{p.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{p.user}</p>
                    <p className="text-white/40 text-xs">{p.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="purple" className="text-xs">{p.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-white font-bold text-sm">R${p.amount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadge[p.status]} className="text-xs">
                      {statusLabels[p.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
