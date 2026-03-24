import Link from "next/link";
import { ContractUpload } from "@/components/contract-upload";
import { Results } from "@/components/results";
import { SetupToastTrigger } from "@/components/setup-toast-trigger";
import { getContracts } from "@/app/actions/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileCheck2, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractAnalysis } from "@/lib/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ contract?: string }>;
}) {
  const params = await searchParams;
  const { data: contracts, setupNeeded } = await getContracts();
  const selectedId = params.contract;
  const selectedContract = selectedId
    ? contracts.find((c) => c.id === selectedId)
    : contracts[0];

  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none fixed inset-0 -z-20 landing-mesh-bg" />
      <div className="pointer-events-none fixed inset-0 -z-10 landing-grid-bg [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_30%,transparent_100%)]" />
      <SetupToastTrigger setupNeeded={setupNeeded} />

      <div className="mx-auto max-w-[1600px] px-5 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            Upload and audit your contracts with AI
          </p>
        </div>

        {/* Upload zone */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <ContractUpload />
        </section>

        {/* Main content: Recent Audits + Analysis */}
        <div className="grid min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Recent Audits - Card list */}
          <div className="min-w-0 space-y-3 sm:space-y-4 lg:col-span-1">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              Recent Audits
            </h2>
            {contracts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No audits yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload your first contract above
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/dashboard?contract=${contract.id}`}
                    className="block touch-manipulation active:scale-[0.99]"
                  >
                    <Card
                      className={cn(
                        "transition-all duration-200 hover:shadow-md",
                        selectedContract?.id === contract.id
                          ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20 dark:bg-emerald-500/10"
                          : "hover:border-emerald-500/30"
                      )}
                    >
                      <CardHeader className="px-4 pb-2 pt-3 sm:px-6 sm:pt-4">
                        <CardTitle className="flex items-start justify-between gap-3 text-sm font-medium leading-snug">
                          <span className="min-w-0 flex-1 break-words">
                            {contract.file_name}
                          </span>
                          <ChevronRight
                            className={cn(
                              "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
                              selectedContract?.id === contract.id &&
                                "text-emerald-600 dark:text-emerald-400"
                            )}
                          />
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(contract.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Analysis view */}
          <div className="min-w-0 overflow-x-hidden lg:col-span-2">
            {selectedContract ? (
              <Results
                analysis={selectedContract.analysis as unknown as ContractAnalysis}
                fileName={selectedContract.file_name}
                demoMode={Boolean(
                  (selectedContract.analysis as { demoMode?: boolean }).demoMode
                )}
              />
            ) : contracts.length > 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                    <FileCheck2 className="size-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="font-medium text-foreground">
                    Select a contract
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose an audit from the list to view the AI analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
                    <FileCheck2 className="size-7 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">
                    Your analysis will appear here
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload a contract to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
