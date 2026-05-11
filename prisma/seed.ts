// Script para criar usuário de teste no banco
// Rode com: npx tsx prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres:Pontesdavii@db.pbiohkcbilotdxhiaxql.supabase.co:5432/postgres",
});

async function main() {
  console.log("Criando dados de teste...");

  // 1. Criar clínica de teste
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
  console.log("Clínica criada:", clinic.name);

  // 2. Criar usuário admin (agência)
  const adminPassword = await bcrypt.hash("Admin@2026", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dentalmetrics.com.br" },
    update: {},
    create: {
      email: "admin@dentalmetrics.com.br",
      name: "Admin DentalMetrics",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("Admin criado:", admin.email);

  // 3. Criar usuário dono da clínica
  const clinicPassword = await bcrypt.hash("Clinica@2026", 12);
  const clinicUser = await prisma.user.upsert({
    where: { email: "joao@clinicasorriso.com.br" },
    update: {},
    create: {
      email: "joao@clinicasorriso.com.br",
      name: "Dr. João Silva",
      passwordHash: clinicPassword,
      role: "CLINIC",
      clinicId: clinic.id,
      emailVerified: new Date(),
    },
  });
  console.log("Usuário clínica criado:", clinicUser.email);

  // 4. Criar usuário agência
  const agencyPassword = await bcrypt.hash("Agencia@2026", 12);
  const agencyUser = await prisma.user.upsert({
    where: { email: "maria@agenciadigital.com.br" },
    update: {},
    create: {
      email: "maria@agenciadigital.com.br",
      name: "Maria Marketing",
      passwordHash: agencyPassword,
      role: "AGENCY",
      clinicId: clinic.id,
      emailVerified: new Date(),
    },
  });
  console.log("Usuário agência criado:", agencyUser.email);

  // 5. Criar metas de teste
  const goals = [
    { metricType: "site_sessions", targetValue: 5000, currentValue: 4832 },
    { metricType: "leads", targetValue: 200, currentValue: 187 },
    { metricType: "instagram_followers", targetValue: 9000, currentValue: 8450 },
  ];

  for (const goal of goals) {
    await prisma.goal.upsert({
      where: {
        clinicId_metricType_month_year: {
          clinicId: clinic.id,
          metricType: goal.metricType,
          month: 4,
          year: 2026,
        },
      },
      update: {},
      create: {
        clinicId: clinic.id,
        metricType: goal.metricType,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        month: 4,
        year: 2026,
      },
    });
  }
  console.log("Metas criadas");

  console.log("\n========================================");
  console.log("USUÁRIOS CRIADOS COM SUCESSO!");
  console.log("========================================");
  console.log("\nAdmin (acesso total):");
  console.log("  Email: admin@dentalmetrics.com.br");
  console.log("  Senha: Admin@2026");
  console.log("\nClínica (dono da clínica):");
  console.log("  Email: joao@clinicasorriso.com.br");
  console.log("  Senha: Clinica@2026");
  console.log("\nAgência (funcionário):");
  console.log("  Email: maria@agenciadigital.com.br");
  console.log("  Senha: Agencia@2026");
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
