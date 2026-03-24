"use client";

import { useEffect, useState } from "react";
import { ScanLine } from "lucide-react";

export function ScanningOverlay() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card/95 backdrop-blur-sm">
      <div className="relative mb-6 flex size-24 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500/10 ring-2 ring-emerald-500/20">
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-scan-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
        <ScanLine className="relative size-10 text-emerald-600 dark:text-emerald-400 animate-scan-pulse" />
      </div>
      <p className="font-semibold text-foreground">AI Scanning Contract{dots}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Analyzing hidden fees & termination clauses
      </p>
      <div className="mt-4 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 animate-pulse rounded-full bg-emerald-500"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
