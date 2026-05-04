import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Star, MessageSquare } from "lucide-react";

const feedbacks: any[] = [];

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
