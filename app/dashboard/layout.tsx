import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileCheck2, LayoutDashboard, Home, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border/40 bg-card/50 backdrop-blur">
        <div className="flex h-16 items-center gap-2 border-b border-border/40 px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <FileCheck2 className="size-4" />
          </div>
          <span className="font-semibold text-foreground">ClearContract</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            )}
          >
            <LayoutDashboard className="size-4 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Home className="size-4 shrink-0" />
            Home
          </Link>
        </nav>

        <div className="border-t border-border/40 p-4">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
