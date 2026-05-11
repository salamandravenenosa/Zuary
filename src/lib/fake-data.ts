// Serviço de dados fake realistas
// Gera métricas que parecem reais para demonstração

// Nomes de negócios para randomizar
const businessNames = [
  "Studio Beauty", "Clínica Sorriso", "Barbearia Old School", "Restaurante Sabor",
  "Loja Fashion", "Academia Force", "Pet Shop Amigo", "Escritório Advocacia",
  "Farmácia Saúde", "Auto Mecânica Total",
];

// Gera dados fake baseado no período
export function generateFakeMetrics(period: string = "30d") {
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const baseMultiplier = days / 30;

  return {
    // KPIs principais
    kpis: {
      sessoes: {
        value: Math.floor(3200 + Math.random() * 2000) * baseMultiplier,
        previousValue: Math.floor(2800 + Math.random() * 1500) * baseMultiplier,
      },
      leads: {
        value: Math.floor(120 + Math.random() * 100) * baseMultiplier,
        previousValue: Math.floor(90 + Math.random() * 80) * baseMultiplier,
      },
      seguidores: {
        value: Math.floor(8000 + Math.random() * 4000),
        previousValue: Math.floor(7200 + Math.random() * 3000),
      },
      notaGoogle: {
        value: 4.5 + Math.random() * 0.4,
        previousValue: 4.3 + Math.random() * 0.4,
      },
    },

    // Gráfico de evolução
    chartData: Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dayOfWeek = date.getDay();
      // Fim de semana tem menos tráfego
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
      const trend = 1 + (i / days) * 0.15; // Tendência de crescimento

      return {
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        sessoes: Math.floor((80 + Math.random() * 60) * weekendFactor * trend),
        leads: Math.floor((3 + Math.random() * 5) * weekendFactor * trend),
        seguidores: Math.floor(15 + Math.random() * 25),
      };
    }),

    // Melhores posts
    topPosts: [
      { id: 1, title: "Promoção de fim de semana — 30% OFF", platform: "Instagram", likes: 892, comments: 67, reach: 5420, type: "Reels" },
      { id: 2, title: "Dica rápida do dia", platform: "TikTok", likes: 2340, comments: 189, reach: 12800, type: "Vídeo" },
      { id: 3, title: "Antes e depois do nosso trabalho", platform: "Instagram", likes: 1456, comments: 98, reach: 8900, type: "Carrossel" },
      { id: 4, title: "bastidores do escritório", platform: "Instagram", likes: 678, comments: 45, reach: 3200, type: "Stories" },
      { id: 5, title: "Tutorial rápido em 60 segundos", platform: "TikTok", likes: 3100, comments: 234, reach: 18500, type: "Vídeo" },
    ],

    // Dados do site
    site: {
      sessoes: Math.floor(3200 + Math.random() * 2000) * baseMultiplier,
      usuariosUnicos: Math.floor(2400 + Math.random() * 1200) * baseMultiplier,
      taxaRejeicao: 32 + Math.random() * 15,
      tempoMedio: Math.floor(120 + Math.random() * 90),
      origemTrafego: [
        { name: "Orgânico", value: 38 + Math.floor(Math.random() * 10), color: "#10B981" },
        { name: "Direto", value: 25 + Math.floor(Math.random() * 8), color: "#7C3AED" },
        { name: "Social", value: 20 + Math.floor(Math.random() * 8), color: "#EC4899" },
        { name: "Pago", value: 10 + Math.floor(Math.random() * 5), color: "#F59E0B" },
      ],
      dispositivos: [
        { name: "Mobile", value: 65 + Math.floor(Math.random() * 10) },
        { name: "Desktop", value: 28 + Math.floor(Math.random() * 8) },
        { name: "Tablet", value: 5 + Math.floor(Math.random() * 3) },
      ],
      topPaginas: [
        { url: "/", titulo: "Página Inicial", pageviews: 4200, taxaRejeicao: 22 },
        { url: "/servicos", titulo: "Serviços", pageviews: 2800, taxaRejeicao: 35 },
        { url: "/sobre", titulo: "Sobre Nós", pageviews: 1950, taxaRejeicao: 28 },
        { url: "/contato", titulo: "Contato", pageviews: 1420, taxaRejeicao: 18 },
        { url: "/blog", titulo: "Blog", pageviews: 1080, taxaRejeicao: 42 },
      ],
      funil: [
        { etapa: "Visitas", valor: Math.floor(4000 + Math.random() * 1500), cor: "#7C3AED" },
        { etapa: "Interesse", valor: Math.floor(1800 + Math.random() * 600), cor: "#3B82F6" },
        { etapa: "Leads", valor: Math.floor(150 + Math.random() * 80), cor: "#F59E0B" },
        { etapa: "Conversão", valor: Math.floor(40 + Math.random() * 25), cor: "#10B981" },
      ],
    },

    // Instagram
    instagram: {
      seguidores: Math.floor(5000 + Math.random() * 3000),
      seguidoresAnterior: Math.floor(4500 + Math.random() * 2500),
      alcance: Math.floor(25000 + Math.random() * 15000),
      alcanceAnterior: Math.floor(20000 + Math.random() * 10000),
      engajamento: 3.5 + Math.random() * 3,
      engajamentoAnterior: 3.0 + Math.random() * 2.5,
      storiesViews: Math.floor(8000 + Math.random() * 5000),
      posts: [
        { id: 1, title: "Promoção especial da semana", tipo: "Reels", curtidas: 892, comentarios: 67, alcance: 5420 },
        { id: 2, title: "Dica rápida do dia", tipo: "Carrossel", curtidas: 1456, comentarios: 98, alcance: 8900 },
        { id: 3, title: "Depoimento de cliente", tipo: "Reels", curtidas: 678, comentarios: 45, alcance: 3200 },
      ],
    },

    // TikTok
    tiktok: {
      seguidores: Math.floor(3000 + Math.random() * 2000),
      seguidoresAnterior: Math.floor(2500 + Math.random() * 1500),
      visualizacoes: Math.floor(50000 + Math.random() * 30000),
      visualizacoesAnterior: Math.floor(40000 + Math.random() * 20000),
      engajamento: 15 + Math.random() * 15,
      engajamentoAnterior: 12 + Math.random() * 12,
      curtidas: Math.floor(12000 + Math.random() * 8000),
      comentarios: Math.floor(1500 + Math.random() * 1000),
      shares: Math.floor(800 + Math.random() * 600),
      audienciaPorIdade: [
        { faixa: "18-24", percentual: 30 + Math.floor(Math.random() * 10) },
        { faixa: "25-34", percentual: 35 + Math.floor(Math.random() * 10) },
        { faixa: "35-44", percentual: 15 + Math.floor(Math.random() * 5) },
        { faixa: "45+", percentual: 8 + Math.floor(Math.random() * 5) },
      ],
    },

    // Google Maps
    google: {
      visualizacoes: Math.floor(6000 + Math.random() * 4000),
      visualizacoesAnterior: Math.floor(5000 + Math.random() * 3000),
      buscasNome: Math.floor(2000 + Math.random() * 1500),
      buscasCategoria: Math.floor(3500 + Math.random() * 2500),
      cliquesLigar: Math.floor(200 + Math.random() * 150),
      cliquesRotas: Math.floor(800 + Math.random() * 500),
      nota: 4.5 + Math.random() * 0.4,
      totalAvaliacoes: Math.floor(150 + Math.random() * 100),
      novasAvaliacoes: Math.floor(8 + Math.random() * 12),
      avaliacoesRecentes: [
        { autor: "Maria S.", nota: 5, texto: "Excelente atendimento! Super recomendo.", data: "2026-05-10" },
        { autor: "João P.", nota: 5, texto: "Muito profissional. Voltarei com certeza.", data: "2026-05-08" },
        { autor: "Ana C.", nota: 4, texto: "Bom atendimento, ambiente agradável.", data: "2026-05-05" },
        { autor: "Pedro L.", nota: 5, texto: "Melhor da região! Nota 10.", data: "2026-05-02" },
      ],
      evolucao: [
        { mes: "Jan", vistas: 3200 }, { mes: "Fev", vistas: 3800 },
        { mes: "Mar", vistas: 4200 }, { mes: "Abr", vistas: 5100 },
        { mes: "Mai", vistas: 5800 }, { mes: "Jun", vistas: 6500 },
      ],
    },
  };
}

// Gera dados para o gráfico de engajamento por hora
export function generateHourlyData() {
  return Array.from({ length: 24 }, (_, i) => ({
    hora: `${i.toString().padStart(2, "0")}h`,
    engajamento: Math.floor(10 + Math.random() * 90 * (i >= 8 && i <= 22 ? 1 : 0.3)),
  }));
}
