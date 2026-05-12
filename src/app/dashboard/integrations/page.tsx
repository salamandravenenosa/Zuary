// Wrapper com Suspense para useSearchParams
"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import IntegrationsInner from "./integrations-inner";

export default function IntegrationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
      </div>
    }>
      <IntegrationsInner />
    </Suspense>
  );
}
