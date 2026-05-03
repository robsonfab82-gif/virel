"use client";
import { useState } from "react";
import { Send, Star, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const categories = ["Geral", "Sugestão", "Bug", "Elogio", "Crítica"];

const pastFeedbacks = [
  {
    id: "1",
    rating: 5,
    category: "Elogio",
    message: "A ferramenta de legendas é incrível! Economizei horas toda semana.",
    date: "28 Abr, 2026",
    reply: "Obrigado pelo feedback! Ficamos muito felizes em saber que está ajudando.",
  },
  {
    id: "2",
    rating: 4,
    category: "Sugestão",
    message: "Seria legal ter integração com TikTok também!",
    date: "15 Abr, 2026",
    reply: null,
  },
  {
    id: "3",
    rating: 5,
    category: "Geral",
    message: "O planejador de conteúdo transformou minha rotina. Recomendo demais!",
    date: "02 Abr, 2026",
    reply: "Adoramos ouvir isso! Continuamos trabalhando para melhorar ainda mais.",
  },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("Geral");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    setRating(0);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Feedback</h1>
        <p className="text-white/50 mt-1">Sua opinião nos ajuda a melhorar o VIREL</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send feedback form */}
        <Card>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Send size={18} className="text-virel-purple-400" />
            Enviar Feedback
          </h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-white font-semibold">Feedback enviado!</p>
              <p className="text-white/50 text-sm mt-1">Obrigado pela sua opinião</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Avaliação</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        size={28}
                        className={cn(
                          "transition-colors",
                          s <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        category === c
                          ? "bg-virel-purple-500/20 border-virel-purple-500 text-virel-purple-300"
                          : "border-virel-dark-border text-white/50 hover:border-virel-purple-500/40"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Mensagem</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte-nos sua experiência ou sugestão..."
                  required
                  className="w-full h-28 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                <Send size={16} />
                Enviar Feedback
              </Button>
            </form>
          )}
        </Card>

        {/* History */}
        <div className="space-y-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <MessageSquare size={18} className="text-virel-purple-400" />
            Histórico
          </h2>
          {pastFeedbacks.map((fb) => (
            <Card key={fb.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="purple" className="text-xs">{fb.category}</Badge>
                  <span className="text-white/30 text-xs">{fb.date}</span>
                </div>
              </div>
              <p className="text-white/70 text-sm">{fb.message}</p>
              {fb.reply && (
                <div className="mt-3 pl-3 border-l-2 border-virel-purple-500/50">
                  <p className="text-virel-purple-300 text-xs font-medium mb-0.5">Resposta do VIREL:</p>
                  <p className="text-white/50 text-xs">{fb.reply}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
