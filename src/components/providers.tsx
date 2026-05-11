// Provider de sessão NextAuth — wrapper client-side
"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Refetch a cada 5 minutos
      refetchInterval={5 * 60}
      // Refetch quando janela ganha foco
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
