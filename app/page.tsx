import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileCheck2, Shield, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
              href="#features"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-8 text-base transition-all hover:scale-105 hover:border-emerald-500/50")}
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Feature highlights - interactive cards */}
        <div id="features" className="mx-auto mt-24 grid max-w-5xl gap-8 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Risk Detection",
              description: "AI identifies hidden clauses, unfavorable terms, and potential liabilities before you sign.",
              delay: "0.6s",
            },
            {
              icon: FileCheck2,
              title: "Plain English",
              description: "Complex legal language translated into clear, actionable summaries you can understand.",
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

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClearContract. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
