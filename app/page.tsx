import { Fragment } from "react";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  FileCheck2,
  Shield,
  Zap,
  ArrowRight,
  Upload,
  Sparkles,
  FileSignature,
  ChevronRight,
  Building2,
  Briefcase,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const howItWorksSteps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload contract",
    description: "Drop your PDF or paste text. We keep the flow simple so you can start in seconds.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "AI analysis",
    description:
      "Our models flag risks, summarize jargon, and surface questions you should ask before signing.",
  },
  {
    step: 3,
    icon: FileSignature,
    title: "Negotiate & sign",
    description: "Use clear talking points to align with the other party—then sign with confidence.",
  },
] as const;

const faqItems = [
  {
    q: "Is this legal advice?",
    a: "No. ClearContract is an AI-powered contract auditor—it helps you spot issues and understand language faster. It does not replace a licensed attorney. For binding decisions, retention, or disputes, consult qualified legal counsel in your jurisdiction.",
  },
  {
    q: "How does the AI analysis work?",
    a: "You upload your contract (PDF or text). Our models scan for risks, ambiguous terms, renewal traps, and one-sided clauses, then summarize findings in plain English so you can prioritize what to negotiate or verify.",
  },
  {
    q: "Is my contract data secure?",
    a: "We treat uploads with care and use industry-standard practices for transmission and storage. Review our Privacy Policy for details on retention and how data is handled.",
  },
  {
    q: "Who is ClearContract for?",
    a: "Small businesses, founders, and operators—especially teams without in-house legal—who need to move quickly but want fewer surprises in leases, vendor deals, and NDAs.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated mesh gradient + grid background */}
      <div className="pointer-events-none fixed inset-0 -z-20 landing-mesh-bg" />
      <div className="pointer-events-none fixed inset-0 -z-10 landing-grid-bg [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileCheck2 className="size-4" />
            </div>
            ClearContract
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "btn-glow bg-emerald-600 hover:bg-emerald-700 text-white border-0")}
            >
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        {/* Subtle gradient orbs - emerald accent */}
        <div className="pointer-events-none absolute inset-0 -z-[5]">
          <div className="absolute left-1/4 top-1/4 size-[500px] animate-[orb-pulse_8s_ease-in-out_infinite] rounded-full bg-emerald-400/30 dark:bg-emerald-500/20 [filter:blur(80px)]" />
          <div className="absolute bottom-1/4 right-1/4 size-[400px] animate-[orb-pulse_10s_ease-in-out_infinite_reverse] rounded-full bg-teal-400/20 dark:bg-teal-500/15 [filter:blur(80px)]" />
          <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 animate-[orb-pulse_12s_ease-in-out_infinite] rounded-full bg-cyan-400/15 dark:bg-cyan-500/10 [filter:blur(60px)]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <Zap className="size-4" />
            AI-Powered Contract Analysis
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            Audit contracts with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              confidence
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.35s", animationFillMode: "both" }}
          >
            ClearContract helps small businesses understand and audit contracts in minutes—not hours.
            Our AI identifies risks, clarifies jargon, and highlights what matters so you can sign with certainty.
          </p>
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-glow h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_oklch(0.55_0.15_165/0.5)] dark:hover:shadow-[0_0_36px_-4px_oklch(0.65_0.15_165/0.6)]"
              )}
            >
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-8 text-base transition-all hover:scale-105 hover:border-emerald-500/50"
              )}
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div
          id="how-it-works"
          className="mx-auto mt-28 max-w-6xl scroll-mt-24 border-t border-emerald-500/10 pt-20"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Process
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Three steps from upload to a clearer deal—built for busy Springfield-area teams and beyond.
            </p>
          </div>

          <div className="mt-14 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
            {howItWorksSteps.map(({ step, icon: Icon, title, description }, i) => (
              <Fragment key={step}>
                <div className="flex w-full max-w-sm flex-col items-center text-center">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500 dark:text-emerald-950">
                    {step}
                  </span>
                  <div className="mt-5 flex size-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 shadow-inner shadow-emerald-500/5 dark:from-emerald-500/20 dark:to-teal-500/10">
                    <Icon className="size-8 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                {i < 2 && (
                  <div
                    className="flex shrink-0 items-center justify-center lg:min-h-[200px] lg:pt-6"
                    aria-hidden
                  >
                    <ChevronRight className="size-8 rotate-90 text-emerald-500/35 lg:rotate-0 dark:text-emerald-400/40" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Feature highlights - interactive cards */}
        <div id="features" className="mx-auto mt-24 grid max-w-5xl gap-8 sm:grid-cols-3 scroll-mt-24">
          {[
            {
              icon: Shield,
              title: "Risk Detection",
              description:
                "AI identifies hidden clauses, unfavorable terms, and potential liabilities before you sign.",
              delay: "0.6s",
            },
            {
              icon: FileCheck2,
              title: "Plain English",
              description:
                "Complex legal language translated into clear, actionable summaries you can understand.",
              delay: "0.75s",
            },
            {
              icon: Zap,
              title: "Fast & Accurate",
              description: "Get a complete audit in minutes. Built for small teams who don't have a legal department.",
              delay: "0.9s",
            },
          ].map(({ icon: Icon, title, description, delay }) => (
            <div
              key={title}
              className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 animate-fade-in-up"
              style={{ animationDelay: delay, animationFillMode: "both" }}
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20">
                <Icon className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scenarios */}
      <section
        id="scenarios"
        className="border-t border-emerald-500/10 bg-emerald-500/[0.03] px-6 py-20 dark:bg-emerald-500/[0.06]"
      >
        <div className="mx-auto max-w-6xl scroll-mt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Use cases
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Scenarios we help you navigate
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Real documents, real stakes—tailored prompts so nothing important hides in the fine print.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Commercial leases",
                body: "Spot hidden rent hikes and maintenance traps before you commit to a space.",
              },
              {
                icon: Briefcase,
                title: "Service agreements",
                body: "Understand automatic renewals, SLAs, and liability caps in vendor and client contracts.",
              },
              {
                icon: Lock,
                title: "NDAs",
                body: "Ensure mutual protection for your Springfield business ideas and confidential discussions.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="border-emerald-500/15 bg-card/80 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/35 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Icon className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{body}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Try it on your contract
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 scroll-mt-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            {faqItems.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-border/60 bg-card/50 px-5 py-4 shadow-sm transition-colors open:border-emerald-500/25 open:bg-emerald-500/[0.04] dark:open:bg-emerald-500/[0.07]"
              >
                <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {q}
                    <ChevronRight className="size-5 shrink-0 text-emerald-600 transition-transform group-open:rotate-90 dark:text-emerald-400" />
                  </span>
                </summary>
                <p className="mt-3 border-t border-border/40 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-y border-emerald-500/15 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 px-6 py-16 dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-emerald-500/15">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to audit your next contract?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join small businesses using ClearContract to read smarter—not slower.
          </p>
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "btn-glow mt-8 inline-flex bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            )}
          >
            Get Started
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 px-6 py-12 dark:bg-muted/10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950">
                <FileCheck2 className="size-4" />
              </div>
              ClearContract
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI-powered contract auditing for teams who need clarity without a full legal department—presented in a
              polished interface that respects both light and dark mode.
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-end md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="text-foreground/90 hover:text-emerald-600 dark:hover:text-emerald-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClearContract. All rights reserved.
          </p>
          <p className="text-center text-xs text-muted-foreground sm:text-right">
            Not legal advice. AI-powered analysis only—consult an attorney for advice on your situation.
          </p>
        </div>
      </footer>
    </div>
  );
}
