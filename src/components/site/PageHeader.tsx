import { Link } from "@tanstack/react-router";
import { SpcDeskLogo } from "@/components/site";
import { ThemeToggle } from "./";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* À GAUCHE : Logo (DC en mode clair, DW en mode sombre) */}
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
          <SpcDeskLogo className="mx-auto h-12 w-auto" />
        </Link>

        {/* À DROITE : Children + ThemeToggle regroupés */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}