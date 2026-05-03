"use client";
import { useState, useEffect, useRef } from "react";
import { Upload, Video, X, Save, Play, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  saveBlob,
  loadBlob,
  deleteBlob,
  createBlobURL,
  revokeBlobURL,
  saveVideoMeta,
  loadVideoMeta,
  deleteVideoMeta,
} from "@/lib/storage";

const VIDEO_KEY = "virel_demo_video";

export default function AdminDemoPage() {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [meta, setMeta] = useState({ title: "VIREL em Ação", description: "Veja como o VIREL pode transformar sua presença no Instagram com inteligência artificial." });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentMeta, setCurrentMeta] = useState<{ title: string; description: string; fileName: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedMeta = loadVideoMeta();
    if (savedMeta) {
      setCurrentMeta(savedMeta);
      setMeta({ title: savedMeta.title, description: savedMeta.description });
      loadBlob(VIDEO_KEY).then((blob) => {
        if (blob) {
          const url = createBlobURL(blob);
          setVideoURL(url);
        }
      });
    }
    return () => {
      if (videoURL) revokeBlobURL(videoURL);
    };
  }, []);

  const handleVideoFile = async (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setIsLoading(true);
    try {
      if (videoURL) revokeBlobURL(videoURL);
      await saveBlob(VIDEO_KEY, file);
      const url = createBlobURL(file);
      setVideoURL(url);
      setCurrentMeta({ title: meta.title, description: meta.description, fileName: file.name, size: file.size });
      setIsSaved(false);
    } catch (err) {
      console.error("Erro ao salvar vídeo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleVideoFile(file);
  };

  const handleSave = () => {
    if (!currentMeta) return;
    saveVideoMeta({
      title: meta.title,
      description: meta.description,
      fileName: currentMeta.fileName,
      size: currentMeta.size,
      type: "video",
      savedAt: new Date().toISOString(),
    });
    setCurrentMeta({ ...currentMeta, title: meta.title, description: meta.description });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (videoURL) revokeBlobURL(videoURL);
    await deleteBlob(VIDEO_KEY);
    deleteVideoMeta();
    setVideoURL(null);
    setCurrentMeta(null);
    setMeta({ title: "VIREL em Ação", description: "Veja como o VIREL pode transformar sua presença no Instagram com inteligência artificial." });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Demonstração</h1>
        <p className="text-white/50 mt-1">Gerencie o vídeo de demonstração exibido na página pública</p>
      </div>

      {/* Video upload */}
      <Card>
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Video size={18} className="text-virel-purple-400" />
          Vídeo de Demonstração
        </h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {videoURL ? (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-black border border-virel-dark-border">
              <video
                ref={videoRef}
                src={videoURL}
                controls
                className="w-full max-h-80 object-contain"
              />
            </div>
            {currentMeta && (
              <div className="flex items-center justify-between text-xs text-white/40 bg-white/3 rounded-xl px-4 py-3">
                <span className="flex items-center gap-1.5">
                  <Play size={12} />
                  {currentMeta.fileName}
                </span>
                <span>{formatSize(currentMeta.size)}</span>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Upload size={14} />
                Trocar Vídeo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/5"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              isDragging
                ? "border-virel-purple-500 bg-virel-purple-500/10"
                : "border-virel-dark-border hover:border-virel-purple-500/50 hover:bg-white/2"
            } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {isLoading ? (
              <p className="text-white/50 text-sm">Salvando vídeo...</p>
            ) : (
              <>
                <Upload size={32} className="text-white/30" />
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium">Clique ou arraste o vídeo aqui</p>
                  <p className="text-white/30 text-xs mt-1">MP4, WebM — sem limite de tamanho (usa IndexedDB)</p>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Meta info */}
      <Card>
        <h2 className="text-white font-bold mb-4">Informações do Vídeo</h2>
        <div className="space-y-4">
          <Input
            label="Título"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            placeholder="VIREL em Ação"
          />
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Descrição</label>
            <textarea
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="w-full h-24 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
              placeholder="Descrição do vídeo de demonstração..."
            />
          </div>
          <Button onClick={handleSave} disabled={!videoURL}>
            <Save size={14} />
            {isSaved ? "Salvo!" : "Salvar Informações"}
          </Button>
        </div>
      </Card>

      {/* Info box */}
      <div className="bg-virel-purple-500/5 border border-virel-purple-500/20 rounded-xl p-4">
        <p className="text-virel-purple-400 text-xs font-medium mb-1">Como funciona</p>
        <p className="text-white/50 text-xs leading-relaxed">
          O vídeo é salvo localmente no IndexedDB do navegador (sem limite de 5MB do localStorage).
          A página pública <code className="text-virel-purple-400">/demo</code> lê o vídeo do IndexedDB e o exibe no player.
          Se não houver vídeo salvo, a página pública mostra um placeholder.
        </p>
      </div>
    </div>
  );
}
