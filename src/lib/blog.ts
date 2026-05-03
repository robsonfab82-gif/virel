export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  date: string;
  categories: string[];
  tags: string[];
  status: "published" | "draft";
  metaDescription: string;
  readTime: number;
}

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "como-crescer-no-instagram-com-ia",
    title: "Como Crescer no Instagram com Inteligência Artificial em 2026",
    excerpt: "Descubra as estratégias mais eficazes para aumentar seus seguidores, engajamento e alcance orgânico usando ferramentas de IA.",
    content: `## O Futuro do Crescimento no Instagram

A inteligência artificial está revolucionando a forma como criadores de conteúdo crescem no Instagram. Com as ferramentas certas, é possível analisar seu perfil, identificar oportunidades e gerar conteúdo altamente relevante para sua audiência.

## Por que a IA Muda Tudo

Antes da IA, crescer no Instagram exigia horas de pesquisa manual sobre hashtags, análise de concorrentes e testes A/B de legendas. Hoje, ferramentas como o VIREL fazem isso em segundos.

## Estratégias Comprovadas

### 1. Score de Perfil
Antes de qualquer coisa, você precisa entender onde está. Um score de perfil detalhado revela os pontos fracos e fortes do seu Instagram.

### 2. Hashtags Inteligentes
As hashtags certas podem triplicar o alcance do seu post. Use análise de IA para encontrar hashtags com alta relevância e competição moderada.

### 3. Legendas Virais
O copywriting é responsável por até 40% do engajamento de um post. Legendas geradas por IA, treinadas com os melhores posts virais do seu nicho, fazem a diferença.

### 4. Consistência de Conteúdo
Com um planejador inteligente, você nunca fica sem ideias e mantém a consistência que o algoritmo do Instagram ama.

## Resultados Reais

Criadores que usam IA reportam:
- Aumento médio de 23% no engajamento
- 3x mais alcance orgânico
- 60% menos tempo gasto em criação de conteúdo

## Conclusão

O Instagram está cada vez mais competitivo. Usar inteligência artificial não é mais diferencial — é necessidade. Comece hoje com o VIREL e veja a diferença em 30 dias.`,
    coverImage: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&q=80",
    author: "Equipe VIREL",
    authorAvatar: "V",
    date: "02 Mai 2026",
    categories: ["Crescimento", "IA"],
    tags: ["instagram", "ia", "crescimento", "engajamento"],
    status: "published",
    metaDescription: "Aprenda como usar inteligência artificial para crescer no Instagram em 2026 com estratégias comprovadas de engajamento e alcance orgânico.",
    readTime: 5,
  },
  {
    id: "2",
    slug: "melhores-horarios-para-postar-no-instagram",
    title: "Os Melhores Horários para Postar no Instagram (Guia Completo 2026)",
    excerpt: "Timing é tudo no Instagram. Saiba quando sua audiência está mais ativa e maximize o alcance de cada publicação.",
    content: `## Por Que o Horário Importa

Postar no momento certo pode fazer a diferença entre um post que viraliza e um que passa despercebido. O algoritmo do Instagram prioriza posts com alto engajamento nas primeiras horas.

## Os Melhores Horários Gerais

Estudos com mais de 1 milhão de posts revelam os melhores horários:

**Durante a semana:**
- 6h-8h: Pessoas acordando e checando o celular
- 12h-13h: Almoço
- 19h-21h: Pós-trabalho

**Fins de semana:**
- 9h-11h: Manhã tranquila
- 18h-20h: Final da tarde

## Como a IA Personaliza Isso

Cada audiência é única. O VIREL analisa quando seus seguidores estão online e recomenda os horários ideais especificamente para o seu perfil.

## Ferramentas para Monitorar

- Instagram Insights (nativo)
- VIREL Analytics
- Meta Business Suite

## Conclusão

Combine os horários ideais com conteúdo de qualidade gerado por IA para maximizar seus resultados no Instagram.`,
    coverImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    author: "Ana Beatriz",
    authorAvatar: "A",
    date: "30 Abr 2026",
    categories: ["Estratégia"],
    tags: ["instagram", "horarios", "algoritmo", "engagement"],
    status: "published",
    metaDescription: "Descubra os melhores horários para postar no Instagram em 2026 e maximize seu alcance orgânico com dados atualizados.",
    readTime: 4,
  },
  {
    id: "3",
    slug: "como-usar-hashtags-corretamente",
    title: "Hashtags no Instagram: O Guia Definitivo para Maximizar Alcance",
    excerpt: "Aprenda a estratégia de hashtags que grandes criadores usam para alcançar novos públicos e crescer organicamente.",
    content: `## A Verdade Sobre Hashtags

Hashtags ainda funcionam em 2026, mas de forma diferente. O segredo não é usar muitas, mas usar as certas.

## Estratégia de Mix de Hashtags

### Hashtags Grandes (1M+ posts)
Use 2-3 hashtags populares para visibilidade em explore.

### Hashtags Médias (100K-1M posts)
Use 5-8 hashtags médias onde você tem chance real de aparecer.

### Hashtags Pequenas (-100K posts)
Use 5-7 hashtags nichadas onde você pode dominar.

## Erros Comuns

1. Usar as mesmas hashtags em todos os posts
2. Usar hashtags irrelevantes para o conteúdo
3. Usar hashtags banidas (shadowban)
4. Colocar hashtags nos comentários (menos eficaz)

## Como a IA Ajuda

O VIREL analisa as hashtags dos seus concorrentes, identifica as mais eficazes para o seu nicho e sugere combinações otimizadas para cada post.

## Conclusão

Com a estratégia certa de hashtags e o apoio da IA, você pode alcançar centenas de novos seguidores por post.`,
    coverImage: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&q=80",
    author: "Carlos Lima",
    authorAvatar: "C",
    date: "28 Abr 2026",
    categories: ["Hashtags", "Crescimento"],
    tags: ["hashtags", "instagram", "alcance", "crescimento"],
    status: "published",
    metaDescription: "Guia completo de hashtags para Instagram 2026: estratégias, exemplos e como usar IA para maximizar seu alcance orgânico.",
    readTime: 6,
  },
  {
    id: "4",
    slug: "como-escrever-legendas-virais",
    title: "Como Escrever Legendas Virais que Geram Engajamento Real",
    excerpt: "As legendas são subestimadas. Aprenda a fórmula das legendas que geram curtidas, comentários e compartilhamentos.",
    content: `## O Poder da Legenda

Uma boa foto com uma legenda fraca perde muito alcance. Uma legenda poderosa pode transformar um post médio em viral.

## A Fórmula da Legenda Viral

### Gancho Inicial (1-2 linhas)
As primeiras palavras aparecem no feed antes do "ver mais". Precisa ser irresistível.

### Desenvolvimento
Conte uma história, dê valor, seja autêntico.

### Call to Action
Sempre termine pedindo engajamento: "Conta nos comentários...", "Salva esse post!", "Manda para um amigo que..."

## Exemplos de Ganchos que Funcionam

- "Ninguém te conta isso sobre [tema]..."
- "Errei feio e aprendi muito..."
- "3 anos para descobrir que..."
- "Se você faz isso, pare agora..."

## IA para Legendas

O VIREL gera legendas nos estilos viral, profissional e storytelling com um clique. Experimente com diferentes abordagens e descubra qual funciona melhor para sua audiência.

## Conclusão

Com prática e as ferramentas certas, você pode criar legendas que aumentam significativamente seu engajamento.`,
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    author: "Mariana Costa",
    authorAvatar: "M",
    date: "25 Abr 2026",
    categories: ["Copywriting", "Estratégia"],
    tags: ["legendas", "copywriting", "viral", "engajamento"],
    status: "published",
    metaDescription: "Aprenda a escrever legendas virais para Instagram que geram engajamento real. Fórmulas, exemplos e como usar IA para otimizar.",
    readTime: 5,
  },
];

export function getPublishedPosts(): BlogPost[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("virel_blog_posts");
      if (stored) {
        const parsed: BlogPost[] = JSON.parse(stored);
        return parsed.filter((p) => p.status === "published");
      }
    } catch {}
  }
  return MOCK_POSTS.filter((p) => p.status === "published");
}

export function getAllPosts(): BlogPost[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("virel_blog_posts");
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return MOCK_POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("virel_blog_posts");
      if (stored) {
        const parsed: BlogPost[] = JSON.parse(stored);
        const found = parsed.find((p) => p.slug === slug && p.status === "published");
        if (found) return found;
      }
    } catch {}
  }
  return MOCK_POSTS.find((p) => p.slug === slug && p.status === "published");
}
