import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";
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
          <img
            src={logo.dc}
            alt="Logo SPC"
            className="h-10 w-auto md:h-12 block dark:hidden"
          />
          <img
            src={logo.dw}
            alt="Logo SPC"
            className="h-10 w-auto md:h-12 hidden dark:block"
          />
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