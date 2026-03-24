"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContractAnalysis } from "@/lib/types";
import OpenAI from "openai";

const ANALYSIS_PROMPT = `You are a contract analyst. Analyze the following contract document for:
1. HIDDEN FEES - any fees, charges, or costs that may not be immediately obvious (subscription fees, early termination fees, auto-renewal charges, processing fees, etc.)
2. TERMINATION CLAUSES - conditions for ending the agreement, notice periods, penalties for early termination, auto-renewal terms
3. LIABILITY RISKS - indemnification obligations, limitation of liability carve-outs, broad warranties, uncapped damages, one-sided risk transfer

Respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "hiddenFees": {
    "found": true/false,
    "items": [
      {
        "description": "brief description of the fee",
        "location": "section or page reference",
        "amount": "if specified",
        "riskLevel": "low" | "medium" | "high"
      }
    ],
    "summary": "one sentence summary"
  },
  "terminationClauses": {
    "found": true/false,
    "items": [
      {
        "type": "e.g. early termination, cancellation",
        "description": "brief description",
        "noticePeriod": "if specified",
        "penalties": "if any",
        "riskLevel": "low" | "medium" | "high"
      }
    ],
    "summary": "one sentence summary"
  },
  "liabilityRisks": {
    "found": true/false,
    "items": [
      {
        "clause": "name of the liability-related clause",
        "description": "brief description",
        "impact": "how this could harm the buyer",
        "riskLevel": "low" | "medium" | "high"
      }
    ],
    "summary": "one sentence summary"
  },
  "overallSummary": "2-3 sentence overall assessment"
}

If nothing is found in a category, use found: false and empty items array.`;

function parseAnalysisResponse(text: string): ContractAnalysis {
  // Remove markdown code blocks if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as ContractAnalysis;

  // Validate structure
  if (!parsed.hiddenFees || !parsed.terminationClauses) {
    throw new Error("Invalid analysis format");
  }

  return {
    hiddenFees: {
      found: parsed.hiddenFees.found ?? false,
      items: parsed.hiddenFees.items ?? [],
      summary: parsed.hiddenFees.summary ?? "",
    },
    terminationClauses: {
      found: parsed.terminationClauses.found ?? false,
      items: parsed.terminationClauses.items ?? [],
      summary: parsed.terminationClauses.summary ?? "",
    },
    liabilityRisks: {
      found: parsed.liabilityRisks?.found ?? false,
      items: parsed.liabilityRisks?.items ?? [],
      summary: parsed.liabilityRisks?.summary ?? "",
    },
    overallSummary: parsed.overallSummary ?? "",
  };
}

/** Sample analysis for Commercial Lease Agreement — used in Demo Mode (no API key or API failure). */
function getMockCommercialLeaseAnalysis(): ContractAnalysis {
  return {
    hiddenFees: {
      found: true,
      items: [
        {
          description:
            "Base rent increases by 10% automatically on each anniversary of the commencement date, without reference to CPI, fair market rent, or a negotiated cap.",
          location: "Article IV — Rent; Section 4.2 (Annual Adjustment)",
          amount: "10% per year, compounding",
          riskLevel: "high",
        },
      ],
      summary:
        "Fixed-percentage annual escalators can outpace market rent and operating budgets over a multi-year term.",
    },
    terminationClauses: {
      found: true,
      items: [
        {
          type: "Early termination / liquidated damages",
          description:
            "Tenant may not terminate for convenience. If the tenant vacates or defaults, landlord may accelerate and collect the entire unpaid base rent and additional rent for the remainder of the term as liquidated damages, without obligation to mitigate by re-letting.",
          noticePeriod: "N/A for voluntary early exit",
          penalties: "Full remaining rent through expiration",
          riskLevel: "high",
        },
      ],
      summary:
        "Exit flexibility is minimal; financial exposure on early departure is severe compared to typical commercial leases.",
    },
    liabilityRisks: {
      found: true,
      items: [
        {
          clause: "Operating expenses & CAM reconciliation",
          description:
            "Tenant pays a proportionate share of building operating costs, taxes, insurance, and capital expenditures. Annual reconciliation statements are final unless tenant objects within 30 days; audit rights are limited to once per year and exclude capital project allocations above a threshold.",
          impact:
            "Limited visibility and short dispute windows can allow pass-through charges to grow without adequate challenge.",
          riskLevel: "medium",
        },
      ],
      summary:
        "Pass-through expense mechanics favor the landlord; tenants should negotiate caps, audit rights, and exclusion of capital items.",
    },
    overallSummary:
      "This demo reflects a stringent Commercial Lease Agreement: aggressive fixed rent escalations, weak early-termination protections, and landlord-friendly operating-expense pass-throughs. These are illustrative findings for judges when live AI analysis is unavailable.",
  };
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function analyzeWithOpenAI(
  openai: OpenAI,
  buffer: Buffer,
  type: string
): Promise<ContractAnalysis | null> {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

  try {
    if (type === "application/pdf") {
      const text = await extractTextFromPdf(buffer);
      if (!text.trim()) {
        return null;
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          {
            role: "user",
            content: `Analyze this contract:\n\n${text.slice(0, 120000)}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) return null;
      return parseAnalysisResponse(content);
    }

    if (imageTypes.includes(type)) {
      const base64 = buffer.toString("base64");
      const mimeType = type === "image/jpg" ? "image/jpeg" : type;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this contract image for hidden fees, termination clauses, and liability risks. Respond with ONLY the JSON object as specified.",
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) return null;
      return parseAnalysisResponse(content);
    }

    return null;
  } catch (err) {
    console.error("OpenAI analysis failed (demo fallback):", err);
    return null;
  }
}

export async function analyzeContract(
  formData: FormData
): Promise<
  | { success: true; contractId: string; demoMode: boolean }
  | { success: false; error: string }
> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return { success: false, error: "Setup needed" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = file.type.toLowerCase();
    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
    ];

    if (!supportedTypes.includes(type)) {
      return {
        success: false,
        error: "Unsupported file type. Use PDF or image (PNG, JPEG, WebP).",
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    let analysis: ContractAnalysis;
    let demoMode = false;

    if (apiKey) {
      const openai = new OpenAI({ apiKey });
      const aiResult = await analyzeWithOpenAI(openai, buffer, type);
      if (aiResult) {
        analysis = aiResult;
      } else {
        analysis = getMockCommercialLeaseAnalysis();
        demoMode = true;
      }
    } else {
      analysis = getMockCommercialLeaseAnalysis();
      demoMode = true;
    }

    const analysisForDb = {
      ...analysis,
      ...(demoMode ? { demoMode: true } : {}),
    } as unknown as Record<string, unknown>;

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage
      .from("contracts")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { success: false, error: "Failed to store file" };
    }

    const { data: urlData } = supabase.storage
      .from("contracts")
      .getPublicUrl(fileName);
    const fileUrl = urlData.publicUrl;

    // Save to database
    const { data: contract, error: dbError } = await supabase
      .from("contracts")
      .insert({
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type,
        analysis: analysisForDb,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return { success: false, error: "Failed to save analysis" };
    }

    return { success: true, contractId: contract.id, demoMode };
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return { success: false, error: message };
  }
}
