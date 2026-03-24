export interface ContractAnalysis {
  /** Set when analysis is mock/sample data (demo without OpenAI). */
  demoMode?: boolean;
  hiddenFees: {
    found: boolean;
    items: Array<{
      description: string;
      location: string;
      amount?: string;
      riskLevel: "low" | "medium" | "high";
    }>;
    summary: string;
  };
  terminationClauses: {
    found: boolean;
    items: Array<{
      type: string;
      description: string;
      noticePeriod?: string;
      penalties?: string;
      riskLevel: "low" | "medium" | "high";
    }>;
    summary: string;
  };
  liabilityRisks: {
    found: boolean;
    items: Array<{
      clause: string;
      description: string;
      impact: string;
      riskLevel: "low" | "medium" | "high";
    }>;
    summary: string;
  };
  overallSummary: string;
}
