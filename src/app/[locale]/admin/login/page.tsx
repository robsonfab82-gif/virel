"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const { locale } = useParams() as { locale: string };
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple admin auth - in production use proper auth
    if (password === "admin123") {
      // Set admin session in localStorage
      localStorage.setItem("virel_admin_session", "true");
      window.location.href = `/${locale}/admin`;
    } else {
      setLoading(false);
      setError("Senha incorreta");
    }
  };

  return (
    <div className="min-h-screen bg-virel-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-virel-purple-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-virel rounded-xl flex items-center justify-center">
              <span className="text-white font-black">V</span>
            </div>
            <span className="text-white font-bold text-2xl">VIREL</span>
          </div>
          <h1 className="text-2xl font-black text-white">Painel Admin</h1>
          <p className="text-white/50 mt-1">Acesso restrito</p>
        </div>

        <div className="bg-virel-dark-card border border-virel-dark-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Senha de Administrador"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              required
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
