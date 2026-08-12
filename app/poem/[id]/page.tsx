import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyProtection from "@/components/CopyProtection";

export const revalidate = 0;

export default async function PoemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: poem, error } = await supabase
    .from("poems")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !poem) {
    notFound();
  }

  function getYouTubeEmbedUrl(url: string | null) {
    if (!url) return null;
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  const embedUrl = getYouTubeEmbedUrl(poem.youtube_url);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-slate-900 text-white">
      <div className="max-w-3xl w-full">
        {/* Geri Dön Linki */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          ← Tüm Şiirlere Dön
        </Link>

        {/* Şiir Başlığı */}
        <h1 className="text-3xl md:text-5xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-4">
          {poem.title}
        </h1>

        {/* YouTube Video Alanı (Varsa) */}
        {embedUrl && (
          <div className="mb-8 aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <iframe
              src={embedUrl}
              title={poem.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* TELİF KORUMALI ŞİİR METNİ */}
        <CopyProtection>
          <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 shadow-xl">
            <p className="text-slate-200 italic text-base md:text-lg leading-relaxed whitespace-pre-line">
              {poem.content}
            </p>
          </div>
        </CopyProtection>

        {/* YASAL TELİF UYARI KUTUSU */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 text-center text-xs text-slate-400">
          <p className="font-semibold text-amber-400/90 mb-1">
            ⚖️ Yasal Telif Sorumluluk Reddi
          </p>
          <p>
            Bu sayfada yer alan şiir ve edebi eserlerin tüm yayın, telif ve
            mülkiyet hakları şair <strong>Zeki Şahbaz</strong>&apos;a aittir.
            Yazardan veya hak sahibinden yazılı izin alınmaksızın kısmen veya
            tamamen kopyalanamaz, basılamaz ve dijital mecralarda yayınlanamaz.
          </p>
        </div>
      </div>
    </main>
  );
}
