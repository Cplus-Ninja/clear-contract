"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FileWarning,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Tooltip } from "@base-ui/react/tooltip";
import { ContractAnalysis } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateNegotiationEmail } from "@/app/actions/generate-negotiation-email";
import { JargonRichText } from "@/components/jargon-text";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import {
  analysisReportFilename,
  buildAnalysisReportText,
} from "@/lib/format-analysis-report";

interface ResultsProps {
  analysis: ContractAnalysis;
  fileName: string;
  demoMode?: boolean;
}

const riskColors = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  high: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  const label = `${level.charAt(0).toUpperCase()}${level.slice(1)} Risk`;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", riskColors[level])}>
      {label}
    </Badge>
  );
}

export function Results({ analysis, fileName, demoMode = false }: ResultsProps) {
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDemo = demoMode || analysis.demoMode === true;
  const glossary = analysis.jargonGlossary;
  const hiddenFees = analysis.hiddenFees ?? { found: false, items: [], summary: "" };
  const terminationClauses = analysis.terminationClauses ?? {
    found: false,
    items: [],
    summary: "",
  };
  const liabilityRisks = analysis.liabilityRisks ?? { found: false, items: [], summary: "" };

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  async function handleGenerateEmail() {
    setLoadingEmail(true);
    setEmailError(null);

    const result = await generateNegotiationEmail({ analysis, fileName });
    if (result.success) {
      setEmail(result.email);
    } else {
      setEmailError(result.error);
    }

    setLoadingEmail(false);
  }

  async function handleCopyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setEmailError("Could not copy to clipboard.");
    }
  }

  function handleDownloadReport() {
    const body = buildAnalysisReportText(fileName, analysis, { demoMode: isDemo });
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = analysisReportFilename(fileName);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Tooltip.Provider delay={400} closeDelay={100}>
      <Card className="min-w-0 overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-linear-to-r from-muted/30 to-muted/10 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <CardTitle className="flex min-w-0 flex-wrap items-center gap-2 text-base sm:text-lg">
              <Sparkles className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="min-w-0 break-words">Results: {fileName}</span>
              {isDemo && (
                <span
                  className="ml-0.5 rounded-md border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[10px] font-normal tracking-wide text-muted-foreground"
                  title="Sample analysis while API is unavailable or not configured"
                >
                  Demo mode
                </span>
              )}
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full shrink-0 gap-2 sm:w-auto"
              onClick={handleDownloadReport}
            >
              <Download className="size-4" />
              Download report
            </Button>
          </div>
          <CardDescription className="mt-3 text-pretty sm:mt-2">
            <JargonRichText text={analysis.overallSummary} glossary={glossary} />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-7">
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <AlertTriangle className="size-4 shrink-0 text-amber-500" />
              Hidden Costs
            </h3>
            {hiddenFees.found ? (
              <>
                {hiddenFees.items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-3 sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <p className="min-w-0 text-sm text-foreground">
                        <JargonRichText text={item.description} glossary={glossary} />
                      </p>
                      <RiskBadge level={item.riskLevel} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {item.location && (
                        <span>
                          Location:{" "}
                          <JargonRichText text={item.location} glossary={glossary} />
                        </span>
                      )}
                      {item.amount && (
                        <span>
                          Amount: <JargonRichText text={item.amount} glossary={glossary} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-sm italic text-muted-foreground">
                  <JargonRichText text={hiddenFees.summary} glossary={glossary} />
                </p>
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4 shrink-0" />
                No significant hidden costs identified.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <FileWarning className="size-4 shrink-0 text-emerald-500" />
              Termination Clauses
            </h3>
            {terminationClauses.found ? (
              <>
                {terminationClauses.items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      <RiskBadge level={item.riskLevel} />
                    </div>
                    <p className="text-sm text-foreground">
                      <JargonRichText text={item.description} glossary={glossary} />
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {item.noticePeriod && (
                        <span>
                          Notice:{" "}
                          <JargonRichText text={item.noticePeriod} glossary={glossary} />
                        </span>
                      )}
                      {item.penalties && (
                        <span>
                          Penalties:{" "}
                          <JargonRichText text={item.penalties} glossary={glossary} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-sm italic text-muted-foreground">
                  <JargonRichText text={terminationClauses.summary} glossary={glossary} />
                </p>
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4 shrink-0" />
                No concerning termination language identified.
              </p>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldAlert className="size-4 shrink-0 text-red-500" />
              Liability Risks
            </h3>
            {liabilityRisks.found ? (
              <>
                {liabilityRisks.items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-3 sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <p className="min-w-0 text-sm font-medium text-foreground">
                        <JargonRichText text={item.clause} glossary={glossary} />
                      </p>
                      <RiskBadge level={item.riskLevel} />
                    </div>
                    <p className="mt-2 text-sm text-foreground">
                      <JargonRichText text={item.description} glossary={glossary} />
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Impact:{" "}
                      <JargonRichText text={item.impact} glossary={glossary} />
                    </p>
                  </div>
                ))}
                <p className="text-sm italic text-muted-foreground">
                  <JargonRichText text={liabilityRisks.summary} glossary={glossary} />
                </p>
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4 shrink-0" />
                No major liability risks detected.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-foreground">Negotiate with confidence</h3>
              <Button onClick={handleGenerateEmail} disabled={loadingEmail}>
                {loadingEmail ? "Generating..." : "Generate Negotiation Email"}
              </Button>
            </div>

            {emailError && <p className="mt-3 text-sm text-destructive">{emailError}</p>}

            {email && (
              <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Draft email
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={handleCopyEmail}
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy to clipboard
                      </>
                    )}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                  <JargonRichText text={email} glossary={glossary} />
                </pre>
              </div>
            )}
          </section>

          <LegalDisclaimer variant="card" className="mt-2" />
        </CardContent>
      </Card>
    </Tooltip.Provider>
  );
}
