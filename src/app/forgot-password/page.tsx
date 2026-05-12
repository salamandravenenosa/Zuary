// Página "Esqueci a senha" — wrapper com Suspense
"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ForgotPasswordInner from "./forgot-inner";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
      </div>
    }>
      <ForgotPasswordInner />
    </Suspense>
  );
}
