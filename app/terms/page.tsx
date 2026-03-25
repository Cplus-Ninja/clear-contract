import Link from "next/link";
import { FileCheck2, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Terms of Service | ClearContract",
  description: "Terms governing use of ClearContract.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-6">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 text-muted-foreground")}
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center gap-2 font-semibold text-foreground">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950">
            <FileCheck2 className="size-4" />
          </div>
          ClearContract
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            By accessing or using ClearContract, you agree to these terms. If you do not agree, do not use the service.
          </p>
          <div>
            <h2 className="text-lg font-semibold text-foreground">The service</h2>
            <p className="mt-2 leading-relaxed">
              ClearContract provides AI-powered contract analysis and related tools. Features may change as we improve
              the product.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Not legal advice</h2>
            <p className="mt-2 leading-relaxed">
              ClearContract is not a law firm and does not provide legal advice. Output is for informational purposes
              only. Consult a qualified attorney for advice specific to your situation.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Your content</h2>
            <p className="mt-2 leading-relaxed">
              You are responsible for the contracts and information you submit. You represent that you have the right to
              use that content with our service.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Disclaimer</h2>
            <p className="mt-2 leading-relaxed">
              The service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
              damages arising from your use of or reliance on the service, to the fullest extent permitted by law.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Changes</h2>
            <p className="mt-2 leading-relaxed">
              We may update these terms. Continued use after changes constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
