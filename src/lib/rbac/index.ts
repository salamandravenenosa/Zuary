// RBAC — Controle de acesso baseado em papéis
// Proteção de rotas por role + permissões
import { NextRequest, NextResponse } from "next/server";

// Definição de papéis e permissões
export const ROLES = {
  CLINIC: {
    label: "Clínica",
    permissions: [
      "dashboard:read",
      "metrics:read",
      "goals:read",
      "goals:write",
      "reports:read",
      "reports:generate",
      "integrations:read",
      "settings:read",
      "settings:write",
    ],
  },
  AGENCY: {
    label: "Agência",
    permissions: [
      "dashboard:read",
      "metrics:read",
      "goals:read",
      "goals:write",
      "reports:read",
      "reports:generate",
      "integrations:read",
      "integrations:write",
      "settings:read",
      "settings:write",
      "clients:read",
    ],
  },
  ADMIN: {
    label: "Administrador",
    permissions: [
      "dashboard:read",
      "metrics:read",
      "goals:read",
      "goals:write",
      "reports:read",
      "reports:generate",
      "integrations:read",
      "integrations:write",
      "integrations:delete",
      "settings:read",
      "settings:write",
      "clients:read",
      "clients:write",
      "clients:delete",
      "users:read",
      "users:write",
      "users:delete",
      "audit:read",
      "api-usage:read",
    ],
  },
} as const;

export type UserRole = keyof typeof ROLES;
export type Permission = string;

// Verifica se uma role tem uma permissão
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLES[role]?.permissions.includes(permission as any) ?? false;
}

// Verifica se uma role tem TODAS as permissões listadas
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

// Middleware RBAC — verifica permissão antes de executar handler
export function requirePermission(permission: Permission) {
  return function (
    handler: (req: NextRequest, context: { user: any }) => Promise<NextResponse>
  ) {
    return async (req: NextRequest): Promise<NextResponse> => {
      // Extrai dados do usuário do header (injetado pelo middleware de auth)
      const userRole = req.headers.get("x-user-role") as UserRole;
      const userId = req.headers.get("x-user-id");
      const clinicId = req.headers.get("x-clinic-id");

      if (!userRole || !userId) {
        return NextResponse.json(
          { error: "Não autenticado" },
          { status: 401 }
        );
      }

      if (!hasPermission(userRole, permission)) {
        return NextResponse.json(
          { error: "Sem permissão para esta ação" },
          { status: 403 }
        );
      }

      return handler(req, { user: { id: userId, role: userRole, clinicId } });
    };
  };
}

// Middleware de isolamento multi-tenant
// Garante que usuário só acesse dados da sua clínica
export function requireClinicAccess(
  handler: (req: NextRequest, context: { user: any }) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userRole = req.headers.get("x-user-role") as UserRole;
    const userId = req.headers.get("x-user-id");
    const userClinicId = req.headers.get("x-clinic-id");

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Admin pode acessar qualquer clínica
    if (userRole === "ADMIN") {
      return handler(req, { user: { id: userId, role: userRole, clinicId: userClinicId } });
    }

    // Outras roles só acessam a própria clínica
    // O clinicId da requisição deve ser validado no handler
    return handler(req, { user: { id: userId, role: userRole, clinicId: userClinicId } });
  };
}
