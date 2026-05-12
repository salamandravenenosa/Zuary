// Schemas de validação Zod para todas as entidades
// Validação server-side em todas as rotas de API
import { z } from "zod";

// ==========================================
// SCHEMAS DE AUTENTICAÇÃO
// ==========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(128, "Senha muito longa"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  clinicName: z
    .string()
    .min(2, "Nome da empresa é obrigatório")
    .max(100),
});

// ==========================================
// SCHEMAS DE CLÍNICA
// ==========================================

export const clinicSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  cnpj: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val),
      "CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)"
    ),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve ser hexadecimal válido"),
});

// ==========================================
// SCHEMAS DE INTEGRAÇÃO
// ==========================================

export const integrationConnectSchema = z.object({
  type: z.enum([
    "INSTAGRAM",
    "TIKTOK",
    "GOOGLE_ANALYTICS",
    "GOOGLE_BUSINESS",
    "META_PIXEL",
    "WHATSAPP_BUSINESS",
  ]),
  clinicId: z.string().min(1),
});

export const metaPixelConfigSchema = z.object({
  pixelId: z
    .string()
    .min(1, "Pixel ID é obrigatório")
    .regex(/^\d+$/, "Pixel ID deve conter apenas números"),
});

export const whatsappConfigSchema = z.object({
  phoneNumberId: z.string().min(1),
  accessToken: z.string().min(1),
});

// ==========================================
// SCHEMAS DE MÉTRICAS E METAS
// ==========================================

export const goalSchema = z.object({
  clinicId: z.string().min(1),
  metricType: z.string().min(1),
  targetValue: z.number().positive("Meta deve ser maior que zero"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2030),
});

export const metricsQuerySchema = z.object({
  clinicId: z.string().min(1),
  source: z
    .enum([
      "INSTAGRAM",
      "TIKTOK",
      "GOOGLE_ANALYTICS",
      "GOOGLE_BUSINESS",
      "META_PIXEL",
      "WHATSAPP",
      "CONSOLIDATED",
    ])
    .optional(),
  period: z.enum(["7d", "30d", "90d"]).default("30d"),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// ==========================================
// SCHEMAS DE RELATÓRIO
// ==========================================

export const reportGenerateSchema = z.object({
  clinicId: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2030),
});

// ==========================================
// SCHEMAS DE WEBHOOK
// ==========================================

export const metaWebhookSchema = z.object({
  object: z.literal("page"),
  entry: z.array(
    z.object({
      id: z.string(),
      time: z.number(),
      changes: z.array(
        z.object({
          value: z.record(z.string(), z.any()),
          field: z.string(),
        })
      ),
    })
  ),
});

// ==========================================
// SCHEMAS DE RATE LIMIT
// ==========================================

export const rateLimitConfigSchema = z.object({
  windowMs: z.number().default(60 * 1000), // 1 minuto
  maxRequests: z.number().default(60),
  keyGenerator: z.function().optional(),
});
