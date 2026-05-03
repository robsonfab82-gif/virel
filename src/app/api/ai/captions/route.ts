import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const MOCK_CAPTIONS: Record<string, string[]> = {
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

export async function POST(request: NextRequest) {
  // Parse body once outside try/catch so it's available in fallback
  let style = "viral";
  let context: string | undefined;
  let niche: string | undefined;

  try {
    const body = await request.json();
    style = body.style ?? "viral";
    context = body.context;
    niche = body.niche;
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  if (!["viral", "professional", "storytelling"].includes(style)) {
    return NextResponse.json({ error: "Estilo inválido" }, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ captions: MOCK_CAPTIONS[style] });
    }

    const client = new OpenAI({ apiKey });

    const styleDescriptions: Record<string, string> = {
      viral: "viral, com ganchos fortes, curiosidade, emojis, urgência e apelo emocional para máximo engajamento",
      professional: "profissional, com autoridade, insights de valor, tom formal e dados/resultados",
      storytelling: "narrativa envolvente em primeira pessoa, com começo dramático, conflito e resolução emocional",
    };

    const prompt = `Gere 3 legendas para Instagram no estilo: ${styleDescriptions[style]}.
${context ? `Contexto do post: ${context}` : ""}
${niche ? `Nicho: ${niche}` : ""}

Retorne APENAS um JSON com a seguinte estrutura, sem markdown, sem explicações:
{"captions": ["legenda1", "legenda2", "legenda3"]}

Cada legenda deve ter entre 150-300 caracteres, incluir emojis relevantes e ser em português brasileiro.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em marketing digital e criação de conteúdo para Instagram no Brasil. Crie legendas altamente engajadoras, autênticas e adaptadas ao público brasileiro. Responda sempre em JSON válido.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);
    const captions: string[] = parsed.captions ?? MOCK_CAPTIONS[style];

    return NextResponse.json({ captions });
  } catch (err) {
    console.error("Caption generation error:", err);
    return NextResponse.json({
      captions: MOCK_CAPTIONS[style] ?? MOCK_CAPTIONS.viral,
      warning: "Usando conteúdo padrão. Tente novamente.",
    });
  }
}
