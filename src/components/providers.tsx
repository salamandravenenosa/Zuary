// Provider de tema (dark/light) + sessão
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
