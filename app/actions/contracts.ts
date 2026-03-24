"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";

export interface ContractRecord {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
  analysis: Record<string, unknown>;
}

export async function getContracts(): Promise<
  { data: ContractRecord[]; setupNeeded: false } | { data: []; setupNeeded: true }
> {
  const supabase = createServiceRoleClient();

  if (!supabase) {
    return { data: [], setupNeeded: true };
  }

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch contracts:", error);
    return { data: [], setupNeeded: true };
  }

  return { data: data ?? [], setupNeeded: false };
}
