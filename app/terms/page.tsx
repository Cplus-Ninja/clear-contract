import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, ArrowLeft, AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service | ClearContract",
  description: "Terms governing use of ClearContract.",
};

const TOP_DISCLAIMER =
  "FOR DEMONSTRATION PURPOSES ONLY. CLEARCONTRACT IS AN AI TOOL, NOT A LICENSED ATTORNEY. CONSULT A LAWYER BEFORE SIGNING CONTRACTS.";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-20 landing-mesh-bg" />
      <div className="pointer-events-none fixed inset-0 -z-10 landing-grid-bg mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2 text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 pb-20">
        <div
          className="mb-10 flex gap-4 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <p className="text-sm font-semibold leading-snug tracking-wide">{TOP_DISCLAIMER}</p>
        </div>

        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 dark:bg-emerald-500 dark:text-emerald-950">
            <FileCheck2 className="size-5" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">ClearContract</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <article className="mt-10 max-w-none space-y-8 text-[15px] leading-relaxed text-muted-foreground">
          <p className="text-foreground/90">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of ClearContract. By using the
            service, you agree to these Terms. If you do not agree, do not use the service.
          </p>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Nature of the service</h2>
            <p className="mt-3">
              ClearContract provides AI-powered tools to help you review and understand contract-related content. The
              service may be incomplete, incorrect, or unsuitable for your situation.{" "}
              <strong className="font-medium text-foreground">
                It is not a substitute for professional legal advice.
              </strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">No legal advice</h2>
            <p className="mt-3">
              ClearContract is not a law firm and does not provide legal advice. Any output is for general informational
              purposes only. You alone are responsible for decisions about whether to sign, amend, or rely on any
              contract. Consult a qualified attorney before signing or taking legal action.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Your content</h2>
            <p className="mt-3">
              You retain ownership of content you submit, subject to the rights we need to operate the service. You
              represent that you have the right to submit such content and that doing so does not violate applicable law
              or third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Acceptable use</h2>
            <p className="mt-3">
              You agree not to misuse the service (for example, by attempting to disrupt security, overload systems, or
              use the service for unlawful purposes). We may suspend or terminate access for violations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Disclaimer of warranties</h2>
            <p className="mt-3">
              The service is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind,
              express or implied, including merchantability, fitness for a particular purpose, and non-infringement, to
              the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Limitation of liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, ClearContract and its suppliers will not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or
              goodwill, arising from your use of the service or reliance on any output.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Changes</h2>
            <p className="mt-3">
              We may modify these Terms or the service. We will post updated Terms with a revised &quot;Last
              updated&quot; date. Continued use after changes become effective constitutes your acceptance of the
              revised Terms where permitted by law.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
