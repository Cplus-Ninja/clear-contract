import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy | ClearContract",
  description: "How ClearContract collects, uses, and protects your information.",
};

export default function PrivacyPage() {
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
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 dark:bg-emerald-500 dark:text-emerald-950">
            <FileCheck2 className="size-5" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">ClearContract</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <article className="mt-10 max-w-none space-y-8 text-[15px] leading-relaxed text-muted-foreground">
          <p className="text-foreground/90">
            ClearContract (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates an AI-assisted contract
            analysis application. This Privacy Policy explains what information we handle, how we use it, and your
            choices. By using the service, you acknowledge this policy.
          </p>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Information we collect</h2>
            <p className="mt-3">
              We may collect information you provide directly (for example, account or contact details if you create an
              account or contact support) and content you submit to the service, such as contract files or pasted text
              you upload for analysis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">How we use uploads and files</h2>
            <p className="mt-3">
              <strong className="font-medium text-foreground">
                Files and text you submit are used to operate the product and to perform analysis only
              </strong>
              —for example, to generate summaries, risk flags, and related outputs you request. We do not use your
              contracts for unrelated purposes such as advertising profiling based on their contents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">We do not sell your data</h2>
            <p className="mt-3">
              <strong className="font-medium text-foreground">
                We do not sell your personal information or your uploaded files to third parties.
              </strong>{" "}
              We may share information only as needed to run the service (for example, with infrastructure or AI
              providers that process data on our behalf under appropriate safeguards), to comply with law, or to protect
              rights and safety.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">AI processing</h2>
            <p className="mt-3">
              Contract content may be processed by automated systems, including machine learning models, to produce
              analysis results. You should avoid uploading information you are not permitted to share or that exceeds
              what you need for your review.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Security and retention</h2>
            <p className="mt-3">
              We use reasonable technical and organizational measures designed to protect information. Retention periods
              depend on how the service is configured and operational needs; we may delete or anonymize data when it is
              no longer required for the purposes described here.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Your choices</h2>
            <p className="mt-3">
              Depending on your location, you may have rights to access, correct, or delete certain personal information.
              Contact us using the information we provide on the site or in-product to exercise applicable rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Changes to this policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will post the revised policy with an updated
              &quot;Last updated&quot; date. Continued use of the service after changes constitutes acceptance of the
              updated policy where permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Contact</h2>
            <p className="mt-3">
              For privacy-related questions, contact us through the channels listed on our website or in the product.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
