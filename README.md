# DentalMetrics — Dashboard de Métricas para Clínicas Odontológicas

Dashboard completo de métricas de sucesso para clientes de agência de marketing digital voltada para clínicas odontológicas. Mostra resultados de forma clara, bonita e em tempo real para que o cliente veja o valor do serviço contratado.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn/UI**
- **Recharts** (gráficos)
- **Framer Motion** (animações)
- **Prisma** + **PostgreSQL** (persistência)
- **NextAuth** (autenticação JWT)
- **Vercel** (deploy)

## Estrutura de Pastas

```
src/
├── app/
│   ├── admin/                    # Área da agência
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth
│   │   ├── integrations/         # OAuth flows
│   │   │   ├── instagram/        # Instagram OAuth
│   │   │   ├── google/           # Google OAuth
│   │   │   ├── meta-pixel/       # Webhook Meta Pixel
│   │   │   └── refresh/          # Refresh token automático
│   │   ├── metrics/              # Busca de métricas
│   │   └── reports/              # Geração de relatórios
│   ├── dashboard/
│   │   ├── page.tsx              # Visão geral (KPIs + gráfico)
│   │   ├── site/                 # Métricas do site
│   │   ├── social/               # Instagram + TikTok
│   │   ├── google/               # Google Maps + avaliações
│   │   └── relatorio/            # Gerador de PDF
│   ├── layout.tsx                # Layout raiz
│   └── globals.css               # Estilos globais
├── components/
│   ├── dashboard/                # Componentes de dashboard
│   │   ├── kpi-card.tsx          # Card com contador animado
│   │   ├── skeletons.tsx         # Loading states
│   │   ├── goal-banner.tsx       # Banner de meta atingida
│   │   └── integration-error.tsx # Card de erro
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx           # Sidebar colapsável
│   │   └── header.tsx            # Header com período
│   └── ui/                       # Shadcn/UI components
├── lib/
│   ├── utils.ts                  # Utilitários gerais
│   └── prisma.ts                 # Cliente Prisma
prisma/
└── schema.prisma                 # Schema do banco
```

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Preencha os valores no .env.local
```

### 3. Configurar banco de dados

```bash
# Crie um banco PostgreSQL (local ou Supabase/Neon)
npx prisma db push
npx prisma generate
```

### 4. Criar usuário admin

```bash
npx prisma studio
# Crie um usuário com role ADMIN e senha hasheada com bcrypt
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

## Funcionalidades

### Dashboard Principal (`/dashboard`)
- 4 KPIs com contador animado (sessões, leads, seguidores, nota Google)
- Badge de comparação com período anterior
- Gráfico de evolução dos últimos 30 dias
- Feed dos melhores posts do período
- Banner de meta atingida

### Site & Analytics (`/dashboard/site`)
- Funil de conversão visual (Visitas → Interesse → Lead → Agendamento)
- Origem do tráfego em gráfico de donut
- Top páginas visitadas
- Heatmap de horários de acesso
- Benchmark do setor odontológico

### Redes Sociais (`/dashboard/social`)
- Instagram e TikTok lado a lado
- KPIs de cada plataforma
- Tabela de posts com melhor performance
- Audiência por faixa etária (TikTok)
- Comparativo consolidado

### Google Maps (`/dashboard/google`)
- Visualizações do perfil
- Buscas por nome vs categoria
- Cliques (ligar, site, rotas)
- Avaliações recentes com texto
- Evolução de visualizações

### Relatórios (`/dashboard/relatorio`)
- Gerador de PDF com um clique
- Layout de marca branca
- Resumo executivo em linguagem simples
- Comparativo mês anterior

### Admin (`/admin`)
- Cadastro de clínicas
- Conexão de integrações via OAuth
- Definição de metas mensais por métrica
- Status de todas as integrações

## Integrações

### BLOCO 1 — Redes Sociais
- **Instagram**: Meta Graph API (OAuth) — seguidores, alcance, engajamento, stories
- **TikTok**: TikTok Display API — seguidores, visualizações, audiência por idade

### BLOCO 2 — Site
- **Google Analytics 4**: GA4 Data API — sessões, tráfego, páginas, dispositivos
- **Meta Pixel**: Conversions API server-side — PageView, ViewContent, Lead, Schedule

### BLOCO 3 — Google Meu Negócio
- **Google Business Profile API**: visualizações, ações, avaliações

### BLOCO 4 — WhatsApp
- **WhatsApp Business API**: mensagens recebidas, tempo de resposta

## Segurança

- Tokens OAuth armazenados encriptados no banco (não em .env)
- Rate limiting nas rotas de API
- Refresh token automático
- Logs de auditoria por cliente
- Multi-tenant: dados isolados por clinicId

## Deploy na Vercel

```bash
# Instale Vercel CLI
npm i -g vercel

# Configure as variáveis de ambiente no painel da Vercel
vercel

# Deploy em produção
vercel --prod
```

## Variáveis de Ambiente

Veja `.env.example` para a lista completa. As principais são:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `NEXTAUTH_SECRET` | Chave secreta JWT |
| `INSTAGRAM_APP_ID` | App ID do Meta |
| `INSTAGRAM_APP_SECRET` | App Secret do Meta |
| `GOOGLE_CLIENT_ID` | Client ID Google |
| `GOOGLE_CLIENT_SECRET` | Client Secret Google |
| `META_PIXEL_ID` | ID do Meta Pixel |
