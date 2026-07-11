import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Eye,
  Link2,
  ArrowUpRight,
  Lock,
  ScanLine,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

const pillars = [
  {
    icon: ScanLine,
    title: "Analyse d'intégrité",
    text: "Chaque destination est scannée et vérifiée avant toute redirection.",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    text: "Le lien final complet est affiché avant que vous ne poursuiviez.",
  },
  {
    icon: Lock,
    title: "Confiance numérique",
    text: "Un standard de sécurité pensé pour les usages professionnels.",
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <BrandMark />
          <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Systèmes opérationnels
          </span>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-70" />

        <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-24 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Redirection vérifiée · Confiance numérique
          </span>

          <h1 className="mt-7 max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Plateforme de raccourcissement et de redirection de liens{" "}
            <span className="text-primary">sécurisés</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            SPC Redirect place la sécurité et la transparence au cœur de chaque
            clic. Nous vérifions la destination, extrayons son aperçu réel
            (titre, image, description) et protégeons vos utilisateurs contre
            les redirections malveillantes.

          </p>

          {/* Decorative abstract shield / vector element */}
          <div className="relative mt-16 mb-14">
            <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl border border-border bg-card shadow-panel sm:h-48 sm:w-48">
              <div className="absolute inset-3 rounded-2xl border border-dashed border-border/80" />
              <ShieldCheck
                className="h-20 w-20 text-primary sm:h-24 sm:w-24"
                strokeWidth={1.25}
              />
              <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-success text-success-foreground shadow-sm">
                <Lock className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/r/$alias" params={{ alias: "doc" }}>
                <Link2 className="h-4 w-4" />
                Voir une redirection
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/r/$alias" params={{ alias: "verify" }}>
                Exemple de vérification
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-24 grid w-full gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-border bg-card p-6 text-left shadow-sm transition-shadow hover:shadow-panel"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-6">
          <p className="text-xs text-muted-foreground">
            © 2026 SPC Redirect. Tous droits réservés.

          </p>
        </div>
      </footer>
    </div>
  );
}
