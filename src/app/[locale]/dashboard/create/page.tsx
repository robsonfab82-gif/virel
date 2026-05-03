"use client";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Image as ImageIcon,
  Hash,
  FileText,
  Wand2,
  Clock,
  ChevronRight,
  AlertCircle,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BrandProfile,
  CreativeFormat,
  GeneratedCreative,
  generateCreative,
  loadBrandProfile,
  saveCreativeToHistory,
  loadCreativesHistory,
} from "@/lib/openai/client";

const FORMATS: { value: CreativeFormat; label: string; size: string; ratio: string }[] = [
  { value: "feed", label: "Post Feed", size: "1080×1080", ratio: "1/1" },
  { value: "stories", label: "Stories", size: "1080×1920", ratio: "9/16" },
  { value: "reels", label: "Reels Cover", size: "1080×1350", ratio: "4/5" },
];

const IDEA_EXAMPLES = [
  "promoção de verão 20% off",
  "post motivacional para segunda-feira",
  "lançamento de produto novo",
  "dica rápida do nicho",
  "bastidores do negócio",
  "depoimento de cliente",
];

export default function CreatePage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [tab, setTab] = useState<"generate" | "history">("generate");
  const [idea, setIdea] = useState("");
  const [format, setFormat] = useState<CreativeFormat>("feed");
  const [loading, setLoading] = useState(false);
  const [creative, setCreative] = useState<GeneratedCreative | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"design" | "copy" | "caption" | "hashtags">("design");
  const [copied, setCopied] = useState<string | null>(null);
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [history, setHistory] = useState<GeneratedCreative[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrand(loadBrandProfile());
    setHistory(loadCreativesHistory());
  }, []);

  async function handleGenerate() {
    if (!idea.trim()) return;
    const brandProfile = brand ?? {
      name: "Minha Marca",
      niche: "negocios" as const,
      tone: "profissional" as const,
      targetAge: "",
      targetGender: "",
      targetInterests: "",
      primaryColor: "#7C3AED",
      secondaryColor: "#2563EB",
      accentColor: "#8B5CF6",
      keywords: [],
      description: "",
    };

    setLoading(true);
    try {
      const result = await generateCreative(brandProfile, idea.trim(), format);
      setCreative(result);
      saveCreativeToHistory(result);
      setHistory(loadCreativesHistory());
      setActiveResultTab("design");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleDownload() {
    if (!previewRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `criativo-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Erro ao baixar a imagem. Tente novamente.");
    }
  }

  function openHistoryCreative(c: GeneratedCreative) {
    setCreative(c);
    setIdea(c.idea);
    setFormat(c.format);
    setTab("generate");
    setActiveResultTab("design");
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const aspectClass: Record<CreativeFormat, string> = {
    feed: "aspect-square",
    stories: "aspect-[9/16]",
    reels: "aspect-[4/5]",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-gradient-virel rounded-xl flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Gerador de Criativos</h1>
          </div>
          <p className="text-white/50">
            Descreva uma ideia e a IA cria um criativo completo adaptado à sua marca.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-virel-dark-card border border-virel-dark-border rounded-xl p-1">
          <button
            onClick={() => setTab("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === "generate"
                ? "bg-gradient-virel text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Gerar
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === "history"
                ? "bg-gradient-virel text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Clock size={14} />
            Histórico
            {history.length > 0 && (
              <span className="bg-virel-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Math.min(history.length, 99)}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === "generate" ? (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* ── Input Panel ── */}
          <div className="lg:col-span-2 space-y-5">
            {!brand && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
                <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Brand Profile não configurado</p>
                  <p className="text-yellow-400/70 text-xs mt-0.5">
                    Os criativos usarão cores padrão.{" "}
                    <Link
                      href={`/${locale}/dashboard/brand`}
                      className="underline hover:text-yellow-300 transition-colors"
                    >
                      Configurar agora
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <Card>
              <label className="text-white font-semibold text-sm mb-3 block">
                Descreva sua ideia
              </label>
              <textarea
                rows={4}
                className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors resize-none"
                placeholder="Ex: promoção de verão 20% off, post motivacional para segunda-feira, lançamento de produto novo..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {IDEA_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setIdea(ex)}
                    className="text-xs text-white/40 bg-white/5 hover:bg-white/10 hover:text-white/70 px-2 py-1 rounded-lg transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <label className="text-white font-semibold text-sm mb-3 block">
                Formato do criativo
              </label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      format === f.value
                        ? "border-virel-purple-500 bg-virel-purple-500/10"
                        : "border-virel-dark-border hover:border-virel-purple-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`border border-white/20 rounded bg-white/5 flex-shrink-0 ${
                          f.value === "feed"
                            ? "w-6 h-6"
                            : f.value === "stories"
                            ? "w-4 h-7"
                            : "w-5 h-6"
                        }`}
                      />
                      <span className="text-white font-medium text-sm">{f.label}</span>
                    </div>
                    <span className="text-white/40 text-xs">{f.size}</span>
                  </button>
                ))}
              </div>
            </Card>

            {brand && (
              <Card padding="sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
                    }}
                  >
                    {brand.logo ? (
                      <img src={brand.logo} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-white font-black text-xs">
                        {brand.name?.[0]?.toUpperCase() || "M"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {brand.name || "Minha Marca"}
                    </p>
                    <p className="text-white/40 text-xs">
                      Tom: {brand.tone} · Nicho: {brand.niche}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/dashboard/brand`}
                    className="ml-auto text-virel-purple-400 hover:text-virel-purple-300 transition-colors"
                  >
                    <Palette size={16} />
                  </Link>
                </div>
              </Card>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              loading={loading}
              disabled={!idea.trim()}
            >
              {loading ? (
                "A IA está criando..."
              ) : (
                <>
                  <Wand2 size={18} />
                  Gerar Criativo
                </>
              )}
            </Button>
          </div>

          {/* ── Result Panel ── */}
          <div className="lg:col-span-3">
            {!creative && !loading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-virel-dark-border rounded-2xl flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-16 h-16 bg-virel-purple-500/10 rounded-2xl flex items-center justify-center">
                  <Sparkles size={28} className="text-virel-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Seu criativo aparecerá aqui</p>
                  <p className="text-white/40 text-sm mt-1">
                    Descreva uma ideia e clique em &quot;Gerar Criativo&quot;
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[400px] border border-virel-dark-border rounded-2xl flex flex-col items-center justify-center gap-6 p-8">
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full animate-spin" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="url(#spinGradCreate)" strokeWidth="6" strokeLinecap="round" strokeDasharray="44 132" />
                    <defs>
                      <linearGradient id="spinGradCreate" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={16} className="text-virel-purple-400" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-white font-semibold">A IA está criando seu criativo...</p>
                  <p className="text-white/40 text-sm">Analisando identidade da marca e gerando conteúdo</p>
                </div>
              </div>
            )}

            {creative && !loading && (
              <div className="space-y-4">
                {/* Result tabs */}
                <div className="flex bg-virel-dark-card border border-virel-dark-border rounded-xl p-1 gap-1">
                  {(
                    [
                      { key: "design", label: "Design", icon: ImageIcon },
                      { key: "copy", label: "Copy", icon: FileText },
                      { key: "caption", label: "Legenda", icon: FileText },
                      { key: "hashtags", label: "Hashtags", icon: Hash },
                    ] as { key: typeof activeResultTab; label: string; icon: typeof ImageIcon }[]
                  ).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveResultTab(key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeResultTab === key
                          ? "bg-gradient-virel text-white"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Design tab */}
                {activeResultTab === "design" && (
                  <div className="space-y-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={handleDownload}>
                        <Download size={14} />
                        Baixar PNG
                      </Button>
                    </div>
                    <div
                      ref={previewRef}
                      className={`w-full max-w-xs mx-auto rounded-2xl overflow-hidden relative ${aspectClass[creative.format]}`}
                      style={{ background: creative.design.bgStyle }}
                    >
                      {/* Background decoration */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/20" />
                      </div>

                      <div className="relative z-10 h-full flex flex-col justify-between p-6">
                        {/* Top: logo / brand name */}
                        <div className="flex items-center gap-2">
                          {creative.brand.logo ? (
                            <img src={creative.brand.logo} alt="" className="h-8 object-contain" />
                          ) : (
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                              <span className="text-white font-black text-sm">
                                {creative.brand.name?.[0]?.toUpperCase() || "M"}
                              </span>
                            </div>
                          )}
                          <span className="text-white/80 text-sm font-semibold">
                            {creative.brand.name || "Minha Marca"}
                          </span>
                        </div>

                        {/* Center: headline */}
                        <div className="my-4">
                          <h2 className="text-white font-black text-xl leading-tight drop-shadow-lg">
                            {creative.design.headline}
                          </h2>
                          <p className="text-white/70 text-sm mt-2 leading-relaxed">
                            {creative.design.subheadline}
                          </p>
                        </div>

                        {/* Bottom: CTA */}
                        <div className="inline-flex self-start">
                          <span
                            className="px-4 py-2 rounded-full text-sm font-bold text-white"
                            style={{ background: "rgba(255,255,255,0.25)" }}
                          >
                            {creative.design.ctaText}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-white/30 text-xs">
                      {FORMATS.find((f) => f.value === creative.format)?.label} — {FORMATS.find((f) => f.value === creative.format)?.size}
                    </p>
                  </div>
                )}

                {/* Copy tab */}
                {activeResultTab === "copy" && (
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">Copy do Post</h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(creative.copy, "copy")}
                      >
                        {copied === "copy" ? <Check size={14} /> : <Copy size={14} />}
                        {copied === "copy" ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">
                      {creative.copy}
                    </p>
                  </Card>
                )}

                {/* Caption tab */}
                {activeResultTab === "caption" && (
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">Legenda para Instagram</h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(creative.caption, "caption")}
                      >
                        {copied === "caption" ? <Check size={14} /> : <Copy size={14} />}
                        {copied === "caption" ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">
                      {creative.caption}
                    </p>
                  </Card>
                )}

                {/* Hashtags tab */}
                {activeResultTab === "hashtags" && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">
                        Hashtags{" "}
                        <span className="text-white/40 text-sm font-normal">
                          ({creative.hashtags.length})
                        </span>
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          handleCopy(creative.hashtags.join(" "), "hashtags")
                        }
                      >
                        {copied === "hashtags" ? <Check size={14} /> : <Copy size={14} />}
                        {copied === "hashtags" ? "Copiado!" : "Copiar Todos"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {creative.hashtags.map((ht) => (
                        <span
                          key={ht}
                          className="bg-virel-purple-500/15 border border-virel-purple-500/30 text-virel-purple-300 text-sm px-3 py-1 rounded-full"
                        >
                          {ht}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History tab */
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="border-2 border-dashed border-virel-dark-border rounded-2xl p-12 text-center">
              <Clock size={32} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50">Nenhum criativo gerado ainda.</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => setTab("generate")}
              >
                Gerar primeiro criativo
              </Button>
            </div>
          ) : (
            history.map((c) => (
              <button
                key={c.id}
                onClick={() => openHistoryCreative(c)}
                className="w-full text-left bg-virel-dark-card border border-virel-dark-border hover:border-virel-purple-500/40 rounded-xl p-4 flex items-center gap-4 transition-all group"
              >
                {/* Mini preview */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${c.brand.primaryColor}, ${c.brand.secondaryColor})`,
                  }}
                >
                  <Sparkles size={16} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{c.idea}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {FORMATS.find((f) => f.value === c.format)?.label} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0"
                />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
