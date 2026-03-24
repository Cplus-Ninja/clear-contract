"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { ContractAnalysis } from "@/lib/types";
import OpenAI from "openai";

const ANALYSIS_PROMPT = `You are a contract analyst. Analyze the following contract document for:
1. HIDDEN FEES - any fees, charges, or costs that may not be immediately obvious (subscription fees, early termination fees, auto-renewal charges, processing fees, etc.)
2. TERMINATION CLAUSES - conditions for ending the agreement, notice periods, penalties for early termination, auto-renewal terms

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
    overallSummary: parsed.overallSummary ?? "",
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

export async function analyzeContract(
  formData: FormData
): Promise<{ success: true; contractId: string } | { success: false; error: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "OpenAI API key not configured" };
    }

    const supabase = createServiceRoleClient();
    if (!supabase) {
      return { success: false, error: "Setup needed" };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = file.type.toLowerCase();
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

    let analysis: ContractAnalysis;

    const openai = new OpenAI({ apiKey });

    if (type === "application/pdf") {
      const text = await extractTextFromPdf(buffer);
      if (!text.trim()) {
        return { success: false, error: "Could not extract text from PDF" };
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: ANALYSIS_PROMPT,
          },
          {
            role: "user",
            content: `Analyze this contract:\n\n${text.slice(0, 120000)}`, // ~30k tokens
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      analysis = parseAnalysisResponse(content);
    } else if (imageTypes.includes(type)) {
      const base64 = buffer.toString("base64");
      const mimeType = type === "image/jpg" ? "image/jpeg" : type;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: ANALYSIS_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this contract image for hidden fees and termination clauses. Respond with ONLY the JSON object as specified.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      analysis = parseAnalysisResponse(content);
    } else {
      return {
        success: false,
        error: "Unsupported file type. Use PDF or image (PNG, JPEG, WebP).",
      };
    }

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
        analysis: analysis as unknown as Record<string, unknown>,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return { success: false, error: "Failed to save analysis" };
    }

    return { success: true, contractId: contract.id };
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return { success: false, error: message };
  }
}
