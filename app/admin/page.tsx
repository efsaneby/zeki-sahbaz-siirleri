"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// GİZLİ ADMİN ŞİFRESİ (İstediğin şifreyle değiştirebilirsin)
const ADMIN_PASSWORD = "zeki";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [poems, setPoems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Daha önce giriş yapıp yapmadığını oturum hafızasından kontrol et
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchPoems();
    }
  }, []);

  // Şifre Doğrulama Fonksiyonu
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasswordError("");
      fetchPoems();
    } else {
      setPasswordError("Hatalı şifre! Lütfen tekrar deneyin.");
    }
  }

  // Çıkış Yapma Fonksiyonu
  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setPasswordInput("");
  }

  // Sayfa yüklendiğinde mevcut şiirleri çek
  async function fetchPoems() {
    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setPoems(data);
    }
  }

  // Yeni Şiir Ekleme
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) {
      setMessage("Lütfen başlık ve şiir metnini doldurun.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("poems").insert([
      {
        title,
        content,
        youtube_url: youtubeUrl || null,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Hata oluştu: " + error.message);
    } else {
      setMessage("Şiir başarıyla eklendi! 🎉");
      setTitle("");
      setContent("");
      setYoutubeUrl("");
      fetchPoems();
    }
  }

  // Şiir Silme
  async function handleDelete(id: number) {
    if (!confirm("Bu şiiri silmek istediğinize emin misiniz?")) return;

    const { error } = await supabase.from("poems").delete().eq("id", id);

    if (error) {
      alert("Silinirken hata oluştu: " + error.message);
    } else {
      fetchPoems();
    }
  }

  // --- 1. ŞİFRE GİRİŞ EKRANI (Giriş yapılmadıysa bu görünür) ---
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-amber-400 text-center mb-2">
            Yönetici Girişi
          </h1>
          <p className="text-sm text-slate-400 text-center mb-6">
            Zeki Şahbaz Şiir Dünyası Yönetim Paneli
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Yönetici Şifresi
              </label>
              <input
                type="password"
                placeholder="Şifrenizi girin..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {passwordError && (
              <p className="text-xs text-red-400 font-medium">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-amber-400/10"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              ← Sitemize Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- 2. YÖNETİM PANELİ (Giriş yapıldıysa bu görünür) ---
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-slate-900 text-white">
      <div className="max-w-4xl w-full">
        {/* Üst Navigasyon */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">
              Şiir Yönetim Paneli
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Hoş geldiniz, Zeki Şahbaz Yönetimi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
            >
              ← Sitemize Dön
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Bilgilendirme Mesajı */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm">
            {message}
          </div>
        )}

        {/* Yeni Şiir Ekleme Formu */}
        <section className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">
            Yeni Şiir Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şiir Başlığı
              </label>
              <input
                type="text"
                placeholder="Örn: Mavi Yağmur"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Şiir Metni
              </label>
              <textarea
                rows={6}
                placeholder="Şiirin mısralarını buraya yapıştırın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 italic"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                YouTube Video Linki{" "}
                <span className="text-xs text-slate-400">(İsteğe Bağlı)</span>
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-amber-400/10 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Şiiri Yayınla"}
            </button>
          </form>
        </section>

        {/* Mevcut Şiirler Listesi */}
        <section className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Mevcut Şiirler ({poems.length})
          </h2>

          <div className="space-y-4">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50"
              >
                <div>
                  <h3 className="font-semibold text-amber-300">{poem.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                    {poem.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(poem.id)}
                  className="text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3 py-2 rounded-lg transition-all"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
