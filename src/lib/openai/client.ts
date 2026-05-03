// OpenAI client — uses real API when OPENAI_API_KEY is set, falls back to mocks

export interface CaptionOptions {
  context: string;
  style: "viral" | "professional" | "storytelling";
  niche?: string;
}

export interface HashtagOptions {
  niche: string;
  count?: number;
}

// ──────────────────────────────────────────────
// Brand profile types
// ──────────────────────────────────────────────
export type Niche =
  | "moda"
  | "fitness"
  | "gastronomia"
  | "tecnologia"
  | "beleza"
  | "educacao"
  | "saude"
  | "negocios"
  | "outro";

export type VoiceTone =
  | "profissional"
  | "casual"
  | "divertido"
  | "inspirador"
  | "educativo"
  | "provocativo";

export type CreativeFormat = "feed" | "stories" | "reels";

export interface BrandProfile {
  name: string;
  niche: Niche;
  tone: VoiceTone;
  targetAge: string;
  targetGender: string;
  targetInterests: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string; // base64
  keywords: string[];
  description: string;
}

export interface CreativeDesign {
  headline: string;
  subheadline: string;
  ctaText: string;
  bgStyle: string; // CSS gradient or color
}

export interface GeneratedCreative {
  id: string;
  idea: string;
  format: CreativeFormat;
  brand: BrandProfile;
  design: CreativeDesign;
  copy: string;
  caption: string;
  hashtags: string[];
  createdAt: string;
}

// ──────────────────────────────────────────────
// Original mock data (existing features)
// ──────────────────────────────────────────────
const MOCK_CAPTIONS = {
  viral: [
    "POV: você acabou de descobrir o segredo que 99% das pessoas não sabe 🤫✨ Salva esse post porque vai mudar seu jogo! Comenta abaixo o que você acha... 👇 #viral #dica #secreto",
    "Isso aqui mudou TUDO na minha vida e eu precisava te contar 🔥 Se você não está fazendo isso ainda, está perdendo MUITO! Compartilha com quem precisa ver 🚀",
    "A verdade que ninguém te conta... 👀 Já passei por isso e sei o quanto é difícil. Mas depois que aprendi esse método, nunca mais fui o mesmo! ✨ Me conta nos comentários!",
  ],
  professional: [
    "Compartilhando insights valiosos sobre estratégias comprovadas que geram resultados consistentes. O conhecimento aplicado é o que diferencia quem cresce de quem estagna. 💼",
    "Após anos de experiência e pesquisa, identifiquei os principais fatores que determinam o sucesso neste segmento. Cada detalhe faz diferença no resultado final. 📊",
    "Investir no desenvolvimento contínuo é a base de qualquer trajetória profissional sólida. Aqui estão os pontos-chave que você precisa conhecer para evoluir. 🎯",
  ],
  storytelling: [
    "Era uma manhã de terça-feira quando tudo mudou... Eu estava prestes a desistir, quando percebi que a resposta estava bem na minha frente. 📖 Deixa eu te contar essa história...",
    "Três anos atrás, eu não tinha nada. Hoje, olhando para trás, entendo que cada obstáculo foi necessário para chegar aqui. 💫 Essa é a minha história real.",
    "Ninguém me contou sobre a parte difícil da jornada. Sobre as noites acordado, as dúvidas, os momentos de quase desistência... Mas valeu cada segundo. 🌟",
  ],
};

const MOCK_HASHTAGS = [
  { tag: "instagram", audienceSize: "1.2B", relevance: 95, type: "mega" as const },
  { tag: "instagrambrasil", audienceSize: "45M", relevance: 88, type: "large" as const },
  { tag: "crescimentoinstagram", audienceSize: "2.1M", relevance: 92, type: "medium" as const },
  { tag: "dicasinstagram", audienceSize: "890K", relevance: 87, type: "medium" as const },
  { tag: "marketingdigital", audienceSize: "12M", relevance: 85, type: "large" as const },
  { tag: "empreendedorismo", audienceSize: "8.5M", relevance: 82, type: "large" as const },
  { tag: "conteudodigital", audienceSize: "1.8M", relevance: 90, type: "medium" as const },
  { tag: "criadoresdeconteudo", audienceSize: "3.2M", relevance: 88, type: "medium" as const },
  { tag: "estrategiadigital", audienceSize: "650K", relevance: 86, type: "small" as const },
  { tag: "engajamento", audienceSize: "420K", relevance: 84, type: "small" as const },
  { tag: "reels", audienceSize: "500M", relevance: 78, type: "mega" as const },
  { tag: "reelsbrasil", audienceSize: "15M", relevance: 85, type: "large" as const },
  { tag: "influencer", audienceSize: "180M", relevance: 75, type: "mega" as const },
  { tag: "influencerbrasil", audienceSize: "5M", relevance: 88, type: "medium" as const },
  { tag: "socialmedia", audienceSize: "90M", relevance: 80, type: "mega" as const },
  { tag: "socialmediabrasil", audienceSize: "2.8M", relevance: 87, type: "medium" as const },
  { tag: "negociosonline", audienceSize: "4.5M", relevance: 83, type: "medium" as const },
  { tag: "rendaonline", audienceSize: "6M", relevance: 81, type: "medium" as const },
  { tag: "microinfluencer", audienceSize: "320K", relevance: 89, type: "small" as const },
  { tag: "nichoinstagram", audienceSize: "180K", relevance: 91, type: "micro" as const },
];

// ──────────────────────────────────────────────
// Niche hashtag bank
// ──────────────────────────────────────────────
const NICHE_HASHTAGS: Record<Niche, string[]> = {
  moda: [
    "moda", "fashion", "style", "ootd", "lookdodia", "modabrasileira", "tendencia",
    "fashionista", "modafeminina", "streetstyle", "estilo", "lookoftheday",
    "modamasculina", "modedit", "fashionblogger", "modaplus", "outfit", "instastyle",
    "closet", "fashionweek",
  ],
  fitness: [
    "fitness", "academia", "musculacao", "treino", "workout", "gymlife", "fit",
    "fitnessmotivation", "treinofuncional", "saude", "healthylifestyle", "gym",
    "exercicio", "bodybuilding", "crossfit", "cardio", "treinoduro", "fitnessbrasil",
    "perderpeso", "ganharmassa",
  ],
  gastronomia: [
    "gastronomia", "food", "foodie", "culinaria", "receita", "foodphotography",
    "instafood", "foodlover", "chef", "cozinha", "alimentacaosaudavel", "foodblogger",
    "receitas", "delicia", "comida", "restaurante", "foodstagram", "comidasaudavel",
    "cozinhando", "sobremesa",
  ],
  tecnologia: [
    "tecnologia", "tech", "programacao", "developer", "coding", "software",
    "inovacao", "startup", "techbrasil", "inteligenciaartificial", "ia",
    "desenvolvimento", "programador", "devbrasil", "tecnologiabr", "digital",
    "transformacaodigital", "iot", "cloud", "devops",
  ],
  beleza: [
    "beleza", "beauty", "makeup", "maquiagem", "skincare", "cuidadoscomapele",
    "beautylovers", "cosmeticos", "cabelo", "hair", "makeupbrasil", "beautyinfluencer",
    "dicasdebeleza", "pele", "tratamento", "beautycare", "glam", "selfcare",
    "rotinadebeleza", "beautytips",
  ],
  educacao: [
    "educacao", "aprendizado", "conhecimento", "estudos", "estudo", "escola",
    "professor", "aluno", "educacaobrasil", "aprender", "cursos", "ensinando",
    "educacaoonline", "ead", "habilidades", "crescimentopessoal",
    "mindset", "desenvolvimento", "carreira",
  ],
  saude: [
    "saude", "saudavel", "bemestar", "saúde", "qualidadedevida", "vidasaudavel",
    "alimentacaosaudavel", "saudemental", "autocuidado", "meditacao", "yoga",
    "natureba", "nutricao", "saúdebrasil", "wellness", "saudeebeleza",
    "preventiva", "saudebrasil", "cuidadoscomasaude", "saúdemental",
  ],
  negocios: [
    "negocios", "empreendedorismo", "negociosonline", "vendas", "marketing",
    "empresario", "empreendedor", "marketingdigital", "resultados", "sucesso",
    "negocio", "financas", "investimentos", "liderança", "gestao", "startup",
    "empresabrasil", "crescimentobusiness", "rendaextra", "liberdadefinanceira",
  ],
  outro: [
    "lifestyle", "vida", "conteudo", "criador", "instabrasil", "brasil",
    "followme", "instagood", "photooftheday", "love", "happy", "follow",
    "instagram", "picoftheday", "brazilianstyle", "instafollow", "explore",
    "viral", "trending", "conteudodigital",
  ],
};

// ──────────────────────────────────────────────
// Tone copy templates
// ──────────────────────────────────────────────
type ToneTemplates = {
  headline: string[];
  subheadline: string[];
  cta: string[];
  copy: string[];
  captionOpener: string[];
};

const TONE_TEMPLATES: Record<VoiceTone, ToneTemplates> = {
  profissional: {
    headline: [
      "{idea} — Resultados Comprovados",
      "A Estratégia Certa para {idea}",
      "{idea}: O Método Profissional",
    ],
    subheadline: [
      "Transforme sua abordagem com consistência e precisão.",
      "Resultados reais para quem busca excelência.",
      "Elevando o padrão com estratégia e foco.",
    ],
    cta: ["Saiba Mais", "Ver Resultados", "Descubra Agora"],
    copy: [
      "Após análise detalhada, identificamos os principais fatores que geram resultados consistentes para {idea}. Nossa abordagem é baseada em dados e estratégias comprovadas.",
      "Apresentamos uma solução robusta para {idea}. Com método estruturado e foco em resultados, transformamos desafios em oportunidades de crescimento.",
    ],
    captionOpener: [
      "📊 Compartilhando um insight valioso sobre",
      "💼 Para quem busca excelência em",
      "🎯 Estratégia comprovada para",
    ],
  },
  casual: {
    headline: [
      "{idea} — simples assim!",
      "Ei, você viu isso sobre {idea}?",
      "{idea} do jeito fácil",
    ],
    subheadline: [
      "Sem complicação, direto ao ponto.",
      "A vida é mais leve assim!",
      "Você não vai acreditar como é simples.",
    ],
    cta: ["Oi, me conta!", "Salva aí!", "Tô dentro!"],
    copy: [
      "Olha, eu precisava te contar sobre {idea} de um jeito diferente. Sabe quando você descobre algo e quer contar pra todo mundo? É exatamente isso!",
      "Cara, {idea} nunca foi tão fácil! Achei esse jeito incrível e quero compartilhar com vocês. Promessa: é rápido e funciona!",
    ],
    captionOpener: [
      "Ei gente, preciso te contar sobre",
      "Olha que coisa mais fácil:",
      "Sabe quando você descobre algo incrível sobre",
    ],
  },
  divertido: {
    headline: [
      "{idea} = modo on! 🔥",
      "ALGUÉM DISSE {idea}? 🙌",
      "{idea} desbloqueado! 🎮",
    ],
    subheadline: [
      "Porque a vida precisa de mais diversão!",
      "Vem que tá muito bom por aqui! 🎉",
      "Preparado pra arrasar? 💫",
    ],
    cta: ["QUERO ISSO! 🔥", "Me inclui! 🙋", "Partiu! 🚀"],
    copy: [
      "GENTE! {idea} chegou e vai mudar tudo! 🎉 Eu tô passando muito mal de bom com isso aqui! Já experimentou? Comenta aí embaixo como foi! 👇",
      "Ok mas precisamos falar sobre {idea} AGORA! 😂 Como é que a gente vivia sem isso antes?! Tag aquela pessoa que PRECISA ver isso! 🏷️",
    ],
    captionOpener: [
      "🎉 POV: você acabou de descobrir",
      "😂 Não preciso de muito, só de",
      "🔥 GENTE! Preciso te contar sobre",
    ],
  },
  inspirador: {
    headline: [
      "{idea}: Sua transformação começa aqui",
      "O poder de {idea} na sua vida",
      "{idea} — Porque você merece mais",
    ],
    subheadline: [
      "Cada passo pequeno te leva mais longe do que imagina.",
      "Você tem o potencial para transformar tudo.",
      "O momento certo é sempre agora.",
    ],
    cta: ["Transforme sua vida", "Comece hoje", "Dê o primeiro passo"],
    copy: [
      "Há momentos na vida em que tudo muda. {idea} é um desses momentos. Não se trata apenas de resultado — é sobre quem você se torna no processo.",
      "Você já passou por tanto para chegar até aqui. {idea} é o próximo passo da sua jornada. Acredite no processo, confie em você.",
    ],
    captionOpener: [
      "✨ Quando você decide mudar, algo especial acontece com",
      "💫 A jornada mais importante começa com",
      "🌟 Lembra quando você pensou que não conseguia?",
    ],
  },
  educativo: {
    headline: [
      "Tudo sobre {idea} em 60 segundos",
      "{idea}: O guia completo",
      "Aprenda {idea} do zero",
    ],
    subheadline: [
      "Conteúdo baseado em fatos e pesquisa.",
      "Aprenda de forma simples e prática.",
      "Conhecimento que você pode aplicar agora.",
    ],
    cta: ["Aprenda mais", "Ver tutorial", "Salva para estudar"],
    copy: [
      "Vamos falar sobre {idea}? Muitas pessoas têm dúvidas sobre isso e hoje vou explicar de forma clara e objetiva. Acompanha comigo esse guia rápido.",
      "{idea} pode parecer complexo, mas quando você entende os fundamentos, tudo fica claro. Preparei um resumo com os pontos mais importantes que você precisa saber.",
    ],
    captionOpener: [
      "📚 Hoje vamos aprender sobre",
      "🎓 Guia rápido e completo sobre",
      "💡 Você sabia que",
    ],
  },
  provocativo: {
    headline: [
      "{idea} — A verdade que ninguém conta",
      "Por que todo mundo erra em {idea}?",
      "{idea}: Pare de fazer errado",
    ],
    subheadline: [
      "A maioria das pessoas está do jeito errado.",
      "Se você não sabe isso, está perdendo.",
      "Hora de questionar o que você acredita.",
    ],
    cta: ["Me prova que estou errado", "Discorda? Me conta!", "Ouse saber mais"],
    copy: [
      "Vou ser direto: a maioria das pessoas entende {idea} de forma completamente errada. E isso está custando caro. Chegou a hora de mudar essa perspectiva.",
      "{idea} não é o que te ensinaram. Passei anos acreditando no que todos dizem, até descobrir a verdade. Você está pronto para questionar tudo?",
    ],
    captionOpener: [
      "🔥 Vou te contar uma verdade desconfortável sobre",
      "👀 Por que quase todo mundo erra em",
      "💣 Isso que te ensinaram sobre",
    ],
  },
};

// ──────────────────────────────────────────────
// Utility: pick random item
// ──────────────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatIdea(idea: string): string {
  return idea.charAt(0).toUpperCase() + idea.slice(1).toLowerCase();
}

function fillTemplate(template: string, idea: string): string {
  return template.replace(/\{idea\}/g, formatIdea(idea));
}

// ──────────────────────────────────────────────
// Creative generator mock (fallback)
// ──────────────────────────────────────────────
export function generateCreativeMock(
  brand: BrandProfile,
  idea: string,
  format: CreativeFormat
): GeneratedCreative {
  const toneTemplates = TONE_TEMPLATES[brand.tone];
  const nicheHashtags = NICHE_HASHTAGS[brand.niche];

  const headline = fillTemplate(pick(toneTemplates.headline), idea);
  const subheadline = pick(toneTemplates.subheadline);
  const ctaText = pick(toneTemplates.cta);
  const bgStyle = `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)`;

  const copyTemplate = pick(toneTemplates.copy);
  const copy = fillTemplate(copyTemplate, idea);

  const opener = pick(toneTemplates.captionOpener);
  const emojiMap: Record<VoiceTone, string> = {
    profissional: "📊💼🎯",
    casual: "😊✨🙌",
    divertido: "🔥🎉😂",
    inspirador: "✨💫🌟",
    educativo: "📚💡🎓",
    provocativo: "🔥👀💣",
  };
  const emojis = emojiMap[brand.tone];
  const keywordsStr = brand.keywords.slice(0, 3).join(", ");
  const caption = `${opener} ${idea.toLowerCase()} ${emojis}\n\n${copy}\n\n${keywordsStr ? `Palavras-chave: ${keywordsStr}\n\n` : ""}👇 Comenta o que você acha!\n\n${brand.name ? `— ${brand.name}` : ""}`;

  const genericTags = ["instagood", "brasil", "conteudodigital", "viral", "trending"];
  const allTags = [...nicheHashtags, ...genericTags];
  const shuffled = allTags.sort(() => Math.random() - 0.5);
  const hashtags = shuffled.slice(0, 18).map((t) => `#${t}`);

  return {
    id: `creative_${Date.now()}`,
    idea,
    format,
    brand,
    design: { headline, subheadline, ctaText, bgStyle },
    copy,
    caption,
    hashtags,
    createdAt: new Date().toISOString(),
  };
}

// ──────────────────────────────────────────────
// generateCreative — calls /api/ai/creative, falls back to mock
// ──────────────────────────────────────────────
export async function generateCreative(
  brand: BrandProfile,
  idea: string,
  format: CreativeFormat
): Promise<GeneratedCreative> {
  try {
    const res = await fetch("/api/ai/creative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandProfile: brand, idea, format }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();

    const bgStyle = `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)`;

    return {
      id: `creative_${Date.now()}`,
      idea,
      format,
      brand,
      design: {
        headline: data.headline,
        subheadline: data.subheadline,
        ctaText: data.ctaText,
        bgStyle,
      },
      copy: data.copy,
      caption: data.caption,
      hashtags: data.hashtags,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("generateCreative: API failed, using mock fallback", err);
    await new Promise((r) => setTimeout(r, 800));
    return generateCreativeMock(brand, idea, format);
  }
}

// ──────────────────────────────────────────────
// localStorage helpers for brand & history
// ──────────────────────────────────────────────
const BRAND_KEY = "virel_brand_profile";
const HISTORY_KEY = "virel_creatives_history";

export function saveBrandProfile(profile: BrandProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(BRAND_KEY, JSON.stringify(profile));
  }
}

export function loadBrandProfile(): BrandProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(BRAND_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BrandProfile;
  } catch {
    return null;
  }
}

export function saveCreativeToHistory(creative: GeneratedCreative): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(HISTORY_KEY);
  const history: GeneratedCreative[] = raw ? JSON.parse(raw) : [];
  history.unshift(creative);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function loadCreativesHistory(): GeneratedCreative[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GeneratedCreative[];
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────
// Instagram Profile Analyzer mock data (fallback)
// ──────────────────────────────────────────────

interface NicheProfile {
  niche: Niche;
  tone: VoiceTone;
  targetAge: string;
  targetGender: string;
  targetInterests: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  keywords: string[];
  descriptionTemplate: string;
}

const NICHE_PROFILES: NicheProfile[] = [
  {
    niche: "moda",
    tone: "inspirador",
    targetAge: "18-35 anos",
    targetGender: "Feminino",
    targetInterests: "moda, estilo, tendências, lifestyle, compras",
    primaryColor: "#E91E8C",
    secondaryColor: "#FF6B6B",
    accentColor: "#FFD93D",
    keywords: ["moda", "estilo", "look", "tendência", "fashion", "ootd"],
    descriptionTemplate:
      "Marca de moda contemporânea que inspira mulheres a expressarem sua personalidade através do estilo. Apostamos em peças atemporais com toque fashion-forward.",
  },
  {
    niche: "fitness",
    tone: "divertido",
    targetAge: "20-40 anos",
    targetGender: "Todos",
    targetInterests: "treino, saúde, nutrição, bem-estar, esportes",
    primaryColor: "#00C853",
    secondaryColor: "#1A237E",
    accentColor: "#FFEB3B",
    keywords: ["fitness", "treino", "saúde", "academia", "resultado", "foco"],
    descriptionTemplate:
      "Transformamos rotinas de treino em experiências motivadoras. Do iniciante ao avançado, temos o programa certo para levar você além dos seus limites.",
  },
  {
    niche: "gastronomia",
    tone: "casual",
    targetAge: "25-45 anos",
    targetGender: "Todos",
    targetInterests: "culinária, receitas, gastronomia, comida, restaurantes",
    primaryColor: "#FF6F00",
    secondaryColor: "#E53935",
    accentColor: "#FFF176",
    keywords: ["receita", "gastronomia", "food", "culinária", "sabor", "chef"],
    descriptionTemplate:
      "Celebramos a cultura gastronômica brasileira com receitas autênticas e técnicas acessíveis. Cada prato conta uma história de sabor e tradição.",
  },
  {
    niche: "tecnologia",
    tone: "educativo",
    targetAge: "22-40 anos",
    targetGender: "Masculino",
    targetInterests: "tecnologia, programação, startups, inovação, gadgets",
    primaryColor: "#0D47A1",
    secondaryColor: "#00BCD4",
    accentColor: "#64FFDA",
    keywords: ["tech", "inovação", "digital", "código", "startup", "IA"],
    descriptionTemplate:
      "Exploramos as fronteiras da tecnologia e inovação digital. Conteúdo técnico e estratégico para profissionais que querem se manter à frente das tendências.",
  },
  {
    niche: "beleza",
    tone: "inspirador",
    targetAge: "18-40 anos",
    targetGender: "Feminino",
    targetInterests: "beleza, skincare, maquiagem, autocuidado, wellness",
    primaryColor: "#AD1457",
    secondaryColor: "#F8BBD0",
    accentColor: "#FF80AB",
    keywords: ["beleza", "skincare", "maquiagem", "glow", "autocuidado", "beauty"],
    descriptionTemplate:
      "Acreditamos que beleza é autoexpressão e autocuidado. Guiamos mulheres em suas rotinas de skincare e make com produtos e técnicas que realmente funcionam.",
  },
  {
    niche: "educacao",
    tone: "educativo",
    targetAge: "18-50 anos",
    targetGender: "Todos",
    targetInterests: "aprendizado, cursos, desenvolvimento pessoal, carreira, conhecimento",
    primaryColor: "#1565C0",
    secondaryColor: "#283593",
    accentColor: "#42A5F5",
    keywords: ["educação", "conhecimento", "aprendizado", "curso", "desenvolvimento", "habilidade"],
    descriptionTemplate:
      "Democratizamos o acesso ao conhecimento de qualidade. Nossa missão é desenvolver habilidades práticas que transformam carreiras e abrem novas oportunidades.",
  },
  {
    niche: "saude",
    tone: "profissional",
    targetAge: "25-55 anos",
    targetGender: "Todos",
    targetInterests: "saúde, bem-estar, medicina, nutrição, qualidade de vida",
    primaryColor: "#00695C",
    secondaryColor: "#1B5E20",
    accentColor: "#69F0AE",
    keywords: ["saúde", "bem-estar", "prevenção", "qualidade de vida", "nutrição", "equilíbrio"],
    descriptionTemplate:
      "Promovemos saúde integral com abordagem científica e humanizada. Informação confiável para decisões mais saudáveis no dia a dia.",
  },
  {
    niche: "negocios",
    tone: "profissional",
    targetAge: "25-50 anos",
    targetGender: "Todos",
    targetInterests: "negócios, empreendedorismo, marketing, vendas, liderança",
    primaryColor: "#7C3AED",
    secondaryColor: "#2563EB",
    accentColor: "#8B5CF6",
    keywords: ["negócios", "empreendedorismo", "resultados", "estratégia", "crescimento", "vendas"],
    descriptionTemplate:
      "Aceleramos o crescimento de negócios com estratégias comprovadas. Do planejamento à execução, oferecemos as ferramentas para escalar sua empresa com eficiência.",
  },
  {
    niche: "moda",
    tone: "provocativo",
    targetAge: "20-35 anos",
    targetGender: "Todos",
    targetInterests: "streetwear, cultura urbana, arte, música, moda alternativa",
    primaryColor: "#212121",
    secondaryColor: "#FF3D00",
    accentColor: "#FFEA00",
    keywords: ["streetwear", "urbano", "arte", "cultura", "estilo único", "ousado"],
    descriptionTemplate:
      "Quebramos regras e redefinimos o estilo urbano brasileiro. Peças que fazem declarações, para quem não tem medo de ser notado.",
  },
  {
    niche: "fitness",
    tone: "inspirador",
    targetAge: "28-50 anos",
    targetGender: "Feminino",
    targetInterests: "yoga, pilates, meditação, bem-estar, equilíbrio, mindfulness",
    primaryColor: "#7B1FA2",
    secondaryColor: "#4A148C",
    accentColor: "#CE93D8",
    keywords: ["yoga", "bem-estar", "equilíbrio", "mente sã", "mindfulness", "transformação"],
    descriptionTemplate:
      "Integramos movimento, respiração e consciência para uma vida em equilíbrio. Mais do que exercício — é uma jornada de autoconhecimento e bem-estar.",
  },
];

function handleToSeed(handle: string): number {
  const clean = handle.toLowerCase().replace(/[^a-z0-9]/g, "");
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) & 0xffff;
  }
  return hash;
}

function handleToName(handle: string): string {
  const clean = handle.replace(/^@/, "").toLowerCase();
  const words = clean.replace(/[_.-]+/g, " ").split(" ");
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function analyzeInstagramProfileMock(handle: string): BrandProfile {
  const seed = handleToSeed(handle);
  const profileIndex = seed % NICHE_PROFILES.length;
  const nicheData = NICHE_PROFILES[profileIndex];
  const brandName = handleToName(handle.replace(/^@/, ""));
  const description = nicheData.descriptionTemplate.replace(
    /^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÀÇ][a-záéíóúâêîôûãõàç]+/,
    brandName.split(" ")[0]
  );
  return {
    name: brandName,
    niche: nicheData.niche,
    tone: nicheData.tone,
    targetAge: nicheData.targetAge,
    targetGender: nicheData.targetGender,
    targetInterests: nicheData.targetInterests,
    primaryColor: nicheData.primaryColor,
    secondaryColor: nicheData.secondaryColor,
    accentColor: nicheData.accentColor,
    keywords: [...nicheData.keywords],
    description,
  };
}

export interface AnalyzeInstagramOptions {
  bio?: string;
  siteUrl?: string;
  businessDescription?: string;
}

/**
 * Analyzes an Instagram handle and returns a complete BrandProfile.
 * Calls /api/ai/analyze-brand; falls back to mock on error.
 */
export async function analyzeInstagramProfile(
  handle: string,
  options?: AnalyzeInstagramOptions
): Promise<BrandProfile> {
  try {
    const res = await fetch("/api/ai/analyze-brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        bio: options?.bio,
        siteUrl: options?.siteUrl,
        businessDescription: options?.businessDescription,
      }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    return data as BrandProfile;
  } catch (err) {
    console.warn("analyzeInstagramProfile: API failed, using mock fallback", err);
    await new Promise((r) => setTimeout(r, 200));
    return analyzeInstagramProfileMock(handle);
  }
}

// ──────────────────────────────────────────────
// Original openai export (existing features)
// ──────────────────────────────────────────────
export const openai = {
  async generateCaptions(options: CaptionOptions): Promise<string[]> {
    try {
      const res = await fetch("/api/ai/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: options.context, style: options.style, niche: options.niche }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data.captions as string[];
    } catch (err) {
      console.warn("generateCaptions: API failed, using mock fallback", err);
      await new Promise((r) => setTimeout(r, 800));
      return MOCK_CAPTIONS[options.style];
    }
  },

  async generateHashtags(options: HashtagOptions) {
    try {
      const res = await fetch("/api/ai/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: options.niche, count: options.count ?? 20 }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return data.hashtags;
    } catch (err) {
      console.warn("generateHashtags: API failed, using mock fallback", err);
      await new Promise((r) => setTimeout(r, 800));
      const count = options.count ?? 20;
      return MOCK_HASHTAGS.slice(0, count);
    }
  },

  async analyzeProfile() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      total: 82,
      breakdown: {
        bio: 90,
        consistency: 75,
        hashtags: 88,
        engagement: 85,
        content: 78,
        visuals: 80,
      },
      suggestions: [
        "Adicione palavras-chave relevantes à sua bio",
        "Mantenha uma frequência de 4-5 posts por semana",
        "Use mais hashtags de nicho (micro e pequenas)",
        "Responda comentários nas primeiras horas após publicar",
        "Teste conteúdo em formato Reels para maior alcance",
      ],
    };
  },
};
