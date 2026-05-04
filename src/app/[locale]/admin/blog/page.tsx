"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Upload, X, Image } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MOCK_POSTS } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

const STORAGE_KEY = "virel_blog_posts";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Equipe VIREL",
  categories: "",
  tags: "",
  status: "draft" as "draft" | "published",
  metaDescription: "",
  readTime: 5,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        setPosts([]);
      }
    } catch {
      setPosts([]);
    }
  }, []);

  const savePosts = (updated: BlogPost[]) => {
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      categories: post.categories.join(", "),
      tags: post.tags.join(", "),
      status: post.status,
      metaDescription: post.metaDescription,
      readTime: post.readTime,
    });
    setIsModalOpen(true);
  };

  const savePost = () => {
    const postData: BlogPost = {
      id: editing?.id ?? String(Date.now()),
      slug: form.slug || slugify(form.title),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&q=80",
      author: form.author,
      authorAvatar: form.author[0] ?? "V",
      date: editing?.date ?? new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      categories: form.categories.split(",").map((c) => c.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: form.status,
      metaDescription: form.metaDescription,
      readTime: form.readTime,
    };

    if (editing) {
      savePosts(posts.map((p) => (p.id === editing.id ? postData : p)));
    } else {
      savePosts([postData, ...posts]);
    }
    setIsModalOpen(false);
  };

  const deletePost = (id: string) => {
    savePosts(posts.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    savePosts(
      posts.map((p) =>
        p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p
      )
    );
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setForm((prev) => ({ ...prev, coverImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Blog</h1>
          <p className="text-white/50 mt-1">{posts.length} posts • {posts.filter((p) => p.status === "published").length} publicados</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} />
          Novo Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar posts..."
            prefixIcon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                filter === f
                  ? "bg-virel-purple-500/20 border-virel-purple-500/40 text-virel-purple-300"
                  : "border-virel-dark-border text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Rascunhos"}
            </button>
          ))}
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <Card key={post.id} className="hover:border-virel-purple-500/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-virel-dark">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm truncate">{post.title}</h3>
                  <Badge variant={post.status === "published" ? "success" : "warning"} className="text-xs flex-shrink-0">
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                <p className="text-white/40 text-xs truncate">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.categories.slice(0, 3).map((cat) => (
                    <span key={cat} className="px-2 py-0.5 bg-virel-purple-500/10 text-virel-purple-400 text-xs rounded-full border border-virel-purple-500/20">
                      {cat}
                    </span>
                  ))}
                  <span className="text-white/30 text-xs">{post.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleStatus(post.id)}
                  title={post.status === "published" ? "Despublicar" : "Publicar"}
                >
                  {post.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(post)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:bg-red-500/5"
                  onClick={() => setDeleteConfirm(post.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">
            Nenhum post encontrado.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Editar Post" : "Novo Post"}
        description={editing ? "Edite as informações do post" : "Crie um novo post para o blog"}
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={savePost} disabled={!form.title}>
              {editing ? "Salvar" : "Criar Post"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <Input
            label="Título *"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm({ ...form, title, slug: editing ? form.slug : slugify(title) });
            }}
            placeholder="Título do post"
          />
          <Input
            label="Slug (URL)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="titulo-do-post"
          />
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Resumo</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full h-20 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
              placeholder="Breve resumo do post..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Conteúdo (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full h-40 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500 font-mono"
              placeholder="## Título&#10;&#10;Conteúdo do post em markdown..."
            />
          </div>

          {/* Cover image upload */}
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Imagem de Capa</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            {form.coverImage ? (
              <div className="relative rounded-xl overflow-hidden border border-virel-dark-border">
                <img
                  src={form.coverImage}
                  alt="Preview da capa"
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => setForm({ ...form, coverImage: "" })}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 text-white transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 rounded-lg px-3 py-1.5 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Upload size={12} />
                  Trocar
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragging
                    ? "border-virel-purple-500 bg-virel-purple-500/10"
                    : "border-virel-dark-border hover:border-virel-purple-500/50 hover:bg-white/2"
                }`}
              >
                <Image size={24} className="text-white/30" />
                <p className="text-white/50 text-sm text-center">
                  Clique ou arraste uma imagem aqui
                </p>
                <p className="text-white/30 text-xs">PNG, JPG, WEBP até qualquer tamanho</p>
              </div>
            )}
            <div className="mt-2">
              <Input
                label=""
                value={form.coverImage.startsWith("data:") ? "" : form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="Ou cole uma URL de imagem: https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Autor"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Nome do autor"
            />
            <Input
              label="Tempo de leitura (min)"
              type="number"
              value={String(form.readTime)}
              onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
              placeholder="5"
            />
          </div>
          <Input
            label="Categorias (separadas por vírgula)"
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            placeholder="Crescimento, IA, Marketing"
          />
          <Input
            label="Tags (separadas por vírgula)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="instagram, ia, crescimento"
          />
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Meta Description (SEO)</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full h-16 bg-virel-dark border border-virel-dark-border rounded-xl p-3 text-white text-sm placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-virel-purple-500"
              placeholder="Descrição para motores de busca (150-160 caracteres)"
            />
            <p className="text-white/30 text-xs mt-1">{form.metaDescription.length}/160 caracteres</p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/80 mb-1.5 block">Status</label>
            <div className="flex gap-3">
              {(["draft", "published"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                    form.status === s
                      ? s === "published"
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                      : "border-virel-dark-border text-white/50 hover:border-white/20"
                  }`}
                >
                  {s === "draft" ? "Rascunho" : "Publicar"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Excluir Post"
        description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
        actions={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deletePost(deleteConfirm!)}
            >
              Excluir
            </Button>
          </>
        }
      ><></></Modal>
    </div>
  );
}
