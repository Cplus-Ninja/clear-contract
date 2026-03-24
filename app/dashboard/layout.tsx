import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileCheck2, LayoutDashboard, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinkClass = (active: boolean) =>
    cn(
      "flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors touch-manipulation md:min-h-0",
      active
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-border/40 bg-card/50 backdrop-blur md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-14 items-center gap-2 border-b border-border/40 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <FileCheck2 className="size-4" />
            </div>
            <span className="truncate font-semibold text-foreground">ClearContract</span>
          </div>
          <div className="shrink-0 md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav
          className="flex flex-row gap-0.5 overflow-x-auto overscroll-x-contain px-2 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-1 md:flex-col md:space-y-0.5 md:overflow-visible md:p-4 [&::-webkit-scrollbar]:hidden"
          aria-label="Dashboard navigation"
        >
          <Link href="/dashboard" className={navLinkClass(true)}>
            <LayoutDashboard className="size-4 shrink-0" />
            Dashboard
          </Link>
          <Link href="/" className={navLinkClass(false)}>
            <Home className="size-4 shrink-0" />
            Home
          </Link>
        </nav>

        <div className="hidden border-t border-border/40 p-3 sm:p-4 md:block">
          <ThemeToggle />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
