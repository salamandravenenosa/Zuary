// Página de login — wrapper com Suspense para useSearchParams
"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginPageInner from "./login-inner";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageInner />
    </Suspense>
  );
}
