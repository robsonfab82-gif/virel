"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Lightbulb,
  Hash,
  Sparkles,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Crown,
  Palette,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  locale: string;
  user?: {
    name: string;
    email: string;
    instagram?: string;
    plan?: string;
    avatarUrl?: string;
  };
  messages: {
    dashboard: Record<string, string>;
  };
}

export function Sidebar({ locale, user, messages }: SidebarProps) {
  const pathname = usePathname();
  const t = messages.dashboard;

  const navItems = [
    { icon: LayoutDashboard, label: t.home, href: `/${locale}/dashboard`, highlight: false },
    { icon: Wand2, label: "Criar Conteúdo", href: `/${locale}/dashboard/create`, highlight: true },
    { icon: Palette, label: "Perfil da Marca", href: `/${locale}/dashboard/brand`, highlight: false },
    { icon: User, label: t.profile, href: `/${locale}/dashboard/profile`, highlight: false },
    { icon: Lightbulb, label: t.content, href: `/${locale}/dashboard/content`, highlight: false },
    { icon: Hash, label: t.hashtags, href: `/${locale}/dashboard/hashtags`, highlight: false },
    { icon: Sparkles, label: t.captions, href: `/${locale}/dashboard/captions`, highlight: false },
    { icon: Calendar, label: t.planner, href: `/${locale}/dashboard/planner`, highlight: false },
    { icon: Users, label: t.competitors, href: `/${locale}/dashboard/competitors`, highlight: false },
    { icon: MessageSquare, label: t.feedback, href: `/${locale}/dashboard/feedback`, highlight: false },
  ];

  const planColors: Record<string, string> = {
    start: "text-blue-400",
    pro: "text-virel-purple-400",
    ultra: "text-yellow-400",
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-virel-dark-card border-r border-virel-dark-border flex flex-col z-30">
      <div className="p-5 border-b border-virel-dark-border">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-virel rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">VIREL</span>
        </Link>
      </div>

      {user && (
        <div className="p-4 border-b border-virel-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-virel flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{user.name}</p>
              {user.instagram && (
                <p className="text-white/40 text-xs truncate">@{user.instagram}</p>
              )}
            </div>
          </div>
          {user.plan && (
            <div className="mt-3 flex items-center gap-1.5">
              <Crown size={12} className={planColors[user.plan] ?? "text-virel-purple-400"} />
              <span className={cn("text-xs font-medium capitalize", planColors[user.plan] ?? "text-virel-purple-400")}>
                Plano {user.plan}
              </span>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map(({ icon: Icon, label, href, highlight }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            if (highlight && !isActive) {
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 bg-gradient-virel text-white shadow-md shadow-virel-purple-500/30 hover:opacity-90"
                  >
                    <Icon size={18} className="text-white" />
                    {label}
                    <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">IA</span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-gradient-virel text-white shadow-md shadow-virel-purple-500/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-white" : ""} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-virel-dark-border space-y-1">
        <Link
          href={`/${locale}/dashboard/settings`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={18} />
          {t.settings}
        </Link>
        <Link
          href={`/${locale}/login`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={18} />
          {t.logout}
        </Link>
      </div>
    </aside>
  );
}
