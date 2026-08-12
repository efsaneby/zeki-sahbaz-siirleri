"use client";

import { useEffect } from "react";

export default function CopyProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 1. Sağ Tık Menüsünü Engelle
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Kopyalama Anında Otomatik Telif & Kaynak Metni Ekle
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === "") return;

      const copiedText = selection.toString();
      const copyrightText = `\n\n-----------------------------------\n© Zeki Şahbaz Şiir Portalı - Tüm Hakları Saklıdır.\nKaynak: ${window.location.href}`;

      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", copiedText + copyrightText);
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  return <div className="select-none">{children}</div>;
}
