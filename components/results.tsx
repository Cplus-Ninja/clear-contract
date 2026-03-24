"use client";

import { useState } from "react";
import { AlertTriangle, FileWarning, ShieldAlert, Sparkles, Info } from "lucide-react";
import { ContractAnalysis } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateNegotiationEmail } from "@/app/actions/generate-negotiation-email";

interface ResultsProps {
  analysis: ContractAnalysis;
  fileName: string;
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

export function Results({ analysis, fileName }: ResultsProps) {
  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const hiddenFees = analysis.hiddenFees ?? { found: false, items: [], summary: "" };
  const terminationClauses = analysis.terminationClauses ?? {
    found: false,
    items: [],
    summary: "",
  };
  const liabilityRisks = analysis.liabilityRisks ?? { found: false, items: [], summary: "" };

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

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/40 bg-gradient-to-r from-muted/30 to-muted/10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
          Results: {fileName}
        </CardTitle>
        <CardDescription>{analysis.overallSummary}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-7 pt-6">
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="size-4 text-amber-500" />
            Hidden Costs
          </h3>
          {hiddenFees.found ? (
            <>
              {hiddenFees.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground">{item.description}</p>
                    <RiskBadge level={item.riskLevel} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.location && <span>Location: {item.location}</span>}
                    {item.amount && <span>Amount: {item.amount}</span>}
                  </div>
                </div>
              ))}
              <p className="text-sm italic text-muted-foreground">{hiddenFees.summary}</p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              No significant hidden costs identified.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <FileWarning className="size-4 text-emerald-500" />
            Termination Clauses
          </h3>
          {terminationClauses.found ? (
            <>
              {terminationClauses.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                    <RiskBadge level={item.riskLevel} />
                  </div>
                  <p className="text-sm text-foreground">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {item.noticePeriod && <span>Notice: {item.noticePeriod}</span>}
                    {item.penalties && <span>Penalties: {item.penalties}</span>}
                  </div>
                </div>
              ))}
              <p className="text-sm italic text-muted-foreground">
                {terminationClauses.summary}
              </p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              No concerning termination language identified.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldAlert className="size-4 text-red-500" />
            Liability Risks
          </h3>
          {liabilityRisks.found ? (
            <>
              {liabilityRisks.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{item.clause}</p>
                    <RiskBadge level={item.riskLevel} />
                  </div>
                  <p className="mt-2 text-sm text-foreground">{item.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Impact: {item.impact}</p>
                </div>
              ))}
              <p className="text-sm italic text-muted-foreground">
                {liabilityRisks.summary}
              </p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              No major liability risks detected.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground">Negotiate with confidence</h3>
            <Button onClick={handleGenerateEmail} disabled={loadingEmail}>
              {loadingEmail ? "Generating..." : "Generate Negotiation Email"}
            </Button>
          </div>

          {emailError && <p className="mt-3 text-sm text-destructive">{emailError}</p>}

          {email && (
            <div className="mt-4 rounded-lg border border-border/60 bg-background/80 p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Draft Email</p>
              <pre className="whitespace-pre-wrap text-sm text-foreground">{email}</pre>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
