// Configuração do NextAuth v5 — com debug
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Log de debug para verificar variáveis
console.log("[AUTH] GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING");
console.log("[AUTH] GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING");
console.log("[AUTH] DISCORD_CLIENT_ID:", process.env.DISCORD_CLIENT_ID ? "SET" : "MISSING");
console.log("[AUTH] DISCORD_CLIENT_SECRET:", process.env.DISCORD_CLIENT_SECRET ? "SET" : "MISSING");

const authConfig = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.active) return null;
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!isPasswordValid) return null;
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {});
        return { id: user.id, email: user.email, name: user.name, role: user.role, clinicId: user.clinicId };
      },
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const email = user.email;
        if (email) {
          let dbUser = await prisma.user.findUnique({ where: { email } });
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: { email, name: user.name || user.email?.split("@")[0] || "Usuário", passwordHash: "", role: "CLINIC", emailVerified: new Date(), avatarUrl: user.image || null },
            });
            const clinic = await prisma.clinic.create({ data: { name: user.name || "Meu Negócio", slug: `negocio-${Date.now().toString(36)}`, primaryColor: "#7C3AED" } });
            await prisma.user.update({ where: { id: dbUser.id }, data: { clinicId: clinic.id } });
            dbUser.clinicId = clinic.id;
          }
          token.role = dbUser.role;
          token.clinicId = dbUser.clinicId;
          token.userId = dbUser.id;
        }
      } else if (user) {
        token.role = (user as any).role;
        token.clinicId = (user as any).clinicId;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).clinicId = token.clinicId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = authConfig;
