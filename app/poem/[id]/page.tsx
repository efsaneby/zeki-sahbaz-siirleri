{
  /* TELİF KORUMALI ŞİİR METNİ VE FİLİGRAN */
}
<CopyProtection>
  <div className="relative overflow-hidden bg-slate-800/60 p-8 md:p-12 rounded-2xl border border-slate-700/60 shadow-xl">
    {/* Arka Plan Filigranı (Watermark) */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-[0.06] rotate-[-25deg]">
      <span className="text-4xl md:text-6xl font-black text-white tracking-widest whitespace-nowrap text-center">
        © ZEKİ ŞAHBAZ
        <br />
        TÜM HAKLARI SAKLIDIR
      </span>
    </div>

    {/* Şiir Metni */}
    <p className="relative z-10 text-slate-100 font-serif italic text-lg md:text-xl leading-relaxed whitespace-pre-line tracking-wide">
      {poem.content}
    </p>
  </div>
</CopyProtection>;
