"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { BeatEngine } from "@/lib/beat-engine";
import { gsap } from "@/lib/gsap";

type BeatApi = {
  isOn: boolean;
  toggle: () => boolean;
  /** 0..1, updated every frame: punchy on kicks while playing, a slow breath otherwise */
  level: RefObject<number>;
};

const BeatContext = createContext<BeatApi | null>(null);

export function BeatProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<BeatEngine | null>(null);
  const level = useRef(0);
  const hitRef = useRef(0);
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const tick = (time: number, deltaMs: number) => {
      const dt = Math.min(0.05, deltaMs / 1000);
      const engine = engineRef.current;
      const hit = engine?.drain() ?? 0;
      if (hit) hitRef.current = Math.max(hitRef.current, hit);
      hitRef.current *= Math.exp(-dt * 6.5);
      const breath = engine?.on ? 0 : 0.18 * Math.pow(0.5 + 0.5 * Math.sin(time * Math.PI * (88 / 60)), 6);
      level.current = Math.max(hitRef.current, breath);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    engineRef.current ??= new BeatEngine();
    const on = engineRef.current.toggle();
    setIsOn(on);
    return on;
  }, []);

  const api = useMemo(() => ({ isOn, toggle, level }), [isOn, toggle]);
  return <BeatContext.Provider value={api}>{children}</BeatContext.Provider>;
}

export function useBeat() {
  const ctx = useContext(BeatContext);
  if (!ctx) throw new Error("useBeat must be used inside <BeatProvider>");
  return ctx;
}
