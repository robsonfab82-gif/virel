"use client";
import { useState } from "react";
import { Zap, Briefcase, BookOpen, Copy, Check, Sparkles, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { openai } from "@/lib/openai/client";

const styles = [
  { key: "viral", label: "Viral", icon: Zap, color: "from-pink-500 to-red-500", desc: "Para máximo engajamento" },
  { key: "professional", label: "Profissional", icon: Briefcase, color: "from-virel-blue-500 to-cyan-500", desc: "Tom formal e autoridade" },
  { key: "storytelling", label: "Storytelling", icon: BookOpen, color: "from-virel-purple-500 to-pink-500", desc: "Narrativa envolvente" },
] as const;

type Style = "viral" | "professional" | "storytelling";

export default function CaptionsPage() {
  const [context, setContext] = useState("");
  const [activeStyle, setActiveStyle] = useState<Style>("viral");
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const captions = await openai.generateCaptions({
        context,
        style: activeStyle,
      });
      setGeneratedCaptions(captions);
    } catch {
      setError("Não foi possível gerar as legendas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">IA de Legendas</h1>
        <p className="text-white/50 mt-1">Gere legendas irresistíveis para seu Instagram</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input section */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-white font-bold mb-4">Contexto do Post</h2>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Descreva o que é o seu post, o que quer comunicar, para quem é... quanto mais detalhes, melhor!"
              className="w-full h-32 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
            />
          </Card>

          <Card>
            <h2 className="text-white font-bold mb-4">Estilo da Legenda</h2>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveStyle(s.key)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all",
                      activeStyle === s.key
                        ? "border-virel-purple-500 bg-virel-purple-500/10"
                        : "border-virel-dark-border hover:border-virel-purple-500/40"
                    )}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold">{s.label}</span>
                    <span className="text-white/40 text-xs leading-tight">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <Button size="lg" className="w-full" onClick={generate} loading={loading}>
            <Sparkles size={18} />
            {loading ? "Gerando com IA..." : "Gerar Legendas"}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {generatedCaptions.length === 0 ? (
            <Card className="flex flex-col items-center justify-center h-64 text-center">
              <Sparkles size={40} className="text-white/10 mb-3" />
              <p className="text-white/30 text-sm">
                Configure o contexto e estilo,<br />depois clique em Gerar
              </p>
            </Card>
          ) : (
            generatedCaptions.map((caption, i) => (
              <Card key={i} className="relative group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-virel-purple-400 text-xs font-medium">Opção {i + 1}</span>
                  <button
                    onClick={() => copy(caption, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white flex items-center gap-1 text-xs"
                  >
                    {copiedIndex === i ? (
                      <><Check size={14} className="text-green-400" /><span className="text-green-400">Copiado!</span></>
                    ) : (
                      <><Copy size={14} />Copiar</>
                    )}
                  </button>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{caption}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
