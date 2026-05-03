import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, MessageSquare } from "lucide-react";

const feedbacks = [
  { id: "1", user: "Ana Beatriz", email: "ana@email.com", rating: 5, category: "Elogio", message: "A ferramenta de legendas é incrível! Economizei horas toda semana.", date: "02 Mai 2026", replied: true },
  { id: "2", user: "Carlos Lima", email: "carlos@email.com", rating: 4, category: "Sugestão", message: "Seria legal ter integração com TikTok também!", date: "01 Mai 2026", replied: false },
  { id: "3", user: "Mariana Costa", email: "mariana@email.com", rating: 5, category: "Geral", message: "O planejador de conteúdo transformou minha rotina.", date: "30 Abr 2026", replied: true },
  { id: "4", user: "Pedro Rocha", email: "pedro@email.com", rating: 3, category: "Bug", message: "A busca de hashtags às vezes retorna resultados repetidos.", date: "29 Abr 2026", replied: false },
  { id: "5", user: "Juliana Alves", email: "juliana@email.com", rating: 5, category: "Elogio", message: "Melhor plataforma de crescimento que já usei. 10/10!", date: "28 Abr 2026", replied: true },
  { id: "6", user: "Roberto Silva", email: "roberto@email.com", rating: 2, category: "Crítica", message: "O carregamento do dashboard está um pouco lento.", date: "27 Abr 2026", replied: false },
];

const categoryColor: Record<string, "success" | "warning" | "error" | "info" | "purple"> = {
  Elogio: "success",
  Sugestão: "info",
  Bug: "error",
  Crítica: "warning",
  Geral: "purple",
};

export default function AdminFeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Feedback dos Usuários</h1>
        <p className="text-white/50 mt-1">{feedbacks.length} feedbacks recebidos</p>
      </div>

      <div className="space-y-3">
        {feedbacks.map((fb) => (
          <Card key={fb.id} className="hover:border-virel-purple-500/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 bg-gradient-virel rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {fb.user[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm">{fb.user}</p>
                  <p className="text-white/40 text-xs">{fb.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < fb.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}
                    />
                  ))}
                </div>
                <Badge variant={categoryColor[fb.category]} className="text-xs">{fb.category}</Badge>
                <Badge variant={fb.replied ? "success" : "warning"} className="text-xs">
                  {fb.replied ? "Respondido" : "Pendente"}
                </Badge>
                <span className="text-white/30 text-xs hidden md:block">{fb.date}</span>
              </div>
            </div>

            <p className="text-white/70 text-sm mt-3">{fb.message}</p>

            {!fb.replied && (
              <div className="mt-3 flex justify-end">
                <Button variant="secondary" size="sm" className="text-xs">
                  <MessageSquare size={14} />
                  Responder
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
