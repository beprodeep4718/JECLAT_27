"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { BeatProvider } from "./BeatProvider";
import { SmoothScrollProvider } from "./SmoothScroll";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <SmoothScrollProvider>
          <BeatProvider>{children}</BeatProvider>
        </SmoothScrollProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
