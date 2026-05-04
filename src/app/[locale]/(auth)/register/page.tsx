"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/onboarding`,
      },
    });
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    
    // Use API route to create user with confirmed email
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        name: form.name,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      alert(data.error || "Erro ao criar conta");
      return;
    }

    // Auto-login after registration
    const supabase = createClient();
    await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    
    window.location.href = `/${locale}/onboarding`;
  };

  return (
    <div className="min-h-screen bg-virel-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-virel-purple-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-virel rounded-xl flex items-center justify-center">
              <span className="text-white font-black">V</span>
            </div>
            <span className="text-white font-bold text-2xl">VIREL</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Crie sua conta</h1>
          <p className="text-white/50 mt-1">Comece a crescer no Instagram hoje</p>
        </div>

        <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6">
          <Button variant="secondary" size="lg" className="w-full mb-6" type="button" onClick={handleGoogleLogin} loading={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-virel-dark-border" />
            <span className="text-white/30 text-xs">ou</span>
            <div className="flex-1 h-px bg-virel-dark-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome completo" type="text" placeholder="Seu nome" prefixIcon={<User size={16} />} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="E-mail" type="email" placeholder="seu@email.com" prefixIcon={<Mail size={16} />} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              prefixIcon={<Lock size={16} />}
              suffixIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
            <Input label="Confirmar senha" type="password" placeholder="••••••••" prefixIcon={<Lock size={16} />} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />

            <p className="text-white/40 text-xs">
              Ao criar conta, você concorda com nossos{" "}
              <Link href="#" className="text-virel-purple-400 hover:underline">Termos de Uso</Link>
              {" "}e{" "}
              <Link href="#" className="text-virel-purple-400 hover:underline">Política de Privacidade</Link>
            </p>

            <Button type="submit" size="lg" className="w-full" loading={loading}>Criar conta grátis</Button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          Já tem conta?{" "}
          <Link href={`/${locale}/login`} className="text-virel-purple-400 hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
