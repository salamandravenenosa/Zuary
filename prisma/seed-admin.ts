// Script para criar usuário admin diasmkt
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:Pontesdavii@db.pbiohkcbilotdxhiaxql.supabase.co:5432/postgres",
});

async function main() {
  // Criar clínica de teste se não existir
  const clinic = await prisma.clinic.upsert({
    where: { slug: "clinica-sorriso" },
    update: {},
    create: {
      name: "Clínica Sorriso Odontologia",
      slug: "clinica-sorriso",
      primaryColor: "#7C3AED",
      phone: "(11) 99999-9999",
      email: "contato@clinicasorriso.com.br",
      city: "São Paulo",
      state: "SP",
      websiteUrl: "https://clinicasorriso.com.br",
      plan: "PRO",
    },
  });

  // Criar admin diasmkt
  const password = await bcrypt.hash("@1Pontesdavi", 12);
  const admin = await prisma.user.upsert({
    where: { email: "diaspessoalmkt@gmail.com" },
    update: {
      passwordHash: password,
      name: "Dias MKT",
      role: "ADMIN",
      active: true,
    },
    create: {
      email: "diaspessoalmkt@gmail.com",
      name: "Dias MKT",
      passwordHash: password,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Criar os outros usuários de teste
  const adminPW = await bcrypt.hash("Admin@2026", 12);
  await prisma.user.upsert({
    where: { email: "admin@dentalmetrics.com.br" },
    update: {},
    create: {
      email: "admin@dentalmetrics.com.br",
      name: "Admin DentalMetrics",
      passwordHash: adminPW,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const clinicPW = await bcrypt.hash("Clinica@2026", 12);
  await prisma.user.upsert({
    where: { email: "joao@clinicasorriso.com.br" },
    update: {},
    create: {
      email: "joao@clinicasorriso.com.br",
      name: "Dr. João Silva",
      passwordHash: clinicPW,
      role: "CLINIC",
      clinicId: clinic.id,
      emailVerified: new Date(),
    },
  });

  const agencyPW = await bcrypt.hash("Agencia@2026", 12);
  await prisma.user.upsert({
    where: { email: "maria@agenciadigital.com.br" },
    update: {},
    create: {
      email: "maria@agenciadigital.com.br",
      name: "Maria Marketing",
      passwordHash: agencyPW,
      role: "AGENCY",
      clinicId: clinic.id,
      emailVerified: new Date(),
    },
  });

  // Metas de teste
  const goals = [
    { metricType: "site_sessions", targetValue: 5000, currentValue: 4832 },
    { metricType: "leads", targetValue: 200, currentValue: 187 },
    { metricType: "instagram_followers", targetValue: 9000, currentValue: 8450 },
  ];
  for (const g of goals) {
    await prisma.goal.upsert({
      where: { clinicId_metricType_month_year: { clinicId: clinic.id, metricType: g.metricType, month: 4, year: 2026 } },
      update: {},
      create: { clinicId: clinic.id, metricType: g.metricType, targetValue: g.targetValue, currentValue: g.currentValue, month: 4, year: 2026 },
    });
  }

  console.log("✅ Admin diasmkt criado:");
  console.log("   Email: diaspessoalmkt@gmail.com");
  console.log("   Senha: @1Pontesdavi");
  console.log("   Role: ADMIN");
  console.log("   ID:", admin.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
