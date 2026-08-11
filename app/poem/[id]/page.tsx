import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function getYouTubeEmbedUrl(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default async function SiirDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: poem, error } = await supabase
    .from('poems')
    .select('id, title, content, youtube_url')
    .eq('id', id)
    .single();

  if (error || !poem) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900 text-white">
        <h1 className="text-2xl text-red-400 mb-4">Şiir bulunamadı veya bir hata oluştu.</h1>
        <Link href="/" className="text-amber-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>
      </main>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(poem.youtube_url);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-900 text-white">
      <div className="max-w-3xl w-full mt-8">
        <Link href="/" className="inline-block text-amber-400 hover:text-amber-300 mb-6 transition-colors">
          ← Tüm Şiirlere Dön
        </Link>

        <article className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          {/* Şiir Başlığı */}
          <h1 className="text-3xl font-bold text-amber-400 mb-6">{poem.title}</h1>

          {/* YouTube Video Oynatıcı */}
          {embedUrl && (
            <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
              <iframe
                src={embedUrl}
                title={poem.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Şiir İçeriği */}
          <p className="text-slate-200 text-lg whitespace-pre-line leading-relaxed italic border-l-2 border-amber-400/40 pl-6 my-6">
            "{poem.content.replaceAll('\\n', '\n')}"
          </p>
        </article>
      </div>
    </main>
  );
}