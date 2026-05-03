"use client";
import { useState } from "react";
import { Search, Copy, Check, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { openai } from "@/lib/openai/client";

interface HashtagItem {
  tag: string;
  audienceSize: string;
  relevance: number;
  type: string;
}

const DEFAULT_HASHTAGS: HashtagItem[] = [
  { tag: "instagram", audienceSize: "1.2B", relevance: 95, type: "mega" },
  { tag: "instagrambrasil", audienceSize: "45M", relevance: 88, type: "large" },
  { tag: "crescimentoinstagram", audienceSize: "2.1M", relevance: 92, type: "medium" },
  { tag: "dicasinstagram", audienceSize: "890K", relevance: 87, type: "medium" },
  { tag: "marketingdigital", audienceSize: "12M", relevance: 85, type: "large" },
  { tag: "empreendedorismo", audienceSize: "8.5M", relevance: 82, type: "large" },
  { tag: "conteudodigital", audienceSize: "1.8M", relevance: 90, type: "medium" },
  { tag: "criadoresdeconteudo", audienceSize: "3.2M", relevance: 88, type: "medium" },
  { tag: "estrategiadigital", audienceSize: "650K", relevance: 86, type: "small" },
  { tag: "engajamento", audienceSize: "420K", relevance: 84, type: "small" },
  { tag: "reelsbrasil", audienceSize: "15M", relevance: 85, type: "large" },
  { tag: "influencerbrasil", audienceSize: "5M", relevance: 88, type: "medium" },
  { tag: "microinfluencer", audienceSize: "320K", relevance: 89, type: "small" },
  { tag: "nichoinstagram", audienceSize: "180K", relevance: 91, type: "micro" },
  { tag: "hashtagsbrasil", audienceSize: "420K", relevance: 87, type: "small" },
];

const typeColors: Record<string, "error" | "warning" | "info" | "success" | "purple"> = {
  mega: "error",
  large: "warning",
  medium: "info",
  small: "success",
  micro: "purple",
};

const typeLabels: Record<string, string> = {
  mega: "Mega",
  large: "Grande",
  medium: "Média",
  small: "Pequena",
  micro: "Micro",
};

export default function HashtagsPage() {
  const [niche, setNiche] = useState("");
  const [hashtags, setHashtags] = useState<HashtagItem[]>(DEFAULT_HASHTAGS);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await openai.generateHashtags({ niche: niche.trim(), count: 20 });
      setHashtags(result);
    } catch {
      setError("Não foi possível buscar hashtags. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = hashtags.map((h) => `#${h.tag}`).join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Hashtags Inteligentes</h1>
        <p className="text-white/50 mt-1">Encontre as hashtags ideais para maximizar seu alcance</p>
      </div>

      <Card>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Digite seu nicho ou tema (ex: fitness, moda, culinária...)"
              prefixIcon={<Search size={16} />}
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <Button onClick={search} loading={loading} className="shrink-0">
            Buscar
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-white/50 text-sm">{hashtags.length} hashtags encontradas</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={copyAll}
          className="gap-2"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? "Copiado!" : "Copiar todas"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {hashtags.map((h, i) => (
          <HashtagCard key={i} hashtag={h} />
        ))}
      </div>
    </div>
  );
}

function HashtagCard({ hashtag }: { hashtag: HashtagItem }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(`#${hashtag.tag}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-virel-dark-card border border-virel-dark-border rounded-xl p-4 flex items-center justify-between group hover:border-virel-purple-500/30 transition-all">
      <div>
        <div className="text-white font-semibold text-sm">#{hashtag.tag}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={typeColors[hashtag.type] ?? "info"} className="text-xs">
            {typeLabels[hashtag.type] ?? hashtag.type}
          </Badge>
          <span className="text-white/30 text-xs">{hashtag.audienceSize}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-white/60 text-xs">Relevância</div>
          <div className={cn("font-bold text-sm", hashtag.relevance >= 90 ? "text-green-400" : hashtag.relevance >= 80 ? "text-yellow-400" : "text-white/60")}>
            {hashtag.relevance}%
          </div>
        </div>
        <button
          onClick={copy}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
