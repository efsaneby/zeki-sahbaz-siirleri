import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeki Şahbaz - Şiir Dünyası",
  description:
    "Şair Zeki Şahbaz'ın kaleme aldığı en özel şiirler, video yorumları ve edebi eserler portalı.",
  openGraph: {
    title: "Zeki Şahbaz - Şiir Dünyası",
    description:
      "Şair Zeki Şahbaz'ın kaleme aldığı en özel şiirler ve video yorumları.",
    url: "https://zeki-sahbaz-siirleri.vercel.app", // Kendi canlı Vercel URL'in
    siteName: "Zeki Şahbaz Şiir Portalı",
    images: [
      {
        url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop", // Şık bir edebiyat/şiir kapak görseli
        width: 1200,
        height: 630,
        alt: "Zeki Şahbaz Şiir Portalı",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
