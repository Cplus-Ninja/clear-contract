"use server";

import OpenAI from "openai";
import { ContractAnalysis } from "@/lib/types";

type GenerateEmailInput = {
  fileName: string;
  analysis: ContractAnalysis;
};

export async function generateNegotiationEmail(
  input: GenerateEmailInput
): Promise<{ success: true; email: string } | { success: false; error: string }> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { success: false, error: "OpenAI API key not configured" };
    }

    const openai = new OpenAI({ apiKey });
    const riskContext = JSON.stringify(input.analysis, null, 2);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a procurement negotiator. Write a polite but firm vendor negotiation email requesting removal or revision of risky clauses. Keep it concise, professional, and actionable. Include a clear subject line as the first line in the format: Subject: ...",
        },
        {
          role: "user",
          content: `Draft an email about risks found in "${input.fileName}". Focus on hidden costs, termination clauses, and liability risks. Ask the vendor to remove or revise high/medium risks and suggest mutually fair alternatives.\n\nAnalysis JSON:\n${riskContext}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const email = completion.choices[0]?.message?.content?.trim();
    if (!email) {
      throw new Error("No response from AI");
    }

    return { success: true, email };
  } catch (err) {
    console.error("Generate negotiation email error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate email";
    return { success: false, error: message };
  }
}
