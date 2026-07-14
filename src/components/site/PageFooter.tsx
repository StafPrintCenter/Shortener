import { SITE } from "@/data/site";

export function PageFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-6">
        <p className="text-xs text-muted-foreground">
          © 2026 SPC Shortener · Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}