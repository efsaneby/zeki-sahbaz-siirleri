import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Home() {
  // Supabase'den doğrudan tüm şiirleri çekiyoruz (Kategori sorgusu yok)
  const { data: poems, error } = await supabase
    .from("poems")
    .select("id, title, content");

  if (error) {
    console.error("Veri çekme hatası:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-slate-900 text-white">
      {/* Üst Başlık & Hero Alanı */}
      <header className="text-center my-8 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-500">
          Zeki Şahbaz Şiir Dünyası
        </h1>
        <p className="text-slate-400 text-base md:text-lg">
          Gönülden süzülen mısralar ve özel eserler
        </p>
        <div className="w-24 h-1 bg-amber-400/40 mx-auto mt-4 rounded-full"></div>
      </header>

      {/* Şiir Kartları Grid Kapsayıcısı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {poems &&
          poems.map((poem: any) => (
            <div
              key={poem.id}
              className="bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/80 hover:border-amber-400/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Şiir Başlığı */}
                <div className="mb-4">
                  <Link href={`/siir/${poem.id}`} className="hover:underline">
                    <h2 className="text-2xl font-bold text-amber-400 line-clamp-1">
                      {poem.title}
                    </h2>
                  </Link>
                </div>

                {/* Şiir Özeti (İlk 4 satır) */}
                <p className="text-slate-300 whitespace-pre-line leading-relaxed italic text-sm line-clamp-4 mb-4">
                  "{poem.content.replaceAll("\\n", "\n")}"
                </p>
              </div>

              {/* Alt Detay Bağlantısı */}
              <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                <Link
                  href={`/siir/${poem.id}`}
                  className="text-sm text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 group"
                >
                  Devamını Oku
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
