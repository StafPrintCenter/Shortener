import * as React from "react";
import { PageHeader, PageFooter } from "@/components/site";
import { cn } from "@/lib/utils";

interface ShortShellProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
  mainClassName?: string;
  gridOpacityClass?: string;
}

export function ShortShell({
  children,
  headerContent,
  className,
  mainClassName,
  gridOpacityClass = "opacity-80",
}: ShortShellProps) {
  return (
    <div className={cn("relative min-h-screen bg-background overflow-x-clip text-foreground font-sans", className)}>
      {/* Background papier avec grille toujours active */}
      <div className={cn("pointer-events-none absolute inset-0 paper-grid", gridOpacityClass)} />

      {/* Contenu principal isolé au z-index supérieur */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <PageHeader>{headerContent}</PageHeader>

        <main className={cn("relative flex-1", mainClassName)}>
          {children}
        </main>

        <PageFooter />
      </div>
    </div>
  );
}