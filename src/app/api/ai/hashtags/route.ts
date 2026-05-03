import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MOCK_HASHTAGS = [
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

export async function POST(request: NextRequest) {
  // Parse body once outside try/catch so it's available in fallback
  let niche: string | undefined;
  let targetCount = 20;

  try {
    const body = await request.json();
    niche = body.niche;
    targetCount = body.count ?? 20;
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  if (!niche) {
    return NextResponse.json({ error: "Nicho é obrigatório" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ hashtags: MOCK_HASHTAGS.slice(0, targetCount) });
    }

    const client = new OpenAI({ apiKey });

    const prompt = `Gere ${targetCount} hashtags relevantes para o nicho "${niche}" no Instagram brasileiro.

Retorne APENAS um JSON com a seguinte estrutura, sem markdown, sem explicações:
{
  "hashtags": [
    {"tag": "nomehashtag", "audienceSize": "1.2M", "relevance": 92, "type": "medium"},
    ...
  ]
}

Regras:
- tag: apenas letras minúsculas e números, sem o símbolo #
- audienceSize: número estimado com sufixo K, M ou B
- relevance: número de 60 a 99 indicando relevância para o nicho
- type: "mega" (>100M), "large" (10M-100M), "medium" (1M-10M), "small" (100K-1M), "micro" (<100K)
- Misture hashtags em português e inglês
- Inclua hashtags específicas do nicho e algumas populares gerais do Brasil`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em estratégia de hashtags para Instagram no Brasil. Conhece profundamente os nichos e audiências brasileiras. Responda sempre em JSON válido.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);
    const hashtags = parsed.hashtags ?? MOCK_HASHTAGS.slice(0, targetCount);

    return NextResponse.json({ hashtags });
  } catch (err) {
    console.error("Hashtag generation error:", err);
    return NextResponse.json({
      hashtags: MOCK_HASHTAGS.slice(0, targetCount),
      warning: "Usando hashtags padrão. Tente novamente.",
    });
  }
}
