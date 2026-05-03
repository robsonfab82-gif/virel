import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { brandProfile, idea, format } = await request.json();

    if (!idea || !brandProfile) {
      return NextResponse.json({ error: "brandProfile e idea são obrigatórios" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY não configurada" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });

    const formatDescriptions: Record<string, string> = {
      feed: "Post no Feed (quadrado 1080x1080)",
      stories: "Stories (vertical 1080x1920)",
      reels: "Capa de Reels (4:5 1080x1350)",
    };

    const prompt = `Crie um criativo completo para Instagram com as seguintes informações:

MARCA:
- Nome: ${brandProfile.name || "Minha Marca"}
- Nicho: ${brandProfile.niche}
- Tom de voz: ${brandProfile.tone}
- Público-alvo: ${brandProfile.targetAge}, ${brandProfile.targetGender}
- Interesses: ${brandProfile.targetInterests}
- Palavras-chave: ${(brandProfile.keywords || []).join(", ")}
- Descrição: ${brandProfile.description}
- Cores: primária ${brandProfile.primaryColor}, secundária ${brandProfile.secondaryColor}

IDEIA DO POST: ${idea}
FORMATO: ${formatDescriptions[format] || format}

Retorne APENAS um JSON válido com esta estrutura exata, sem markdown, sem explicações adicionais:
{
  "headline": "título principal impactante (máximo 8 palavras)",
  "subheadline": "subtítulo complementar (máximo 15 palavras)",
  "ctaText": "texto do botão de chamada para ação (máximo 4 palavras)",
  "copy": "texto do post (2-3 frases, persuasivo e alinhado ao tom da marca)",
  "caption": "legenda completa para Instagram com emojis relevantes, espaçamento, call to action e assinatura da marca (150-300 caracteres)",
  "hashtags": ["#hashtag1", "#hashtag2", ... (15 a 20 hashtags relevantes sem repetição)]
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em marketing digital e criação de criativos para Instagram no Brasil. Cria conteúdos altamente engajadores, adaptados à identidade visual e tom de voz de cada marca. Responda SEMPRE em JSON válido, sem markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Resposta da IA não continha JSON válido");
      parsed = JSON.parse(jsonMatch[0]);
    }

    return NextResponse.json({
      headline: parsed.headline ?? idea,
      subheadline: parsed.subheadline ?? "",
      ctaText: parsed.ctaText ?? "Saiba Mais",
      copy: parsed.copy ?? "",
      caption: parsed.caption ?? "",
      hashtags: parsed.hashtags ?? [],
    });
  } catch (err) {
    console.error("Creative generation error:", err);
    return NextResponse.json(
      { error: "Falha ao gerar criativo. Tente novamente." },
      { status: 500 }
    );
  }
}
