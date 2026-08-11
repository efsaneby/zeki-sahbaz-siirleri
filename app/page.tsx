import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Her istekte verileri taze çek

export default async function HomePage() {
  const { data: poems, error } = await supabase
    .from("poems")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Şiirler çekilirken hata oluştu:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-12 bg-slate-900 text-white">
      <div className="max-w-4xl w-full">
        {/* Üst Başlık & Vitrin */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-3 tracking-wide">
            Zeki Şahbaz Şiir Dünyası
          </h1>
          <p className="text-slate-400 text-sm md:text-base italic">
            Gönülden süzülen mısralar ve özel eserler
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </header>

        {/* Şiir Kartları Izgarası */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {poems && poems.length > 0 ? (
            poems.map((poem) => (
              <div
                key={poem.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-amber-300 mb-3">
                    {poem.title}
                  </h2>
                  <p className="text-slate-300 text-sm line-clamp-4 italic whitespace-pre-line leading-relaxed">
                    {poem.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    {new Date(poem.created_at).toLocaleDateString("tr-TR")}
                  </span>
                  <Link
                    href={`/poem/${poem.id}`}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              Henüz eklenmiş bir şiir bulunmuyor.
            </div>
          )}
        </section>
      </div>

      {/* YENİ EKLENEN FOOTER (Yönetim Girişi Bağlantısı) */}
      <footer className="w-full max-w-4xl mt-16 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2026 Zeki Şahbaz Şiir Portalı. Tüm hakları saklıdır.</p>
        <Link
          href="/admin"
          className="hover:text-amber-400/80 transition-colors opacity-60 hover:opacity-100"
        >
          Yönetim Girişi ⚙️
        </Link>
      </footer>
    </main>
  );
}
