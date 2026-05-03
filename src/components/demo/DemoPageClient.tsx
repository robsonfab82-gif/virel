"use client";
import { useState, useEffect, useRef } from "react";
import { Video } from "lucide-react";
import { loadBlob, loadVideoMeta, createBlobURL, revokeBlobURL } from "@/lib/storage";

const VIDEO_KEY = "virel_demo_video";

export function DemoPageClient() {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const blobURLRef = useRef<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const savedMeta = loadVideoMeta();
        if (savedMeta) {
          setMeta({ title: savedMeta.title, description: savedMeta.description });
        }
        const blob = await loadBlob(VIDEO_KEY);
        if (blob) {
          const url = createBlobURL(blob);
          blobURLRef.current = url;
          setVideoURL(url);
        }
      } catch (err) {
        console.error("Erro ao carregar vídeo:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => {
      if (blobURLRef.current) revokeBlobURL(blobURLRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-virel-dark-card border border-virel-dark-border rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-virel-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!videoURL) {
    return (
      <div className="w-full aspect-video bg-virel-dark-card border border-virel-dark-border rounded-2xl flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-virel-purple-500/10 border border-virel-purple-500/20 rounded-full flex items-center justify-center">
          <Video size={36} className="text-virel-purple-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xl mb-1">Vídeo em breve</p>
          <p className="text-white/40 text-sm">Nossa equipe está preparando uma demonstração incrível para você.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meta && (
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-white">{meta.title}</h2>
          {meta.description && (
            <p className="text-white/50 text-sm mt-1 max-w-2xl mx-auto">{meta.description}</p>
          )}
        </div>
      )}
      <div className="w-full rounded-2xl overflow-hidden bg-black border border-virel-dark-border shadow-2xl shadow-virel-purple-500/10">
        <video
          ref={videoRef}
          src={videoURL}
          controls
          className="w-full"
          style={{ maxHeight: "520px" }}
          poster={undefined}
        />
      </div>
    </div>
  );
}
