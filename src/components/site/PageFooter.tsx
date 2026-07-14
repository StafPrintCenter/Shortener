import { SITE } from "@/data/site";

export function PageFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col items-center justify-center gap-1 px-6 py-4 text-center sm:flex-row sm:gap-2 sm:py-0">
        <p className="text-xs text-muted-foreground">
          © 2026 SPC Shortener · Tous droits réservés.
        </p>

        {/* Séparateur masqué sur mobile, visible sur PC */}
        <span className="hidden text-xs text-muted-foreground/60 sm:inline">|</span>

        <p className="text-xs text-muted-foreground">
          Un service fourni par{" "}
          <a
            href={SITE.landing}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            {SITE.name}
          </a>
        </p>
      </div>
    </footer>
  );
}