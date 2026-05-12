// Layout raiz — Zuary Marketing Dashboard
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
  display: "swap",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zuary",
  url: "https://zuary.vercel.app",
  logo: "https://zuary.vercel.app/icon-1024.png",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zuary.vercel.app"),
  title: {
    default: "Zuary | Dashboard de marketing para agências",
    template: "%s | Zuary",
  },
  description:
    "Dashboard para agências acompanharem métricas de marketing, redes sociais, site, Google Maps e relatórios de clientes em um só lugar.",
  applicationName: "Zuary",
  authors: [{ name: "Zuary" }],
  creator: "Zuary",
  publisher: "Zuary",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 150,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://zuary.vercel.app",
    siteName: "Zuary",
    title: "Zuary | Dashboard de marketing para agências",
    description:
      "Veja métricas de redes sociais, site, Google Maps e relatórios de clientes em um só dashboard.",
    images: [
      {
        url: "/icon-1024.png",
        width: 1024,
        height: 1024,
        alt: "Logo do Zuary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuary | Dashboard de marketing para agências",
    description:
      "Métricas de marketing e relatórios para agências que atendem negócios locais.",
    images: ["/icon-1024.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${geist.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
