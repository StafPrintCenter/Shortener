import { Link } from "@tanstack/react-router";
import logo from "@/assets/logos.json";
import { ThemeToggle } from "./";

interface PageHeaderProps {
  children?: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  const hasChildren = Boolean(children);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo à gauche : DC (clair) / DW (sombre) */}
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

        {/* Zone centrale pour children */}
        {hasChildren && (
          <div className="flex flex-1 items-center min-w-0 mx-2 sm:mx-4">
            {children}
          </div>
        )}

        {/* Bouton de thème calé à droite */}
        <div className="flex items-center shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}