"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, FileText, Image } from "lucide-react";
import { analyzeContract } from "@/app/actions/analyze-contract";
import { ScanningOverlay } from "@/components/scanning-overlay";
import { cn } from "@/lib/utils";

export function ContractUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setError(null);

    const result = await analyzeContract(formData);

    if (result.success) {
      if (result.demoMode) {
        toast.message("Demo Mode", {
          description:
            "OpenAI isn’t configured or the request failed—showing a sample Commercial Lease analysis so you can explore the product.",
          duration: 6000,
        });
      }
      router.refresh();
      router.push(`/dashboard?contract=${result.contractId}`);
    } else {
      setError(result.error);
      if (result.error === "Setup needed") {
        toast.info("Setup needed", {
          description: "Add your Supabase and OpenAI keys to ._secure_keys/credentials.env. See SETUP.md for instructions.",
          duration: 8000,
        });
      }
    }

    setUploading(false);
  }

  return (
    <div className="relative">
      <form
        action={handleSubmit}
        className="space-y-4"
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file) {
            const formData = new FormData();
            formData.set("file", file);
            handleSubmit(formData);
          }
        }}
      >
        <label
          className={cn(
            "relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300",
            "bg-gradient-to-b from-muted/30 to-muted/10",
            dragActive && "scale-[1.01] border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10",
            !dragActive && "hover:border-emerald-500/50 hover:bg-muted/20 hover:shadow-md",
            uploading && "pointer-events-none"
          )}
        >
          <input
            type="file"
            name="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.set("file", file);
                handleSubmit(formData);
              }
            }}
          />

          {uploading ? (
            <ScanningOverlay />
          ) : (
            <>
              <div
                className={cn(
                  "mb-6 flex size-20 items-center justify-center rounded-2xl transition-all duration-300",
                  "bg-emerald-500/10 ring-2 ring-emerald-500/20",
                  dragActive && "scale-110 bg-emerald-500/20 ring-emerald-500/40"
                )}
              >
                <Upload className="size-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Drag & drop your contract
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                or click to browse. Supports PDF and images (PNG, JPEG, WebP).
              </p>
              <div className="mt-6 flex gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="size-4" />
                  PDF
                </span>
                <span className="flex items-center gap-1.5">
                  <Image className="size-4" />
                  PNG, JPEG, WebP
                </span>
              </div>
            </>
          )}
        </label>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </form>
    </div>
  );
}
