# Handoff: Frontend — Zuary Dashboard

## Status Atual
- **Deploy**: https://zuary.vercel.app (Vercel, branch main)
- **Repo**: https://github.com/salamandravenenosa/Zuary
- **Stack**: Next.js 14 App Router, TypeScript, Tailwind, Shadcn/UI, Framer Motion, Recharts
- **Auth**: NextAuth v5 (credentials + Google + Discord)
- **Banco**: Supabase PostgreSQL + Prisma ORM
- **Email**: Resend (configurado)

## O que funciona
- Login (email/senha, Google, Discord)
- Dashboard com dados reais do banco
- Integrações OAuth (Instagram, Google, TikTok — flows funcionais)
- Tema dark/light (toggle no header)
- Mobile responsivo (sidebar hamburger)
- Perfil do usuário + logout
- Onboarding + cadastro de empresa
- Páginas legais (LGPD)
- Cron job de coleta de dados

## O que falta (Frontend)

### 1. Dashboard Social — dados reais
- Página `/dashboard/social` usa dados mockados
- Precisa buscar da API `/api/dashboard` e mostrar Instagram + TikTok reais
- Quando não tem integração: estado vazio com botão conectar

### 2. Dashboard Site — dados reais
- Página `/dashboard/site` usa dados fake
- Precisa buscar dados do GA4 via API
- Mostrar funil de conversão real

### 3. Dashboard Google — dados reais
- Página `/dashboard/google` usa dados fake
- Precisa mostrar avaliações reais do Google Maps

### 4. Relatório PDF
- Página `/dashboard/relatorio` gera PDF fake
- Implementar com react-pdf ou Puppeteer
- PDF deve ter layout profissional com dados reais

### 5. Admin page
- `/admin` está funcional mas precisa polir
- Mostrar lista real de empresas/usuários
- Gerenciar metas mensais

### 6. Design Polish
- Cards podem estar com padding inconsistente
- Animações podem estar lentas no mobile
- Verificar contraste no tema light
- Estados de hover inconsistentes

## Estrutura de pastas importante
```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          ← Dashboard principal (dados reais ✅)
│   │   ├── integrations/     ← Integrações (funcional ✅)
│   │   ├── social/           ← Instagram + TikTok (DADOS FAKE ❌)
│   │   ├── site/             ← GA4 analytics (DADOS FAKE ❌)
│   │   ├── google/           ← Google Maps (DADOS FAKE ❌)
│   │   ├── relatorio/        ← PDF (FAKE ❌)
│   │   ├── profile/          ← Perfil (funcional ✅)
│   │   ├── settings/         ← Config (funcional ✅)
│   │   └── security/         ← Segurança (funcional ✅)
│   ├── api/
│   │   ├── dashboard/        ← API dados reais
│   │   ├── integrations/     ← OAuth flows
│   │   ├── cron/collect/     ← Coleta automática
│   │   └── business/         ← Criar empresa
│   ├── login/                ← Login (funcional ✅)
│   ├── onboarding/           ← Onboarding (funcional ✅)
│   └── legal/                ← Páginas legais (funcional ✅)
├── components/
│   ├── dashboard/            ← KPI cards, skeletons, empty states
│   ├── layout/               ← Sidebar, Header
│   └── ui/                   ← Shadcn components
├── lib/
│   ├── prisma.ts             ← Cliente Prisma
│   ├── auth-helpers.ts       ← Auth helpers
│   ├── email.ts              ← Resend email
│   └── fake-data.ts          ← Dados fake (REMOVER quando dados reais)
└── services/
    ├── oauth-token.ts        ← Gerenciamento de tokens
    ├── collect-instagram.ts  ← Coleta Instagram
    ├── collect-ga4.ts        ← Coleta GA4
    └── collect-tiktok.ts     ← Coleta TikTok
```

## API Disponível
- `GET /api/dashboard` — dados reais (sessions, metrics, goals)
- `GET /api/integrations/status` — status das integrações
- `POST /api/integrations/disconnect` — desconectar integração
- `POST /api/business` — criar empresa
- `GET /api/debug` — debug (remover em produção)

## Variáveis de ambiente (Vercel)
Todas configuradas: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_*, INSTAGRAM_*, TIKTOK_*, RESEND_*, UPSTASH_*

## Estilo
- Dark: #0A0A0F bg, #111118 cards, #7C3AED accent
- Light: #FAFAFA bg, #FFFFFF cards
- Fonte: Inter
- Border radius: 0.75rem
- Glassmorphism sutil nos cards
- Animações Framer Motion com stagger

## Prioridades
1. **ALTA**: Social + Site pages com dados reais
2. **ALTA**: Relatório PDF funcional
3. **MÉDIA**: Admin page polida
4. **BAIXA**: Design polish

## Comandos úteis
```bash
npm run dev          # Roda local
npm run build        # Build de produção
npx tsc --noEmit     # Verifica TypeScript
```

## Contato
- Usuário: diasmktt (GitHub)
- Email: diaspessoalmkt@gmail.com
- Discord: diasmktt
