"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  MessageSquare,
  Bell,
  LogOut,
  FileText,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  locale: string;
  messages: {
    admin: Record<string, string>;
  };
}

export function AdminSidebar({ locale, messages }: AdminSidebarProps) {
  const pathname = usePathname();
  const t = messages.admin;

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, href: `/${locale}/admin` },
    { icon: Users, label: t.users, href: `/${locale}/admin/users` },
    { icon: CreditCard, label: t.payments, href: `/${locale}/admin/payments` },
    { icon: Package, label: t.plans, href: `/${locale}/admin/plans` },
    { icon: MessageSquare, label: t.feedback, href: `/${locale}/admin/feedback` },
    { icon: Bell, label: t.notifications, href: `/${locale}/admin/notifications` },
    { icon: BookOpen, label: t.blog || "Blog", href: `/${locale}/admin/blog` },
    { icon: PlayCircle, label: t.demo || "Demonstração", href: `/${locale}/admin/demo` },
    { icon: FileText, label: t.pages || "Páginas", href: `/${locale}/admin/pages` },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-virel-dark-card border-r border-virel-dark-border flex flex-col z-30">
      <div className="p-5 border-b border-virel-dark-border">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">VIREL</span>
            <span className="text-red-400 text-xs font-medium ml-1.5">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-red-600/20 text-red-400 border border-red-600/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-virel-dark-border">
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
