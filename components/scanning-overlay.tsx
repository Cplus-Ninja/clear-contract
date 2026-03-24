"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function ScanningOverlay() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-card/95 px-4 py-8 backdrop-blur-sm">
      <div className="relative mb-5 flex size-20 items-center justify-center rounded-2xl bg-emerald-500/10 ring-2 ring-emerald-500/25">
        <Loader2
          className="size-10 animate-spin text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
      </div>
      <p className="text-center font-semibold text-foreground">
        AI is thinking{dots}
      </p>
      <p className="mt-1 max-w-[280px] text-center text-sm text-muted-foreground">
        Reviewing your contract—this can take up to a minute for large files.
      </p>
      {/* Indeterminate progress bar */}
      <div
        className="mt-5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuetext="Analysis in progress"
        aria-busy="true"
      >
        <div className="animate-analysis-progress h-full w-1/2 rounded-full bg-emerald-500" />
      </div>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 animate-pulse rounded-full bg-emerald-500/80"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
