import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { handle, bio, siteUrl, businessDescription } = await request.json();

    if (!handle) {
      return NextResponse.json({ error: "handle é obrigatório" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY não configurada" }, { status: 500 });
    }

    const client = new OpenAI({ apiKey });

    const cleanHandle = handle.replace(/^@/, "");

    // Build optional context sections
    const bioSection = bio?.trim()
      ? `\nBio do Instagram: "${bio.trim()}"`
      : "";
    const siteSection = siteUrl?.trim()
      ? `\nURL do site: ${siteUrl.trim()}`
      : "";
    const descSection = businessDescription?.trim()
      ? `\nDescrição do negócio (fornecida pelo usuário): "${businessDescription.trim()}"`
      : "";

    const hasExtraContext = bioSection || siteSection || descSection;

    const prompt = `Analise o perfil do Instagram @${cleanHandle} e gere um Brand Profile completo e realista.
${bioSection}${siteSection}${descSection}

${
  hasExtraContext
    ? `Baseado no @ do Instagram, na bio fornecida, na descrição do negócio e no site (se fornecido), gere um perfil de marca preciso.
NÃO invente informações — use apenas o que foi fornecido para inferir o nicho, tom de voz, público-alvo e cores adequadas.
Priorize sempre as informações explícitas (bio, descrição, site) sobre suposições baseadas apenas no @.`
    : `Baseie-se no nome do usuário para inferir o tipo de negócio, nicho e público-alvo mais provável.
Crie uma identidade de marca coerente e profissional.`
}

Retorne APENAS um JSON válido com esta estrutura exata, sem markdown, sem explicações:
{
  "name": "nome humanizado da marca (baseado no @ e nas informações fornecidas)",
  "niche": "um de: moda, fitness, gastronomia, tecnologia, beleza, educacao, saude, negocios, outro",
  "tone": "um de: profissional, casual, divertido, inspirador, educativo, provocativo",
  "targetAge": "faixa etária estimada (ex: 25-40 anos)",
  "targetGender": "gênero estimado (Feminino / Masculino / Todos)",
  "targetInterests": "interesses do público separados por vírgula",
  "primaryColor": "cor hex principal da marca (ex: #7C3AED)",
  "secondaryColor": "cor hex secundária (ex: #2563EB)",
  "accentColor": "cor hex de destaque (ex: #8B5CF6)",
  "keywords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"],
  "description": "descrição da marca em 2-3 frases, profissional e alinhada ao nicho"
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em branding e marketing digital para o mercado brasileiro. Analisa perfis de Instagram e cria Brand Profiles detalhados e coerentes. Use APENAS as informações fornecidas pelo usuário — nunca invente dados. Responda SEMPRE em JSON válido, sem markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 700,
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

    const validNiches = ["moda", "fitness", "gastronomia", "tecnologia", "beleza", "educacao", "saude", "negocios", "outro"];
    const validTones = ["profissional", "casual", "divertido", "inspirador", "educativo", "provocativo"];

    const brandProfile = {
      name: parsed.name ?? cleanHandle,
      niche: validNiches.includes(parsed.niche) ? parsed.niche : "outro",
      tone: validTones.includes(parsed.tone) ? parsed.tone : "profissional",
      targetAge: parsed.targetAge ?? "25-40 anos",
      targetGender: parsed.targetGender ?? "Todos",
      targetInterests: parsed.targetInterests ?? "",
      primaryColor: /^#[0-9A-Fa-f]{6}$/.test(parsed.primaryColor) ? parsed.primaryColor : "#7C3AED",
      secondaryColor: /^#[0-9A-Fa-f]{6}$/.test(parsed.secondaryColor) ? parsed.secondaryColor : "#2563EB",
      accentColor: /^#[0-9A-Fa-f]{6}$/.test(parsed.accentColor) ? parsed.accentColor : "#8B5CF6",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 8) : [],
      description: parsed.description ?? "",
    };

    return NextResponse.json(brandProfile);
  } catch (err) {
    console.error("Brand analysis error:", err);
    return NextResponse.json(
      { error: "Falha ao analisar perfil. Tente novamente." },
      { status: 500 }
    );
  }
}
