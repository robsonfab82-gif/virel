"use client";
import { useState } from "react";
import { User, Lock, Globe, Crown, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const languages = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "zh", label: "中文" },
];

const planInfo: Record<string, { label: string; color: string; variant: "success" | "warning" | "info" | "purple" | "error" }> = {
  start: { label: "Start", color: "text-blue-400", variant: "info" },
  pro: { label: "Pro", color: "text-virel-purple-400", variant: "purple" },
  ultra: { label: "Ultra", color: "text-yellow-400", variant: "warning" },
};

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("pt-BR");
  const currentPlan = "pro";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const saveProfile = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    await new Promise((r) => setTimeout(r, 600));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Configurações</h1>
        <p className="text-white/50 mt-1">Gerencie sua conta e preferências</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-virel-purple-500/15 flex items-center justify-center">
            <User size={18} className="text-virel-purple-400" />
          </div>
          <h2 className="text-white font-bold">Informações do Perfil</h2>
        </div>
        <div className="space-y-4">
          <Input
            label="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/80">Idioma</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl bg-virel-dark-card border border-virel-dark-border text-white h-11 pl-10 pr-4 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-virel-purple-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value} className="bg-virel-dark-card">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={saveProfile} size="sm" className="gap-2">
              <Save size={16} />
              {profileSaved ? "Salvo!" : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Plan */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Crown size={18} className="text-yellow-400" />
          </div>
          <h2 className="text-white font-bold">Plano Atual</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-virel-dark-border">
          <div>
            <p className="text-white/50 text-sm">Você está no plano</p>
            <p className={cn("font-bold text-lg capitalize mt-0.5", planInfo[currentPlan]?.color)}>
              {planInfo[currentPlan]?.label}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={planInfo[currentPlan]?.variant ?? "purple"}>Ativo</Badge>
            <Button variant="secondary" size="sm">
              Fazer upgrade
            </Button>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Lock size={18} className="text-blue-400" />
          </div>
          <h2 className="text-white font-bold">Trocar Senha</h2>
        </div>
        <div className="space-y-4">
          <Input
            label="Senha atual"
            type={showCurrentPw ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            suffixIcon={
              <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="text-white/40 hover:text-white/70 transition-colors">
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Nova senha"
            type={showNewPw ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            hint="Use letras, números e símbolos para uma senha mais segura."
            suffixIcon={
              <button type="button" onClick={() => setShowNewPw((v) => !v)} className="text-white/40 hover:text-white/70 transition-colors">
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={passwordMismatch ? "As senhas não coincidem" : undefined}
          />
          <div className="pt-2">
            <Button
              onClick={changePassword}
              size="sm"
              disabled={!currentPassword || !newPassword || passwordMismatch}
              className="gap-2"
            >
              <Lock size={16} />
              {passwordSaved ? "Senha alterada!" : "Trocar senha"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Account */}
      <Card variant="bordered" className="border-red-500/20 hover:border-red-500/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Trash2 size={18} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold">Deletar Conta</h2>
        </div>
        <p className="text-white/50 text-sm mb-4">
          Esta ação é permanente e irreversível. Todos os seus dados, análises e configurações serão excluídos.
        </p>
        {!deletingAccount ? (
          <Button
            variant="secondary"
            size="sm"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
            onClick={() => setDeletingAccount(true)}
          >
            <Trash2 size={16} />
            Deletar minha conta
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-300 text-sm font-medium">
              Digite <span className="font-bold">DELETAR</span> para confirmar:
            </p>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETAR"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setDeletingAccount(false); setDeleteConfirm(""); }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 border-red-600"
                disabled={deleteConfirm !== "DELETAR"}
              >
                Confirmar exclusão
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
