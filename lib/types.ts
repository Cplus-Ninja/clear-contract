/** Terms the AI flags for plain-language “Jargon Buster” tooltips in the UI. */
export interface JargonGlossaryEntry {
  term: string;
  definition: string;
}

export interface ContractAnalysis {
  /** Set when analysis is mock/sample data (demo without OpenAI). */
  demoMode?: boolean;
  /** Complex legal terms with short definitions for hover tooltips. */
  jargonGlossary?: JargonGlossaryEntry[];
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
