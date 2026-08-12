"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Poem {
  id: number;
  title: string;
  content: string;
  youtube_url: string | null;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Şiir Formu State'leri
  const [poems, setPoems] = useState<Poem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // LocalStorage üzerinden oturum kontrolü
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchPoems();
    }
  }, []);

  // Giriş Yapma
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "zeki123") {
      // Şifreni buraya yazabilirsin
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      setLoginError("");
      fetchPoems();
    } else {
      setLoginError("Hatalı şifre! Lütfen tekrar deneyin.");
    }
  };

  // Çıkış Yapma
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
  };

  // Tüm Şiirleri Çekme
  const fetchPoems = async () => {
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPoems(data);
    }
  };

  // Düzenleme Modunu Başlatma
  const handleStartEdit = (poem: Poem) => {
    setEditingId(poem.id);
    setTitle(poem.title);
    setContent(poem.content);
    setYoutubeUrl(poem.youtube_url || "");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Düzenlemeyi İptal Etme
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setYoutubeUrl("");
    setMessage("");
  };

  // Şiir Kaydetme veya Güncelleme (CRUD - Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage("Lütfen başlık ve şiir içeriğini doldurun.");
      return;
    }

    setLoading(true);
    setMessage("");

    if (editingId) {
      // GÜNCELLEME İŞLEMİ (UPDATE)
      const { error } = await supabase
        .from("poems")
        .update({
          title,
          content,
          youtube_url: youtubeUrl || null,
        })
        .eq("id", editingId);

      setLoading(false);

      if (error) {
        setMessage("Güncellenirken hata oluştu: " + error.message);
      } else {
        setMessage("✨ Şiir başarıyla güncellendi!");
        handleCancelEdit();
        fetchPoems();
      }
    } else {
      // YENİ EKLEME İŞLEMİ (CREATE)
      const { error } = await supabase.from("poems").insert([
        {
          title,
          content,
          youtube_url: youtubeUrl || null,
        },
      ]);

      setLoading(false);

      if (error) {
        setMessage("Ekleme sırasında hata oluştu: " + error.message);
      } else {
        setMessage("🎉 Yeni şiir başarıyla eklendi!");
        setTitle("");
        setContent("");
        setYoutubeUrl("");
        fetchPoems();
      }
    }
  };

  // Şiir Silme (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("Bu şiiri silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase.from("poems").delete().eq("id", id);

    if (error) {
      alert("Silinirken hata oluştu: " + error.message);
    } else {
      if (editingId === id) handleCancelEdit();
      fetchPoems();
    }
  };

  // GİRİŞ EKRANI
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl"
        >
          <h1 className="text-2xl font-bold text-amber-400 mb-6 text-center">
            🔒 Admin Girişi
          </h1>

          {loginError && (
            <p className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-4 border border-red-500/30">
              {loginError}
            </p>
          )}

          <div className="mb-6">
            <label className="block text-sm text-slate-300 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              placeholder="Yönetici şifreniz"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-3 rounded-xl transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </main>
    );
  }

  // ADMİN PANELİ (TAM CRUD)
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Üst Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">
              ⚙️ Şiir Yönetim Paneli
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Şiir ekleyebilir, güncelleyebilir veya silebilirsiniz.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-slate-300 transition-colors"
            >
              🌐 Siteye Git
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-500/30 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>

        {/* Şiir Formu (Ekleme / Güncelleme) */}
        <div className="bg-slate-800/80 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-100">
              {editingId ? "✏️ Şiiri Düzenle" : "➕ Yeni Şiir Ekle"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Vazgeç / Yeni Şiir Ekle
              </button>
            )}
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm ${
                message.includes("başarıyla")
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/20 border border-amber-500/30 text-amber-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şiir Başlığı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Mavi Gece"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şiir Metni
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Şiir mısralarını buraya yazın..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                YouTube Video Linki (Opsiyonel)
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-bold p-3.5 rounded-xl transition-colors shadow-lg"
            >
              {loading
                ? "Kaydediliyor..."
                : editingId
                  ? "Şiiri Güncelle"
                  : "Şiiri Yayınla"}
            </button>
          </form>
        </div>

        {/* Mevcut Şiirler Listesi */}
        <div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">
            📚 Kayıtlı Şiirler ({poems.length})
          </h2>

          <div className="space-y-3">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between hover:border-slate-600 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-slate-100">{poem.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {poem.content}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(poem)}
                    className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30 transition-colors"
                    title="Düzenle"
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(poem.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30 transition-colors"
                    title="Sil"
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}

            {poems.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-8">
                Henüz kayıtlı şiir bulunmuyor.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
