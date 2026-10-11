import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mendoza Reporta",
  description: "Panel de Gestión y Monitoreo Urbano - Mendoza Reporta",
  icons: {
    icon: "/mendoza.webp",
    shortcut: "/mendoza.webp",
    apple: "/mendoza.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="h-screen">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
