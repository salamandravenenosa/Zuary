import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Lock, MapPin, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Zuary — Marketing Analytics",
  description:
    "Suas métricas de marketing em um só lugar. Redes sociais, site e Google Maps.",
};

const features = [
  {
    title: "Redes sociais",
    text: "Instagram e TikTok: seguidores, alcance, engajamento. Tudo junto.",
    icon: Share2,
  },
  {
    title: "Site",
    text: "Quem visitou, de onde veio, o que fez. Dados do Google Analytics direto aqui.",
    icon: BarChart3,
  },
  {
    title: "Google Maps",
    text: "Notas, avaliações, ligações e rotas. O que as pessoas fazem quando te encontram no Google.",
    icon: MapPin,
  },
  {
    title: "Relatórios",
    text: "Resumo mensal pronto. Não precisa montar planilha nenhuma.",
    icon: FileText,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
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
            <Link href="/about" className="hover:text-foreground transition-colors">Sobre</Link>
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
            Marketing Analytics
          </p>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Suas métricas de marketing num só lugar.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Redes sociais, site, Google Maps. Tudo junto pra você ver o que está dando certo e o que precisa mudar.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar na dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Seus dados ficam protegidos. Acesso só pra quem é cliente.
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-card/65 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(124,58,237,0.9),transparent)]" />
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Visão geral</p>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Atualizado
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Sessões", "4.832"],
                ["Seguidores", "12.450"],
                ["Leads", "187"],
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
                <span className="font-medium text-foreground">Evolução</span>
                <span className="text-muted-foreground">Crescimento positivo</span>
              </div>
              <div className="space-y-2">
                {[100, 65, 42, 18].map((width, index) => (
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

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-muted-foreground">
          Zuary © 2026 · Marketing Analytics
        </div>
      </footer>
    </main>
  );
}
