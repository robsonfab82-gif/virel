import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://virel.com.br"),
  title: {
    default: "VIREL — Cresça no Instagram com IA",
    template: "%s — VIREL",
  },
  description:
    "Analise seu perfil, gere ideias de conteúdo, hashtags inteligentes e legendas virais com inteligência artificial. Mais de 50.000 criadores confiam no VIREL.",
  keywords: ["instagram", "crescimento", "inteligência artificial", "hashtags", "legendas", "engajamento", "marketing digital"],
  authors: [{ name: "VIREL" }],
  creator: "VIREL",
  publisher: "VIREL",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://virel.com.br",
    siteName: "VIREL",
    title: "VIREL — Cresça no Instagram com IA",
    description: "Analise seu perfil, gere ideias de conteúdo, hashtags inteligentes e legendas virais com IA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIREL — Plataforma de Crescimento no Instagram com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIREL — Cresça no Instagram com IA",
    description: "A plataforma de crescimento para Instagram com IA mais avançada do Brasil.",
    images: ["/og-image.png"],
    creator: "@virel_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-virel-dark text-white`}>
        {children}
      </body>
    </html>
  );
}
