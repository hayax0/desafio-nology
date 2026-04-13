import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nology Cashback API",
  description: "Desafio técnico Fullstack - Calculadora de Cashback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-zinc-950`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
