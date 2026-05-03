"use client";
import Link from "next/link";
import { useState } from "react";
import { AtSign, ArrowRight, Check, TrendingUp, Users, Zap, Palette, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { saveBrandProfile, Niche, VoiceTone } from "@/lib/openai/client";

const plans = [
  { slug: "start", name: "Start", price: "R$47/mês", highlighted: false },
  { slug: "pro", name: "Pro", price: "R$97/mês", highlighted: true },
  { slug: "ultra", name: "Ultra", price: "R$197/mês", highlighted: false },
];

const analysisSteps = [
  { icon: Users, label: "Buscando dados do perfil..." },
  { icon: TrendingUp, label: "Calculando taxa de engajamento..." },
  { icon: Zap, label: "Gerando score de perfil..." },
];

const NICHES: { value: Niche; label: string }[] = [
  { value: "moda", label: "Moda" },
  { value: "fitness", label: "Fitness" },
  { value: "gastronomia", label: "Gastronomia" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "beleza", label: "Beleza" },
  { value: "educacao", label: "Educação" },
  { value: "saude", label: "Saúde" },
  { value: "negocios", label: "Negócios" },
  { value: "outro", label: "Outro" },
];

const TONES: { value: VoiceTone; label: string }[] = [
  { value: "profissional", label: "Profissional" },
  { value: "casual", label: "Casual" },
  { value: "divertido", label: "Divertido" },
  { value: "inspirador", label: "Inspirador" },
  { value: "educativo", label: "Educativo" },
  { value: "provocativo", label: "Provocativo" },
];

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function OnboardingPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const [step, setStep] = useState(1);
  const [instagram, setInstagram] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStepIdx, setAnalysisStepIdx] = useState(0);

  // Fallback modal state
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackHandle, setFallbackHandle] = useState("");

  // Brand step
  const [brandName, setBrandName] = useState("");
  const [niche, setNiche] = useState<Niche>("negocios");
  const [tone, setTone] = useState<VoiceTone>("profissional");
  const [primaryColor, setPrimaryColor] = useState("#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState("#2563EB");

  async function handleConnectInstagram() {
    // Navigate the browser directly so the 307 redirect to Meta is followed natively.
    // fetch() to an endpoint that returns 307 fails in the browser because the
    // redirect is opaque; window.location.href lets the browser handle it.
    window.location.href = "/api/auth/instagram";
  }

  async function handleFallbackContinue() {
    const handle = fallbackHandle.trim().replace(/^@/, "");
    if (!handle) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("virel_instagram_handle", handle);
    }
    setInstagram(handle);
    setShowFallback(false);
    setAnalyzing(true);
    setAnalysisStepIdx(0);
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStepIdx(i);
      await new Promise((r) => setTimeout(r, 900));
    }
    setAnalyzing(false);
    setStep(2);
  }

  const handleContinue = async () => {
    if (step === 1) {
      if (!instagram.trim()) return;
      if (typeof window !== "undefined") {
        localStorage.setItem("virel_instagram_handle", instagram.trim());
      }
      setAnalyzing(true);
      setAnalysisStepIdx(0);
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStepIdx(i);
        await new Promise((r) => setTimeout(r, 900));
      }
      setAnalyzing(false);
      setStep(2);
      return;
    }
    if (step === 2) {
      saveBrandProfile({
        name: brandName || instagram,
        niche,
        tone,
        targetAge: "",
        targetGender: "",
        targetInterests: "",
        primaryColor,
        secondaryColor,
        accentColor: "#8B5CF6",
        keywords: [],
        description: "",
      });
      setStep(3);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = `/${locale}/dashboard`;
  };

  const selectCls =
    "w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-virel-purple-500 transition-colors appearance-none";

  return (
    <div className="min-h-screen bg-virel-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-virel-purple-600/15 rounded-full blur-[100px]" />
      </div>

      {/* ── Fallback modal ── */}
      {showFallback && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center flex-shrink-0 text-white">
                  <InstagramIcon size={18} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Conexão Instagram</h3>
                  <p className="text-white/40 text-xs">Em breve disponível</p>
                </div>
              </div>
              <button onClick={() => setShowFallback(false)} className="text-white/40 hover:text-white/70 transition-colors">
                ✕
              </button>
            </div>

            <div className="flex gap-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 mb-4">
              <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200/80 text-xs leading-relaxed">
                A conexão via OAuth será ativada em breve. Por enquanto, insira seu @ para continuar.
              </p>
            </div>

            <div className="space-y-1.5 mb-4">
              <label className="text-sm text-white/60">Seu @ do Instagram</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <AtSign size={15} />
                </div>
                <input
                  className="w-full bg-virel-dark border border-virel-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
                  placeholder="seuinstagram"
                  value={fallbackHandle}
                  onChange={(e) => setFallbackHandle(e.target.value.replace(/^@+/, ""))}
                  onKeyDown={(e) => e.key === "Enter" && fallbackHandle.trim() && handleFallbackContinue()}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFallback(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-virel-dark-border text-white/60 text-sm font-medium hover:text-white/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFallbackContinue}
                disabled={!fallbackHandle.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-virel-purple-600 to-blue-600 hover:from-virel-purple-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continuar
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Analysis overlay ── */}
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-virel-dark/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <svg className="w-full h-full animate-spin" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="url(#spinGradOnb)" strokeWidth="6" strokeLinecap="round" strokeDasharray="44 132" />
                <defs>
                  <linearGradient id="spinGradOnb" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black text-sm">V</span>
              </div>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Analisando @{instagram || fallbackHandle}</h2>
            <div className="space-y-3 mt-4">
              {analysisSteps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300",
                      i === analysisStepIdx
                        ? "bg-virel-purple-500/15 border border-virel-purple-500/30"
                        : i < analysisStepIdx
                        ? "opacity-40"
                        : "opacity-20"
                    )}
                  >
                    <Icon size={16} className={i === analysisStepIdx ? "text-virel-purple-400 animate-pulse" : "text-white/40"} />
                    <span className={cn("text-sm", i === analysisStepIdx ? "text-white" : "text-white/40")}>
                      {s.label}
                    </span>
                    {i < analysisStepIdx && <Check size={14} className="ml-auto text-green-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-virel rounded-xl flex items-center justify-center">
              <span className="text-white font-black">V</span>
            </div>
            <span className="text-white font-bold text-2xl">VIREL</span>
          </Link>

          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step >= s ? "bg-gradient-virel text-white" : "bg-virel-dark-card border border-virel-dark-border text-white/40"
                  )}
                >
                  {step > s ? <Check size={12} /> : s}
                </div>
                {s < 3 && (
                  <div className={cn("w-12 h-px", step > s ? "bg-virel-purple-500" : "bg-virel-dark-border")} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-black text-white">
            {step === 1
              ? "Configure seu perfil"
              : step === 2
              ? "Configure sua marca"
              : "Escolha seu plano"}
          </h1>
          <p className="text-white/50 mt-1">
            {step === 1
              ? "Conecte seu Instagram para começar"
              : step === 2
              ? "A IA usará isso para personalizar seus criativos"
              : "7 dias grátis em qualquer plano"}
          </p>
        </div>

        <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6">
          {/* ── Step 1: Instagram connect ── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Big Instagram connect button */}
              <button
                onClick={handleConnectInstagram}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-white text-base transition-all duration-200 shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)",
                }}
              >
                <InstagramIcon size={22} />
                Conectar Instagram
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-virel-dark-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-virel-dark-card px-3 text-white/30">ou digite manualmente</span>
                </div>
              </div>

              <Input
                label="Seu @ do Instagram"
                placeholder="@seuinstagram"
                prefixIcon={<AtSign size={16} />}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace("@", ""))}
              />

              <div className="bg-virel-purple-500/10 border border-virel-purple-500/20 rounded-xl p-4">
                <p className="text-virel-purple-300 text-sm">
                  ✓ Não precisamos da sua senha<br />
                  ✓ Apenas análise de dados públicos<br />
                  ✓ 100% seguro e privado
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Brand ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} className="text-virel-purple-400" />
                <p className="text-white font-semibold text-sm">Identidade da Marca</p>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1.5">Nome da marca</label>
                <input
                  className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
                  placeholder={`Ex: @${instagram || "suamarca"}`}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">Nicho</label>
                  <select
                    className={selectCls}
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as Niche)}
                  >
                    {NICHES.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-1.5">Tom de Voz</label>
                  <select
                    className={selectCls}
                    value={tone}
                    onChange={(e) => setTone(e.target.value as VoiceTone)}
                  >
                    {TONES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-2">Cores da marca</label>
                <div className="flex gap-4">
                  {[
                    { label: "Primária", value: primaryColor, set: setPrimaryColor },
                    { label: "Secundária", value: secondaryColor, set: setSecondaryColor },
                  ].map(({ label, value, set }) => (
                    <div key={label} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-virel-dark-border cursor-pointer overflow-hidden appearance-none"
                      />
                      <span className="text-xs text-white/50">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    {(brandName || instagram || "M")[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{brandName || instagram || "Minha Marca"}</p>
                  <p className="text-white/70 text-xs">
                    {NICHES.find((n) => n.value === niche)?.label} · {TONES.find((t) => t.value === tone)?.label}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Plan ── */}
          {step === 3 && (
            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.slug}
                  onClick={() => setSelectedPlan(plan.slug)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                    selectedPlan === plan.slug
                      ? "border-virel-purple-500 bg-virel-purple-500/10"
                      : "border-virel-dark-border hover:border-virel-purple-500/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedPlan === plan.slug ? "border-virel-purple-500" : "border-white/30"
                      )}
                    >
                      {selectedPlan === plan.slug && (
                        <div className="w-2.5 h-2.5 rounded-full bg-virel-purple-500" />
                      )}
                    </div>
                    <span className="text-white font-semibold">{plan.name}</span>
                    {plan.highlighted && (
                      <span className="text-xs bg-gradient-virel text-white px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-white/60 text-sm">{plan.price}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep((s) => s - 1)}>
                Voltar
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={handleContinue}
              loading={loading}
              disabled={step === 1 && !instagram.trim()}
            >
              {step < 3 ? "Continuar" : "Começar agora"}
              <ArrowRight size={18} />
            </Button>
          </div>

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full text-center text-white/30 text-sm mt-3 hover:text-white/50 transition-colors"
            >
              Pular por agora
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="w-full text-center text-white/30 text-sm mt-3 hover:text-white/50 transition-colors"
            >
              Configurar depois em{" "}
              <span className="underline">Perfil da Marca</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
