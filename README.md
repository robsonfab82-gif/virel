# VIREL - Plataforma de Crescimento para Instagram com IA

SaaS completo para ajudar criadores e marcas a crescerem no Instagram de forma orgânica usando Inteligência Artificial.

## Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (Auth + PostgreSQL)
- **Pagamentos:** Stripe
- **IA:** OpenAI GPT-4o-mini
- **i18n:** next-intl (5 idiomas: PT, EN, ES, FR, ZH)

## Funcionalidades

- Landing page completa com planos de assinatura
- Dashboard do usuário com análise de perfil, ideias de conteúdo, hashtags, legendas, planejamento
- Gerador de criativos com IA (design, copy, legenda, hashtags)
- Perfil da marca com análise automática
- Blog completo
- Painel admin completo
- Sistema multi-idioma

## Deploy na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Importe este repositório do GitHub
3. Configure as variáveis de ambiente (ver `.env.local.example`)
4. Clique em Deploy

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Chave de serviço do Supabase
- `STRIPE_SECRET_KEY` — Chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET` — Secret do webhook Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Chave pública do Stripe
- `OPENAI_API_KEY` — Chave da API OpenAI
- `NEXT_PUBLIC_APP_URL` — URL do app (ex: https://virel.vercel.app)

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Licença

Proprietário — VIREL
