export interface ContractAnalysis {
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
  overallSummary: string;
}
