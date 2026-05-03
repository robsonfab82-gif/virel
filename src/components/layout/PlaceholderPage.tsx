import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

interface PlaceholderPageProps {
  locale: string;
  title: string;
  description: string;
}

export function PlaceholderPage({ locale, title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-virel-dark flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-virel-purple-500/10 border border-virel-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-virel-purple-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">{title}</h1>
          <p className="text-white/50 leading-relaxed mb-8">{description}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-virel-purple-400 hover:text-virel-purple-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Voltar para o início
          </Link>
        </div>
      </div>
      <footer className="py-6 border-t border-virel-dark-border text-center">
        <p className="text-white/20 text-xs">© {new Date().getFullYear()} VIREL. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
