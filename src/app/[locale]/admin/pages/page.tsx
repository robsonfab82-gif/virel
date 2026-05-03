"use client";
import { useState, useEffect } from "react";
import { Save, ExternalLink, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

interface PageContent {
  id: string;
  key: string;
  title: string;
  content: string;
  path: string;
  lastUpdated: string;
}

const DEFAULT_PAGES: PageContent[] = [
  {
    id: "sobre",
    key: "sobre",
    title: "Sobre o VIREL",
    content: "Somos uma startup brasileira focada em democratizar o crescimento no Instagram através de inteligência artificial. Fundada em 2024, a VIREL nasceu da frustração de criadores de conteúdo que passavam horas tentando crescer sem resultados consistentes.\n\nNossa missão é simples: dar a todo criador as mesmas ferramentas que as grandes agências usam, de forma acessível e automatizada.\n\n## Nossa Equipe\n\nSomos um time apaixonado por tecnologia, marketing digital e crescimento orgânico.",
    path: "/sobre",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "carreiras",
    key: "carreiras",
    title: "Carreiras na VIREL",
    content: "Estamos sempre em busca de talentos apaixonados por tecnologia e marketing digital.\n\n## Vagas Abertas\n\n- Desenvolvedor Full-Stack (React/Next.js)\n- Designer UI/UX\n- Especialista em Growth Marketing\n- Engenheiro de Machine Learning\n\n## Benefícios\n\n- Trabalho 100% remoto\n- Horário flexível\n- Plano de saúde\n- Stock options\n- Budget para cursos e conferências",
    path: "/carreiras",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "ajuda",
    key: "ajuda",
    title: "Central de Ajuda",
    content: "Encontre respostas para as perguntas mais frequentes sobre o VIREL.\n\n## Primeiros Passos\n\n- Como criar minha conta\n- Como conectar meu Instagram\n- Como interpretar meu Score\n\n## Pagamentos\n\n- Como assinar um plano\n- Como cancelar minha assinatura\n- Política de reembolso\n\n## Suporte\n\nEntre em contato: suporte@virel.com.br",
    path: "/ajuda",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "contato",
    key: "contato",
    title: "Entre em Contato",
    content: "Estamos aqui para ajudar!\n\n## Canais de Atendimento\n\n- **Email:** contato@virel.com.br\n- **Suporte técnico:** suporte@virel.com.br\n- **Parcerias:** parcerias@virel.com.br\n\n## Horário de Atendimento\n\nSegunda a sexta, das 9h às 18h (horário de Brasília).\n\n## Tempo de Resposta\n\nRespondemos em até 24 horas úteis.",
    path: "/contato",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "termos",
    key: "termos",
    title: "Termos de Uso",
    content: "Última atualização: 02 de maio de 2026\n\n## 1. Aceitação dos Termos\n\nAo utilizar os serviços da VIREL, você concorda com estes Termos de Uso.\n\n## 2. Uso do Serviço\n\nO VIREL é uma plataforma de análise e otimização de perfis do Instagram. Ao usar nosso serviço, você concorda em:\n\n- Fornecer informações precisas\n- Não usar o serviço para fins ilegais\n- Respeitar os Termos de Serviço do Instagram\n\n## 3. Propriedade Intelectual\n\nTodo o conteúdo da plataforma VIREL é protegido por direitos autorais.",
    path: "/termos",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "privacidade",
    key: "privacidade",
    title: "Política de Privacidade",
    content: "Última atualização: 02 de maio de 2026\n\n## 1. Informações que Coletamos\n\n- Dados de conta (nome, email)\n- Dados públicos do Instagram\n- Dados de uso da plataforma\n\n## 2. Como Usamos Suas Informações\n\n- Fornecer e melhorar nossos serviços\n- Personalizar sua experiência\n- Enviar comunicações relevantes\n\n## 3. Compartilhamento de Dados\n\nNão vendemos seus dados pessoais. Compartilhamos apenas com parceiros necessários para operar o serviço.\n\n## 4. Seus Direitos (LGPD)\n\nVocê tem direito a acessar, corrigir e deletar seus dados a qualquer momento.",
    path: "/privacidade",
    lastUpdated: "02 Mai 2026",
  },
  {
    id: "novidades",
    key: "novidades",
    title: "Novidades VIREL",
    content: "## Changelog\n\n### v2.5.0 — Maio 2026\n- Nova IA de legendas com 3 novos estilos\n- Análise de concorrentes melhorada\n- Dashboard redesenhado\n\n### v2.4.0 — Abril 2026\n- Planejador de conteúdo com drag-and-drop\n- Relatórios avançados para plano Ultra\n- Suporte a múltiplos perfis\n\n### v2.3.0 — Março 2026\n- Score de perfil v2 mais preciso\n- Integração com Meta Business Suite\n- App mobile em beta",
    path: "/novidades",
    lastUpdated: "02 Mai 2026",
  },
];

const STORAGE_KEY = "virel_pages_content";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageContent[]>(DEFAULT_PAGES);
  const [selected, setSelected] = useState<PageContent>(DEFAULT_PAGES[0]);
  const [editTitle, setEditTitle] = useState(DEFAULT_PAGES[0].title);
  const [editContent, setEditContent] = useState(DEFAULT_PAGES[0].content);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PageContent[] = JSON.parse(stored);
        setPages(parsed);
        setSelected(parsed[0]);
        setEditTitle(parsed[0].title);
        setEditContent(parsed[0].content);
      }
    } catch {}
  }, []);

  const selectPage = (page: PageContent) => {
    setSelected(page);
    setEditTitle(page.title);
    setEditContent(page.content);
    setSaved(false);
  };

  const savePage = () => {
    const now = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    const updated = pages.map((p) =>
      p.id === selected.id
        ? { ...p, title: editTitle, content: editContent, lastUpdated: now }
        : p
    );
    setPages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Páginas</h1>
        <p className="text-white/50 mt-1">Gerencie o conteúdo das páginas públicas do site</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Page list */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => selectPage(page)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selected.id === page.id
                    ? "bg-virel-purple-500/10 border-virel-purple-500/30 text-virel-purple-300"
                    : "border-virel-dark-border text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <p className="text-sm font-medium">{page.title}</p>
                <p className="text-xs opacity-50 mt-0.5">{page.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold">Editando: {selected.title}</h2>
              <p className="text-white/40 text-xs mt-0.5">Última atualização: {selected.lastUpdated}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={selected.path}
                target="_blank"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <ExternalLink size={16} />
              </Link>
              <Button
                onClick={savePage}
                size="sm"
                className={saved ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {saved ? (
                  <>
                    <Check size={14} />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Título da Página"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título..."
            />
            <div>
              <label className="text-sm font-medium text-white/80 mb-1.5 block">
                Conteúdo (Markdown)
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-72 bg-virel-dark border border-virel-dark-border rounded-xl p-4 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500 font-mono leading-relaxed"
                placeholder="Conteúdo em markdown..."
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/2 rounded-xl border border-virel-dark-border">
            <p className="text-white/30 text-xs">
              Dica: Use <code className="text-virel-purple-400">## Heading</code> para títulos,{" "}
              <code className="text-virel-purple-400">**negrito**</code> para negrito, e{" "}
              <code className="text-virel-purple-400">- item</code> para listas.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
