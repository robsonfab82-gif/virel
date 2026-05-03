"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Palette,
  Save,
  Check,
  Upload,
  X,
  Plus,
  AtSign,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  FileText,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BrandProfile,
  Niche,
  VoiceTone,
  saveBrandProfile,
  loadBrandProfile,
  analyzeInstagramProfile,
} from "@/lib/openai/client";

// ─── Constants ────────────────────────────────────────────────

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

const TONES: { value: VoiceTone; label: string; desc: string }[] = [
  { value: "profissional", label: "Profissional", desc: "Sério e confiável" },
  { value: "casual", label: "Casual", desc: "Leve e próximo" },
  { value: "divertido", label: "Divertido", desc: "Energético e criativo" },
  { value: "inspirador", label: "Inspirador", desc: "Motivacional e positivo" },
  { value: "educativo", label: "Educativo", desc: "Informativo e claro" },
  { value: "provocativo", label: "Provocativo", desc: "Ousado e questionador" },
];

const BASE_ANALYSIS_STEPS = [
  { label: "Conectando ao perfil...", duration: 1000 },
  { label: "Analisando bio e descrição...", duration: 1500 },
  { label: "Detectando cores da marca...", duration: 1500 },
  { label: "Identificando tom de voz...", duration: 1000 },
  { label: "Mapeando público-alvo...", duration: 1000 },
  { label: "Gerando perfil da marca...", duration: 1000 },
];

const RICH_ANALYSIS_STEPS = [
  { label: "Processando informações fornecidas...", duration: 1000 },
  { label: "Analisando bio...", duration: 1200 },
  { label: "Identificando nicho do negócio...", duration: 1300 },
  { label: "Detectando cores da marca...", duration: 1200 },
  { label: "Definindo tom de voz e público-alvo...", duration: 1000 },
  { label: "Gerando perfil da marca com precisão...", duration: 1000 },
];

const DEFAULT_PROFILE: BrandProfile = {
  name: "",
  niche: "negocios",
  tone: "profissional",
  targetAge: "",
  targetGender: "",
  targetInterests: "",
  primaryColor: "#7C3AED",
  secondaryColor: "#2563EB",
  accentColor: "#8B5CF6",
  logo: undefined,
  keywords: [],
  description: "",
};

// ─── Types ────────────────────────────────────────────────────

interface InstagramConnectionData {
  username: string;
  name: string;
  bio: string;
  picture: string;
  mediaCount: number;
  website: string;
}

// ─── Instagram SVG icon ───────────────────────────────────────

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
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
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ─── "Coming soon" modal ──────────────────────────────────────

interface FallbackModalProps {
  instagramHandle: string;
  setInstagramHandle: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  siteUrl: string;
  setSiteUrl: (v: string) => void;
  businessDescription: string;
  setBusinessDescription: (v: string) => void;
  onAnalyze: () => void;
  onClose: () => void;
  analyzing: boolean;
}

function FallbackModal({
  instagramHandle,
  setInstagramHandle,
  bio,
  setBio,
  siteUrl,
  setSiteUrl,
  businessDescription,
  setBusinessDescription,
  onAnalyze,
  onClose,
  analyzing,
}: FallbackModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center flex-shrink-0">
              <InstagramIcon size={18} />
            </div>
            <div>
              <h2 className="text-white font-bold">Conexão Instagram</h2>
              <p className="text-white/40 text-xs">Em breve disponível</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Info box */}
        <div className="flex gap-3 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3.5 mb-5">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/80 text-sm leading-relaxed">
            A conexão direta com Instagram via OAuth será ativada em breve. Por enquanto, insira
            seu @ manualmente para a IA analisar seu perfil.
          </p>
        </div>

        {/* Manual input form */}
        <div className="space-y-4">
          {/* Handle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">@ do Instagram *</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                <AtSign size={15} />
              </div>
              <input
                className="w-full bg-virel-dark border border-virel-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
                placeholder="seuinstagram"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value.replace(/^@+/, ""))}
                onKeyDown={(e) => e.key === "Enter" && instagramHandle.trim() && onAnalyze()}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
              <FileText size={13} className="text-white/40" />
              Bio do Instagram
              <span className="text-white/30 font-normal">(opcional — melhora a análise)</span>
            </label>
            <textarea
              rows={3}
              className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors resize-none"
              placeholder="Cole sua bio para a IA analisar melhor seu perfil..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Site URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
              <Globe size={13} className="text-white/40" />
              URL do site
              <span className="text-white/30 font-normal">(opcional)</span>
            </label>
            <input
              type="url"
              className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
              placeholder="https://seusite.com.br"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
            />
          </div>

          {/* Business description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
              <Sparkles size={13} className="text-white/40" />
              O que você faz?
              <span className="text-white/30 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors resize-none"
              placeholder='Ex: "Vendo roupas femininas", "Sou personal trainer", "App de mobilidade urbana"'
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-virel-dark-border text-white/60 text-sm font-medium hover:text-white/80 hover:border-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onAnalyze}
            disabled={!instagramHandle.trim() || analyzing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-virel-purple-600 to-blue-600 hover:from-virel-purple-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-virel-purple-900/30"
          >
            <Sparkles size={15} />
            Analisar com IA
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function BrandPage() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<BrandProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Instagram OAuth connection state
  const [igConnected, setIgConnected] = useState<InstagramConnectionData | null>(null);

  // Manual analysis state
  const [instagramHandle, setInstagramHandle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Perfil da marca detectado com sucesso!");
  const [aiFilledFields, setAiFilledFields] = useState(false);

  // Extra context fields (inside modal)
  const [bio, setBio] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [extraOpen, setExtraOpen] = useState(false);

  // Modal state
  const [showFallbackModal, setShowFallbackModal] = useState(false);

  // ── On mount: load stored data + handle OAuth callback params ──
  useEffect(() => {
    const stored = loadBrandProfile();
    if (stored) setProfile(stored);

    if (typeof window !== "undefined") {
      const savedHandle = localStorage.getItem("virel_instagram_handle");
      if (savedHandle) setInstagramHandle(savedHandle);

      // Restore OAuth connection from localStorage
      const savedIg = localStorage.getItem("virel_ig_connection");
      if (savedIg) {
        try {
          setIgConnected(JSON.parse(savedIg));
        } catch { /* ignore */ }
      }
    }
  }, []);

  // ── Handle OAuth callback query params ──
  useEffect(() => {
    const connected = searchParams.get("instagram_connected");
    const igError = searchParams.get("instagram_error");

    if (connected === "1") {
      const data: InstagramConnectionData = {
        username: searchParams.get("ig_username") ?? "",
        name: searchParams.get("ig_name") ?? "",
        bio: searchParams.get("ig_bio") ?? "",
        picture: searchParams.get("ig_picture") ?? "",
        mediaCount: Number(searchParams.get("ig_media_count") ?? 0),
        website: searchParams.get("ig_website") ?? "",
      };

      setIgConnected(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("virel_ig_connection", JSON.stringify(data));
        localStorage.setItem("virel_instagram_handle", data.username);
      }

      // Trigger automatic brand analysis with real data
      setInstagramHandle(data.username);
      setBio(data.bio);
      setSiteUrl(data.website);
      handleAnalyzeWithData(data.username, {
        bio: data.bio || undefined,
        siteUrl: data.website || undefined,
      });

      setToastMessage(`Instagram @${data.username} conectado!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);

      // Clean up URL params without full reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("instagram_connected");
        ["ig_username", "ig_name", "ig_bio", "ig_picture", "ig_media_count", "ig_website", "ig_account_type"].forEach(
          (k) => url.searchParams.delete(k)
        );
        window.history.replaceState({}, "", url.toString());
      }
    }

    if (igError) {
      setToastMessage("Não foi possível conectar o Instagram. Tente novamente.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("instagram_error");
        window.history.replaceState({}, "", url.toString());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Check if Instagram OAuth is configured ──
  async function handleConnectInstagram() {
    try {
      // Check configuration status without following redirects
      const res = await fetch("/api/auth/instagram/status");
      if (res.ok) {
        const data = await res.json();
        if (data.configured) {
          // Navigate the browser directly so the 307 redirect is followed natively
          window.location.href = "/api/auth/instagram";
        } else {
          setShowFallbackModal(true);
        }
      } else {
        // Fallback: try to navigate directly; route handles misconfiguration
        window.location.href = "/api/auth/instagram";
      }
    } catch {
      // If status endpoint doesn't exist, navigate directly and let the route handle it
      window.location.href = "/api/auth/instagram";
    }
  }

  function handleDisconnect() {
    setIgConnected(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("virel_ig_connection");
    }
  }

  const hasExtraContext = bio.trim() || siteUrl.trim() || businessDescription.trim();
  const analysisSteps = hasExtraContext ? RICH_ANALYSIS_STEPS : BASE_ANALYSIS_STEPS;

  async function handleAnalyzeWithData(
    handle: string,
    options?: { bio?: string; siteUrl?: string; businessDescription?: string }
  ) {
    setAnalyzing(true);
    setAnalysisStep(0);
    setCompletedSteps([]);
    setShowFallbackModal(false);

    const steps = options?.bio ? RICH_ANALYSIS_STEPS : BASE_ANALYSIS_STEPS;

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
      setCompletedSteps((prev) => [...prev, i]);
    }

    const result = await analyzeInstagramProfile(handle, options);

    setAnalyzing(false);
    setAnalysisStep(-1);

    setProfile((p) => ({ ...p, ...result }));
    setAiFilledFields(true);

    setToastMessage("Perfil da marca detectado com sucesso!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    if (typeof window !== "undefined") {
      localStorage.setItem("virel_instagram_handle", handle);
    }
  }

  async function handleAnalyze() {
    const handle = instagramHandle.trim().replace(/^@/, "");
    if (!handle) return;
    await handleAnalyzeWithData(handle, {
      bio: bio.trim() || undefined,
      siteUrl: siteUrl.trim() || undefined,
      businessDescription: businessDescription.trim() || undefined,
    });
  }

  function handleSave() {
    saveBrandProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addKeyword(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim().replace(/,$/, "");
      if (kw && !profile.keywords.includes(kw)) {
        setProfile((p) => ({ ...p, keywords: [...p.keywords, kw] }));
      }
      setKeywordInput("");
    }
  }

  function removeKeyword(kw: string) {
    setProfile((p) => ({ ...p, keywords: p.keywords.filter((k) => k !== kw) }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile((p) => ({ ...p, logo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }

  const field = (label: string, children: React.ReactNode, aiHighlight?: boolean) => (
    <div className="space-y-1.5 relative">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-white/70">{label}</label>
        {aiHighlight && aiFilledFields && (
          <span className="text-xs bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Sparkles size={9} />
            IA
          </span>
        )}
      </div>
      {children}
    </div>
  );

  const inputCls =
    "w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors";
  const inputAiCls = aiFilledFields
    ? "w-full bg-virel-dark border border-green-500/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
    : inputCls;
  const selectAiCls = inputAiCls + " appearance-none cursor-pointer";

  const totalProgress = analyzing
    ? Math.round(((completedSteps.length + 0.5) / analysisSteps.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Fallback modal ── */}
      {showFallbackModal && (
        <FallbackModal
          instagramHandle={instagramHandle}
          setInstagramHandle={setInstagramHandle}
          bio={bio}
          setBio={setBio}
          siteUrl={siteUrl}
          setSiteUrl={setSiteUrl}
          businessDescription={businessDescription}
          setBusinessDescription={setBusinessDescription}
          onAnalyze={handleAnalyze}
          onClose={() => setShowFallbackModal(false)}
          analyzing={analyzing}
        />
      )}

      {/* ── Analysis overlay ── */}
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-virel-dark/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-8 w-full max-w-sm">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <svg className="w-full h-full animate-spin" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none" stroke="url(#spinGrad)" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray="44 132"
                />
                <defs>
                  <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={18} className="text-virel-purple-400" />
              </div>
            </div>

            <h2 className="text-white font-bold text-lg mb-1 text-center">
              Analisando @{instagramHandle.replace(/^@/, "")}
            </h2>
            <p className="text-white/40 text-xs text-center mb-5">
              {hasExtraContext
                ? "A IA está usando as informações que você forneceu"
                : "A IA está detectando o perfil da sua marca"}
            </p>

            <div className="w-full h-1.5 bg-virel-dark rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-virel-purple-600 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>

            <div className="space-y-2.5">
              {analysisSteps.map((step, i) => {
                const isDone = completedSteps.includes(i);
                const isActive = analysisStep === i && !isDone;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-virel-purple-500/15 border border-virel-purple-500/30"
                        : isDone
                        ? "opacity-50"
                        : "opacity-20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? "bg-green-500/20 border border-green-500/50"
                        : isActive
                        ? "bg-virel-purple-500/30 border border-virel-purple-500/50"
                        : "border border-white/20"
                    }`}>
                      {isDone ? (
                        <Check size={11} className="text-green-400" />
                      ) : isActive ? (
                        <div className="w-2 h-2 rounded-full bg-virel-purple-400 animate-pulse" />
                      ) : null}
                    </div>
                    <span className={`text-sm flex-1 ${
                      isActive ? "text-white font-medium" : isDone ? "text-white/60" : "text-white/30"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Success / error toast ── */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 bg-green-900/90 border border-green-500/40 rounded-xl px-5 py-3 shadow-xl backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{toastMessage}</p>
              <p className="text-green-300/70 text-xs">Revise e ajuste os campos se necessário.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-2 text-white/40 hover:text-white/70 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Palette size={22} className="text-virel-purple-400" />
          <h1 className="text-2xl font-black text-white">Perfil da Marca</h1>
        </div>
        <p className="text-white/50">
          Configure a identidade da sua marca para a IA gerar criativos personalizados.
        </p>
      </div>

      {/* ── Instagram Connector Card ── */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center flex-shrink-0">
            <InstagramIcon size={18} />
          </div>
          <div>
            <h2 className="text-white font-bold">Conecte seu Instagram</h2>
            <p className="text-white/40 text-xs">
              A IA analisa seu perfil e preenche todos os campos automaticamente
            </p>
          </div>
        </div>

        {igConnected ? (
          /* ── Connected state ── */
          <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/25 rounded-xl">
            {igConnected.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={igConnected.picture}
                alt={igConnected.username}
                className="w-14 h-14 rounded-full border-2 border-green-500/40 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center flex-shrink-0 text-white font-black text-lg">
                {igConnected.username?.[0]?.toUpperCase() ?? "I"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold truncate">{igConnected.name || igConnected.username}</p>
              <p className="text-green-300/80 text-sm">@{igConnected.username}</p>
              {igConnected.mediaCount > 0 && (
                <p className="text-white/40 text-xs mt-0.5">{igConnected.mediaCount} publicações</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-500/15 px-2.5 py-1.5 rounded-lg">
                <Check size={12} />
                Conectado
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                <LogOut size={13} />
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          /* ── Connect button ── */
          <div className="space-y-3">
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
            <p className="text-white/30 text-xs text-center">
              OAuth seguro via Meta · Não armazenamos sua senha
            </p>
          </div>
        )}

        {/* ── Manual analysis section (when NOT connected via OAuth) ── */}
        {!igConnected && (
          <div className="mt-5 pt-5 border-t border-virel-dark-border">
            <p className="text-white/40 text-xs mb-3 text-center">
              Ou analise seu perfil manualmente com IA
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <AtSign size={16} />
                </div>
                <input
                  className="w-full bg-virel-dark border border-virel-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
                  placeholder="seuinstagram"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value.replace(/^@+/, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!instagramHandle.trim() || analyzing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-virel-purple-600 to-blue-600 hover:from-virel-purple-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-virel-purple-900/30"
              >
                <Sparkles size={16} />
                Analisar com IA
              </button>
            </div>

            {/* Collapsible extra context */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setExtraOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors group"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${hasExtraContext ? "bg-virel-purple-500/20 border border-virel-purple-500/40 text-virel-purple-400" : "border border-white/20 text-white/30 group-hover:border-white/40"}`}>
                  {extraOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
                <span className="font-medium">
                  Informações adicionais
                  {hasExtraContext && (
                    <span className="ml-1.5 text-xs text-virel-purple-400">(melhoram a análise)</span>
                  )}
                </span>
                {!hasExtraContext && (
                  <span className="text-white/30 text-xs">(melhoram a análise)</span>
                )}
              </button>

              {extraOpen && (
                <div className="mt-3 space-y-3 pl-1">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                      <FileText size={13} className="text-white/40" />
                      Bio do Instagram
                      <span className="text-white/30 font-normal">(opcional)</span>
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors resize-none"
                      placeholder="Cole sua bio para a IA analisar melhor seu perfil..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                      <Globe size={13} className="text-white/40" />
                      URL do site
                      <span className="text-white/30 font-normal">(opcional)</span>
                    </label>
                    <input
                      type="url"
                      className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors"
                      placeholder="https://seusite.com.br"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-white/40" />
                      Descreva brevemente o que você faz
                      <span className="text-white/30 font-normal">(opcional)</span>
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-virel-dark border border-virel-dark-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-virel-purple-500 transition-colors resize-none"
                      placeholder='Ex: "Vendo roupas femininas", "Sou personal trainer", "App de mobilidade urbana"'
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                    />
                  </div>

                  {hasExtraContext && (
                    <p className="text-virel-purple-400/80 text-xs flex items-center gap-1.5">
                      <Sparkles size={11} />
                      Com essas informações a IA vai gerar um perfil muito mais preciso
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {aiFilledFields && (
          <p className="text-green-400/80 text-xs mt-3 flex items-center gap-1.5">
            <Check size={12} />
            Perfil detectado com base em @{instagramHandle.replace(/^@/, "")} — campos marcados com
            <span className="inline-flex items-center gap-0.5 bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium">
              <Sparkles size={9} />
              IA
            </span>
            foram preenchidos automaticamente
          </p>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: Form ── */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <h2 className="text-white font-bold mb-4">Informações Básicas</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {field(
                "Nome da marca",
                <input
                  className={inputAiCls}
                  placeholder="Ex: Studio Maia"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />,
                true
              )}
              {field(
                "Nicho / Segmento",
                <select
                  className={selectAiCls}
                  value={profile.niche}
                  onChange={(e) => setProfile((p) => ({ ...p, niche: e.target.value as Niche }))}
                >
                  {NICHES.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>,
                true
              )}
            </div>

            <div className="mt-4">
              {field(
                "Descrição da marca",
                <textarea
                  rows={3}
                  className={inputAiCls + " resize-none"}
                  placeholder="Descreva sua marca, valores e o que você oferece..."
                  value={profile.description}
                  onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                />,
                true
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Tom de Voz</h2>
              {aiFilledFields && (
                <span className="text-xs bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles size={9} />
                  IA
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setProfile((p) => ({ ...p, tone: t.value }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    profile.tone === t.value
                      ? "border-virel-purple-500 bg-virel-purple-500/15"
                      : "border-virel-dark-border hover:border-virel-purple-500/40"
                  }`}
                >
                  <p className="text-white text-sm font-semibold">{t.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Público-Alvo</h2>
              {aiFilledFields && (
                <span className="text-xs bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles size={9} />
                  IA
                </span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {field(
                "Faixa etária",
                <input
                  className={inputAiCls}
                  placeholder="Ex: 25-35 anos"
                  value={profile.targetAge}
                  onChange={(e) => setProfile((p) => ({ ...p, targetAge: e.target.value }))}
                />,
                true
              )}
              {field(
                "Gênero",
                <input
                  className={inputAiCls}
                  placeholder="Ex: Feminino, masculino, todos"
                  value={profile.targetGender}
                  onChange={(e) => setProfile((p) => ({ ...p, targetGender: e.target.value }))}
                />,
                true
              )}
              <div className="sm:col-span-2">
                {field(
                  "Interesses",
                  <input
                    className={inputAiCls}
                    placeholder="Ex: moda, viagens, negócios, fitness"
                    value={profile.targetInterests}
                    onChange={(e) => setProfile((p) => ({ ...p, targetInterests: e.target.value }))}
                  />,
                  true
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Cores da Marca</h2>
              {aiFilledFields && (
                <span className="text-xs bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles size={9} />
                  IA
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(
                [
                  { key: "primaryColor", label: "Cor Primária" },
                  { key: "secondaryColor", label: "Cor Secundária" },
                  { key: "accentColor", label: "Cor Accent" },
                ] as { key: keyof BrandProfile; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <label className="text-sm text-white/60">{label}</label>
                  <div className="relative group">
                    <input
                      type="color"
                      value={profile[key] as string}
                      onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      className={`w-14 h-14 rounded-xl border-2 cursor-pointer overflow-hidden appearance-none ${
                        aiFilledFields ? "border-green-500/40" : "border-virel-dark-border"
                      }`}
                    />
                  </div>
                  <span className="text-white/40 text-xs font-mono">{profile[key] as string}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Palavras-chave da Marca</h2>
              {aiFilledFields && (
                <span className="text-xs bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles size={9} />
                  IA
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 bg-virel-purple-500/20 border border-virel-purple-500/30 text-virel-purple-300 text-sm px-3 py-1 rounded-full"
                >
                  {kw}
                  <button onClick={() => removeKeyword(kw)}>
                    <X size={12} className="hover:text-red-400 transition-colors" />
                  </button>
                </span>
              ))}
              <input
                className="bg-transparent text-white text-sm placeholder-white/30 outline-none min-w-[140px]"
                placeholder="Digite e pressione Enter..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
              />
            </div>
            <p className="text-white/30 text-xs">
              <Plus size={11} className="inline mr-1" />
              Pressione Enter ou vírgula para adicionar
            </p>
          </Card>
        </div>

        {/* ── Right: Logo + Brand Kit Preview ── */}
        <div className="space-y-5">
          <Card>
            <h2 className="text-white font-bold mb-4">Logo da Marca</h2>
            {profile.logo ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.logo}
                  alt="Logo"
                  className="w-full h-32 object-contain rounded-xl bg-virel-dark border border-virel-dark-border p-2"
                />
                <button
                  onClick={() => setProfile((p) => ({ ...p, logo: undefined }))}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-virel-dark-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-virel-purple-500/50 transition-colors"
              >
                <Upload size={22} className="text-white/30" />
                <span className="text-white/40 text-sm">Clique para fazer upload</span>
                <span className="text-white/20 text-xs">PNG, JPG, SVG</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </Card>

          <Card>
            <h2 className="text-white font-bold mb-4">Brand Kit Preview</h2>
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: `linear-gradient(135deg, ${profile.primaryColor} 0%, ${profile.secondaryColor} 100%)`,
              }}
            >
              {profile.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logo} alt="logo" className="h-10 object-contain mb-3" />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-white font-black text-sm">
                    {profile.name?.[0]?.toUpperCase() || "M"}
                  </span>
                </div>
              )}
              <p className="text-white font-bold text-base">{profile.name || "Nome da Marca"}</p>
              <p className="text-white/70 text-xs mt-1">
                {NICHES.find((n) => n.value === profile.niche)?.label} •{" "}
                {TONES.find((t) => t.value === profile.tone)?.label}
              </p>
            </div>

            <div className="space-y-3">
              {(["primaryColor", "secondaryColor", "accentColor"] as (keyof BrandProfile)[]).map((key) => {
                const labels: Record<string, string> = {
                  primaryColor: "Primária",
                  secondaryColor: "Secundária",
                  accentColor: "Accent",
                };
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/10"
                      style={{ background: profile[key] as string }}
                    />
                    <div>
                      <p className="text-white text-xs font-medium">{labels[key]}</p>
                      <p className="text-white/40 text-xs font-mono">{profile[key] as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {profile.keywords.length > 0 && (
              <div className="mt-4 pt-4 border-t border-virel-dark-border">
                <p className="text-white/50 text-xs mb-2">Palavras-chave</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${profile.primaryColor}25`,
                        color: profile.accentColor,
                        border: `1px solid ${profile.primaryColor}40`,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Button size="lg" className="w-full" onClick={handleSave}>
            {saved ? (
              <>
                <Check size={18} />
                Salvo com sucesso!
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Brand Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
