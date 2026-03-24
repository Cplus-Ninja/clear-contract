"use client";

import { type ReactNode } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";
import type { JargonGlossaryEntry } from "@/lib/types";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termPattern(term: string): RegExp {
  const t = term.trim();
  if (!t) return /$^/;
  return new RegExp(`\\b${escapeRegex(t)}\\b`, "i");
}

/**
 * Highlights glossary terms in plain text with “Jargon Buster” hover tooltips.
 */
export function JargonRichText({
  text,
  glossary,
  className,
}: {
  text: string;
  glossary?: JargonGlossaryEntry[];
  className?: string;
}) {
  if (!text) return null;

  if (!glossary?.length) {
    return <span className={className}>{text}</span>;
  }

  const sorted = [...glossary]
    .filter((g) => g.term?.trim())
    .sort((a, b) => b.term.length - a.term.length);

  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let bestIdx = -1;
    let bestMatch: RegExpMatchArray | null = null;
    let bestDef = "";

    for (const g of sorted) {
      const re = termPattern(g.term);
      const m = remaining.match(re);
      if (
        m &&
        m.index !== undefined &&
        (bestIdx === -1 || m.index < bestIdx)
      ) {
        bestIdx = m.index;
        bestMatch = m;
        bestDef = g.definition;
      }
    }

    if (bestIdx === -1 || !bestMatch) {
      parts.push(<span key={`t-${key++}`}>{remaining}</span>);
      break;
    }

    if (bestIdx > 0) {
      parts.push(<span key={`t-${key++}`}>{remaining.slice(0, bestIdx)}</span>);
    }

    const matchedText = bestMatch[0];
    parts.push(
      <Tooltip.Root key={`j-${key++}`}>
        <Tooltip.Trigger
          delay={180}
          closeOnClick={false}
          render={<span />}
          className={cn(
            "cursor-help border-b border-dotted border-muted-foreground/50 font-medium text-foreground underline-offset-2 transition-colors",
            "hover:border-emerald-600/60 hover:text-emerald-800 dark:hover:text-emerald-300"
          )}
        >
          {matchedText}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" align="center" sideOffset={6} className="z-100">
            <Tooltip.Popup
              className={cn(
                "max-w-xs rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg",
                "data-starting-style:opacity-0 data-ending-style:opacity-0",
                "data-starting-style:transition-opacity data-ending-style:transition-opacity"
              )}
            >
              <span className="block font-semibold text-foreground">
                {matchedText}
              </span>
              <span className="mt-1 block leading-snug text-muted-foreground">
                {bestDef}
              </span>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    );

    remaining = remaining.slice(bestIdx + matchedText.length);
  }

  return <span className={className}>{parts}</span>;
}
