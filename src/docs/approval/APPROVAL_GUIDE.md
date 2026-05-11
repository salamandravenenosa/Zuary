# DentalMetrics — Documentação de Aprovação para Plataformas
# Guia completo para maximizar taxa de aprovação

## Visão Geral

O DentalMetrics é um SaaS B2B de dashboard de métricas de marketing digital para clínicas odontológicas. 
O sistema é usado por agências de marketing para mostrar resultados para seus clientes clínicas.

---

## 1. META PLATFORM REVIEW

### Tipo de App
- **Categoria**: Business > Marketing
- **Tipo**: Web App (server-side)
- **Público-alvo**: Agências de marketing odontológico e clínicas

### Permissões Solicitadas

| Permissão | Justificativa |
|-----------|---------------|
| `instagram_basic` | Ler dados básicos do perfil (seguidores, contagem de posts) para exibir no dashboard |
| `instagram_manage_insights` | Acessar insights/métricas de posts e stories para analytics |
| `pages_show_list` | Listar páginas do Facebook vinculadas ao Instagram Business |
| `pages_read_engagement` | Ler métricas de engajamento das páginas |
| `business_management` | Acessar informações do business account para vincular Instagram |

### Como Demonstrar ao Reviewer

1. **Fluxo de Login**: Mostrar login com credenciais de teste
2. **Conexão Instagram**: Clicar "Conectar" → redireciona para Facebook Login → autorizar → volta ao dashboard
3. **Dashboard**: Mostrar dados de métricas exibidos (seguidores, alcance, posts)
4. **Revogação**: Mostrar como desconectar a integração

### Texto para "How will your app use this data?"

```
DentalMetrics uses Instagram data to provide marketing analytics dashboards for dental clinics.
The app reads follower counts, post engagement metrics, and reach data to display consolidated
marketing performance reports. Data is stored encrypted (AES-256-GCM) and is only accessible
by the clinic that authorized the connection. No data is shared with third parties, used for
advertising, or used to contact users. The app does not publish content, send messages, or
perform any automated actions on Instagram accounts.
```

### Texto para "Why does your app need this data?"

```
Dental clinics and their marketing agencies need to see Instagram performance metrics in one
place alongside Google Analytics, Google Business Profile, and TikTok data. This helps them
understand which marketing efforts are working and make informed decisions about their
marketing budget allocation.
```

### Screencast Checklist

- [ ] Login com credenciais de teste
- [ ] Conectar Instagram via OAuth (mostrar tela de consentimento do Facebook)
- [ ] Dashboard com métricas do Instagram visíveis
- [ ] Mostrar que dados são read-only (nenhuma publicação)
- [ ] Desconectar integração (revogação)
- [ ] Mostrar página de Privacidade
- [ ] Mostrar página de Termos de Uso

### Conta de Teste para Reviewer

```
Email: reviewer@dentalmetrics.com.br
Senha: Reviewer2026!
Clínica: Clínica Sorriso (sandbox)
Instagram de teste: @clinicasorriso_test
```

---

## 2. GOOGLE API VERIFICATION

### APIs Habilitadas

| API | Escopo | Justificativa |
|-----|--------|---------------|
| Google Analytics Data API | `analytics.readonly` | Ler dados de relatórios GA4 |
| Google Business Profile API | `business.manage` | Acessar insights do perfil no Maps |

### OAuth Consent Screen

- **App Name**: DentalMetrics
- **User Support Email**: suporte@dentalmetrics.com.br
- **Developer Email**: contato@dentalmetrics.com.br
- **Scopes**: Analytics read-only, Business manage
- **Homepage**: https://dentalmetrics.com.br
- **Privacy Policy**: https://dentalmetrics.com.br/legal/privacy
- **Terms of Service**: https://dentalmetrics.com.br/legal/terms

### Texto para "Data Usage"

```
DentalMetrics accesses Google Analytics data solely to display marketing performance 
metrics to dental clinic owners and their marketing agencies. The app reads session counts, 
traffic sources, page views, and bounce rates. No user-level data is collected or stored. 
All data is encrypted at rest using AES-256-GCM. The app does not export, sell, or share 
data with third parties.
```

### Demonstração

1. Mostrar OAuth Consent Screen com escopos claros
2. Conectar GA4 → dados aparecem no dashboard
3. Mostrar que apenas dados agregados são exibidos
4. Mostrar página de exclusão de dados (LGPD)

---

## 3. TIKTOK DEVELOPER REVIEW

### APIs Solicitadas

| API | Escopo | Justificativa |
|-----|--------|---------------|
| TikTok Display API | `user.info.basic` | Ler informações básicas do perfil |
| TikTok Business API | `video.list` | Listar vídeos para métricas |

### Texto para App Review

```
DentalMetrics is a B2B analytics dashboard for dental clinics. We use the TikTok Display 
API to read basic profile information (follower count, video count) and video metrics 
(views, likes, comments) to display marketing performance data. The app is read-only — 
it does not post, edit, or delete any content. Data is encrypted and stored securely 
for display purposes only.
```

### Demonstração

1. Login → Dashboard → Conectar TikTok
2. Mostrar métricas de seguidores e vídeos
3. Mostrar que não há funcionalidade de publicação

---

## 4. LGPD COMPLIANCE

### Requisitos Atendidos

- [x] Política de Privacidade publicada e acessível
- [x] Termos de Uso publicados
- [x] Página de exclusão de dados
- [x] DPO (Encarregado) nomeado
- [x] Base legal para cada tratamento
- [x] Consentimento explícito para OAuth
- [x] Criptografia AES-256-GCM para tokens
- [x] Logs de auditoria
- [x] Isolamento multi-tenant
- [x] Direitos do titular (acesso, exclusão, portabilidade)

---

## 5. SECURITY CHECKLIST

- [x] Senhas hasheadas com bcrypt
- [x] Tokens encriptografados com AES-256-GCM
- [x] Rate limiting (Upstash Redis)
- [x] CSRF protection (NextAuth)
- [x] HTTPS obrigatório
- [x] Session expiration (24h)
- [x] RBAC por role
- [x] Isolamento multi-tenant por clinicId
- [x] Audit logs para ações sensíveis
- [x] Refresh token automático
- [x] Tokens expirados são revogados

---

## 6. WHAT TO NEVER DO

❌ Scraping de Instagram, TikTok ou qualquer plataforma
❌ Automação de publicação em redes sociais
❌ Manipulação de seguidores ou engajamento
❌ Coleta de senhas de usuários
❌ Armazenamento de tokens em texto plano
❌ Compartilhamento de dados com terceiros
❌ Uso de APIs não oficiais
❌ Violação de rate limits
❌ Falsificação de métricas
❌ Envio de spam

---

## 7. APP ICON & BRANDING

- **App Icon**: Logo DentalMetrics (512x512, fundo #7C3AED)
- **Screenshots**: Dashboard principal, conexão OAuth, relatório PDF
- **App Name**: DentalMetrics
- **Tagline**: "Dashboard de métricas para clínicas odontológicas"
