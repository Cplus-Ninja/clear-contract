"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContractAnalysis } from "@/lib/types";
import OpenAI from "openai";
// pdf-parse v1 bundles a legacy PDF.js build — avoids pdfjs-dist + DOMMatrix on the server (see v2 / canvas path)
import pdfParse from "pdf-parse";

const CONTRACT_TYPES = [
  "general",
  "commercial_lease",
  "service_agreement",
  "nda",
  "other",
] as const;

function getContractType(formData: FormData): string {
  const raw = formData.get("contract_type");
  if (typeof raw === "string" && raw.trim()) {
    const t = raw.trim();
    if ((CONTRACT_TYPES as readonly string[]).includes(t)) return t;
  }
  return "general";
}

const ANALYSIS_PROMPT = `You are a Friendly but Expert Small Business Legal Auditor. Your job is to help non-lawyers understand contract risk in plain language—warm, clear, and practical, never alarmist without cause.

Scope and context:
- Prioritize issues that matter to US small businesses (payment terms, renewals, liability caps, indemnities, termination, warranties, dispute resolution, governing law).
- When the document mentions Missouri, Springfield, Greene County, or Missouri-specific statutes or courts, note that local context briefly in overallSummary or relevant item descriptions. If there is no local tie, do not invent one—stick to what the contract says and general US small-business norms.

Analyze for:
1. HIDDEN FEES — costs that are easy to miss (renewals, termination fees, price escalations, pass-throughs, minimums, etc.)
2. TERMINATION CLAUSES — how the deal ends, notice, penalties, auto-renewal
3. LIABILITY RISKS — indemnity, liability caps/carve-outs, warranties, one-sided risk

Output rules (critical — the UI parses this with JSON.parse):
- Respond with ONE JSON object only. No markdown, no code fences, no commentary before or after.
- Use double quotes for all keys and string values. No trailing commas. Use true/false/null as JSON literals.
- riskLevel must be exactly "low", "medium", or "high".

Include a jargonGlossary: 5–12 entries for substantive legal or contract terms that appear in YOUR written analysis (overallSummary, summaries, and item text). Each term should be the exact wording a reader will see (so tooltips can match). Each definition: one short sentence in plain English.

Required JSON shape:
{
  "hiddenFees": { "found": boolean, "items": [...], "summary": string },
  "terminationClauses": { "found": boolean, "items": [...], "summary": string },
  "liabilityRisks": { "found": boolean, "items": [...], "summary": string },
  "overallSummary": string,
  "jargonGlossary": [ { "term": string, "definition": string } ]
}

Item shapes:
- hiddenFees.items[]: { "description", "location", "amount", "riskLevel" } — amount may be "" if unknown
- terminationClauses.items[]: { "type", "description", "noticePeriod", "penalties", "riskLevel" } — use "" for unknown optional strings
- liabilityRisks.items[]: { "clause", "description", "impact", "riskLevel" }

If nothing is found in a category, use "found": false and "items": []. Use "jargonGlossary": [] only if there are truly no terms worth defining.`;

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

  const rawGlossary = parsed.jargonGlossary;
  const jargonGlossary = Array.isArray(rawGlossary)
    ? rawGlossary
        .filter(
          (e: unknown) =>
            e &&
            typeof e === "object" &&
            typeof (e as { term?: string }).term === "string" &&
            typeof (e as { definition?: string }).definition === "string"
        )
        .map((e) => ({
          term: (e as { term: string }).term.trim(),
          definition: (e as { definition: string }).definition.trim(),
        }))
        .filter((e) => e.term.length > 0 && e.definition.length > 0)
    : [];

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
    ...(jargonGlossary.length > 0 ? { jargonGlossary } : {}),
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
    jargonGlossary: [
      {
        term: "liquidated damages",
        definition:
          "A fixed amount of money the contract says one party owes if they break the deal—often used instead of proving actual losses.",
      },
      {
        term: "mitigate",
        definition:
          "To take reasonable steps to reduce harm or losses (for example, a landlord trying to re-rent space after a tenant leaves).",
      },
      {
        term: "CAM",
        definition:
          "Common Area Maintenance—your share of costs to run shared parts of a building (hallways, parking, landscaping, etc.).",
      },
      {
        term: "reconciliation",
        definition:
          "An accounting true-up: comparing estimated charges to actual costs and billing the difference.",
      },
    ],
  };
}

/** pdf-parse expects a Node Buffer; copy via Buffer.from() (avoid deprecated `new Buffer()` patterns). */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfBuffer = Buffer.from(buffer);
  const data = await pdfParse(pdfBuffer);
  const text = typeof data.text === "string" ? data.text : "";
  console.log("PDF text extracted:", text.substring(0, 100));
  return text;
}

/** Abort OpenAI request if it exceeds this — caller shows Demo (mock) analysis. */
const OPENAI_REQUEST_TIMEOUT_MS = 25_000;

function openaiRequestTimedOutPromise(): Promise<"timeout"> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("timeout"), OPENAI_REQUEST_TIMEOUT_MS);
  });
}

type AnalyzeOpenAIOutcome =
  | { status: "ok"; analysis: ContractAnalysis }
  | { status: "timeout" }
  | { status: "failed" };

/**
 * Calls OpenAI with a 25s cap per request. On timeout or error, returns a status so the caller can use Demo fallback.
 */
async function analyzeWithOpenAI(
  openai: OpenAI,
  buffer: Buffer,
  type: string
): Promise<AnalyzeOpenAIOutcome> {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

  try {
    if (type === "application/pdf") {
      const text = await extractTextFromPdf(buffer);
      if (!text.trim()) {
        return { status: "failed" };
      }

      const completion = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: ANALYSIS_PROMPT },
            {
              role: "user",
              content: `Analyze this contract:\n\n${text.slice(0, 120000)}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
        openaiRequestTimedOutPromise(),
      ]);

      if (completion === "timeout") {
        console.log(
          `[ClearContract] OpenAI PDF analysis exceeded ${OPENAI_REQUEST_TIMEOUT_MS / 1000}s — using Demo fallback`
        );
        return { status: "timeout" };
      }

      const content = completion.choices[0]?.message?.content;
      if (!content) return { status: "failed" };
      return { status: "ok", analysis: parseAnalysisResponse(content) };
    }

    if (imageTypes.includes(type)) {
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = type === "image/jpg" ? "image/jpeg" : type;

      const completion = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: ANALYSIS_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `This is a contract or legal document provided as an image. Use your vision capabilities to read all visible text carefully (OCR-quality transcription in your head), including headers, footnotes, and fine print. Then perform the full analysis and respond with ONLY the single JSON object specified in the system message—no other text.`,
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
        }),
        openaiRequestTimedOutPromise(),
      ]);

      if (completion === "timeout") {
        console.log(
          `[ClearContract] OpenAI image analysis exceeded ${OPENAI_REQUEST_TIMEOUT_MS / 1000}s — using Demo fallback`
        );
        return { status: "timeout" };
      }

      const content = completion.choices[0]?.message?.content;
      if (!content) return { status: "failed" };
      return { status: "ok", analysis: parseAnalysisResponse(content) };
    }

    return { status: "failed" };
  } catch (err) {
    console.error("[ClearContract] OpenAI analysis failed — Demo fallback:", err);
    return { status: "failed" };
  }
}

export type DemoFallbackReason = "timeout" | "openai_failed";

export async function analyzeContract(
  formData: FormData
): Promise<
  | {
      success: true;
      contractId: string;
      demoMode: boolean;
      /** Set when demo results are shown after a failed or timed-out API call (not when the API key is missing). */
      demoFallbackReason?: DemoFallbackReason;
    }
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
    const contract_type = getContractType(formData);
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
    let demoFallbackReason: DemoFallbackReason | undefined;

    if (apiKey) {
      const openai = new OpenAI({ apiKey, timeout: OPENAI_REQUEST_TIMEOUT_MS + 5_000 });
      const outcome = await analyzeWithOpenAI(openai, buffer, type);
      if (outcome.status === "ok") {
        analysis = outcome.analysis;
      } else {
        analysis = getMockCommercialLeaseAnalysis();
        demoMode = true;
        demoFallbackReason = outcome.status === "timeout" ? "timeout" : "openai_failed";
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
        contract_type,
        analysis: analysisForDb,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return { success: false, error: "Failed to save analysis" };
    }

    return {
      success: true,
      contractId: contract.id,
      demoMode,
      ...(demoFallbackReason ? { demoFallbackReason } : {}),
    };
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return { success: false, error: message };
  }
}
