"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContractAnalysis } from "@/lib/types";
import { AlertTriangle, FileWarning, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractAnalysisCardProps {
  analysis: ContractAnalysis;
  fileName: string;
}

const riskColors = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function ContractAnalysisCard({ analysis, fileName }: ContractAnalysisCardProps) {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="border-b border-border/40 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileWarning className="size-5 text-emerald-600 dark:text-emerald-400" />
          Analysis: {fileName}
        </CardTitle>
        <CardDescription>{analysis.overallSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Hidden Fees */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="size-4 text-amber-500" />
            Hidden Fees
          </h3>
          {analysis.hiddenFees.found ? (
            <div className="space-y-3">
              {analysis.hiddenFees.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-card p-3"
                >
                  <p className="text-sm text-foreground">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.location && (
                      <span className="text-xs text-muted-foreground">Location: {item.location}</span>
                    )}
                    {item.amount && (
                      <span className="text-xs text-muted-foreground">Amount: {item.amount}</span>
                    )}
                    <Badge
                      variant="outline"
                      className={cn("text-xs", riskColors[item.riskLevel])}
                    >
                      {item.riskLevel} risk
                    </Badge>
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground italic">
                {analysis.hiddenFees.summary}
              </p>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              No significant hidden fees identified.
            </p>
          )}
        </section>

        {/* Termination Clauses */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <FileWarning className="size-4 text-emerald-500" />
            Termination Clauses
          </h3>
          {analysis.terminationClauses.found ? (
            <div className="space-y-3">
              {analysis.terminationClauses.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 bg-card p-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", riskColors[item.riskLevel])}
                    >
                      {item.riskLevel} risk
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.noticePeriod && <span>Notice: {item.noticePeriod}</span>}
                    {item.penalties && <span>Penalties: {item.penalties}</span>}
                  </div>
                </div>
              ))}
              <p className="text-sm text-muted-foreground italic">
                {analysis.terminationClauses.summary}
              </p>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              No explicit termination clauses identified.
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
