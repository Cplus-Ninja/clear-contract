"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface SetupToastTriggerProps {
  setupNeeded: boolean;
}

export function SetupToastTrigger({ setupNeeded }: SetupToastTriggerProps) {
  useEffect(() => {
    if (setupNeeded) {
      toast.info("Setup needed", {
        description: "Add your Supabase and OpenAI keys to ._secure_keys/credentials.env to enable contract analysis. See SETUP.md for instructions.",
        duration: 8000,
      });
    }
  }, [setupNeeded]);

  return null;
}
