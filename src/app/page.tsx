import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Lock, MapPin, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard de marketing para agências",
  description:
    "Zuary reúne métricas de redes sociais, site, Google Maps e relatórios para agências que atendem clínicas e negócios locais.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Zuary",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://zuary.vercel.app",
  image: "https://zuary.vercel.app/icon-1024.png",
  description:
    "Dashboard de marketing para agências acompanharem redes sociais, site, Google Maps e relatórios de clientes.",
  offers: {
    "@type": "Offer",
    price: "197",
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
  },
  publisher: {
    "@type": "Organization",
    name: "Zuary",
    url: "https://zuary.vercel.app",
    logo: "https://zuary.vercel.app/icon-1024.png",
  },
};

const features = [
  {
    title: "Redes sociais",
    text: "Instagram e TikTok com alcance, seguidores e conteúdo recente.",
    icon: Share2,
  },
  {
    title: "Site e tráfego",
    text: "Sessões, usuários, canais e eventos do GA4.",
    icon: BarChart3,
  },
  {
    title: "Google Maps",
    text: "Avaliações, buscas, rotas e chamadas do perfil local.",
    icon: MapPin,
  },
  {
    title: "Relatórios",
    text: "Resumo mensal para mostrar resultado sem montar planilha.",
    icon: FileText,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon-1024.png"
              alt="Zuary"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl border border-primary/25"
              priority
            />
            <span className="text-lg font-semibold text-foreground">Zuary</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/about" className="hover:text-foreground">Sobre</Link>
            <Link href="/pricing" className="hover:text-foreground">Preços</Link>
            <Link href="/contact" className="hover:text-foreground">Contato</Link>
          </nav>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Entrar
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="space-y-7">
          <p className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Dashboard para agências
          </p>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Mostre resultado de marketing sem abrir cinco plataformas.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Zuary junta dados de redes sociais, site e Google Maps em uma visão clara para sua equipe e seus clientes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Acessar dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card/60 px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Pedir demonstração
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Integrações via OAuth. Tokens ficam criptografados.
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-card/65 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(124,58,237,0.9),transparent)]" />
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Visão do cliente</p>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Atualizado
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Sessões", "12.430"],
                ["Seguidores", "8.912"],
                ["Alcance", "54.200"],
                ["Nota Google", "4,8"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-card/70 p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-card/70 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Funil</span>
                <span className="text-muted-foreground">52 agendamentos</span>
              </div>
              <div className="space-y-2">
                {[100, 54, 18, 8].map((width, index) => (
                  <div key={index} className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-border bg-card/55 p-5">
              <feature.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
