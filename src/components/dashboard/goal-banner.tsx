// Banner de destaque quando meta é atingida
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, PartyPopper } from "lucide-react";

interface GoalBannerProps {
  title: string;
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}

export function GoalBanner({ title, message, visible, onDismiss }: GoalBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="relative rounded-xl border border-[#10B981]/20 bg-[#10B981]/[0.05] p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#10B981]/15 flex items-center justify-center">
                <PartyPopper className="h-5 w-5 text-[#10B981]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#10B981]">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
