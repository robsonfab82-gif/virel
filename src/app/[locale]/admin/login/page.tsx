"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    window.location.href = `/${locale}/admin`;
  };

  return (
    <div className="min-h-screen bg-virel-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">A</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl">VIREL</span>
              <span className="text-red-400 text-sm font-medium ml-1.5">Admin</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">Acesso Administrativo</h1>
          <p className="text-white/50 mt-1">Área restrita</p>
        </div>

        <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="E-mail Admin" type="email" placeholder="admin@virel.com" prefixIcon={<Mail size={16} />} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Senha" type="password" placeholder="••••••••" prefixIcon={<Lock size={16} />} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Button type="submit" size="lg" className="w-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20" loading={loading}>
              Acessar Painel Admin
            </Button>
          </form>
        </div>

        <p className="text-center mt-4">
          <Link href={`/${locale}`} className="text-white/30 text-xs hover:text-white/60 transition-colors">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
