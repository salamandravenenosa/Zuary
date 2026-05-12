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

export const metadata: Metadata = {
  title: "Zuary — Marketing Analytics",
  description:
    "Dashboard de métricas de marketing digital. Monitore redes sociais, site, Google Maps e mais.",
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
        <Providers>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
