import * as React from "react";
import { PageHeader, PageFooter } from "@/components/site";
import { cn } from "@/lib/utils";

interface ShortShellProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  className?: string;
  mainClassName?: string;
  showGrid?: boolean;
}

export function ShortShell({
  children,
  headerContent,
  className,
  mainClassName,
  showGrid = true,
}: ShortShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background text-foreground font-sans", className)}>
      <PageHeader>{headerContent}</PageHeader>

      <main className={cn("relative flex-1 overflow-hidden", mainClassName)}>
        {/* Grille d'arrière-plan isolée dans le main pour ne pas recouvrir le header/footer */}
        {showGrid && (
          <div
            className={cn("pointer-events-none absolute inset-0 grid-field")}
          />
        )}

        {children}
      </main>

      <PageFooter />
    </div>
  );
}