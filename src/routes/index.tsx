import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Link2, ArrowUpRight, Lock, Eye, UserRoundX, AlertTriangle, Copy, Check, Sparkles, } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

const pillars = [
  {
    icon: ShieldCheck,
    title: "Exclusivement STAF PRINT CENTER",
    text: "Chaque lien raccourci pointe uniquement vers nos contenus officiels — services, réalisations, formations et articles. Aucune destination externe n'est acceptée.",
  },
  {
    icon: Eye,
    title: "Aperçu avant redirection",
    text: "Titre, image et description du contenu ciblé sont vérifiables avant de cliquer — pas de surprise à l'arrivée.",
  },
  {
    icon: UserRoundX,
    title: "Anonymat total",
    text: "Aucune inscription n'est requise pour créer un lien court. Partagez vos liens rapidement, en toute confidentialité.",
  }
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <BrandMark />
          <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Systèmes opérationnels
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 grid-field opacity-70" />
        <section className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-10">
          {/* Colonne gauche — message et actions */}
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Le raccourcisseur officiel STAF PRINT CENTER
            </span>

            <h1 className="mt-7 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              Partagez STAF PRINT CENTER<br />
              en <span className="text-primary">un lien court.</span>
            </h1>

            <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              SPC Redirect raccourcit exclusivement les liens vers nos services,
              réalisations, formations et articles — jamais vers une destination
              externe. Un aperçu clair avant chaque clic, et un suivi des clics
              pour vos partages.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a href="#raccourcir-lien">
                  <Link2 className="h-4 w-4" />
                  Raccourcir un lien
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-card">
                <Link to="/r/$alias" params={{ alias: "verify" }}>
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Signaler un problème
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-success" />
              Domaine restreint · Aucun lien externe accepté
            </div>
          </div>

          {/* Colonne droite — démonstration du raccourcissement */}
          <div id="raccourcir-lien" className="relative scroll-mt-24">
            <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

            <div className="rounded-2xl border border-border bg-card p-6 shadow-panel sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Exemple de raccourcissement
              </div>

              {/* Lien long */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5">
                <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  stafprintcenter.com/articles/5-erreurs-a-eviter-avant-dimprimer
                </span>
              </div>

              <div className="my-3 flex justify-center">
                <ArrowUpRight className="h-4 w-4 rotate-90 text-primary" />
              </div>

              {/* Lien court */}
              <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="flex-1 truncate text-sm font-semibold text-foreground">
                  spc.link/r/5h0rtn
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  <Copy className="h-3 w-3" />
                  Copier
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" />
                  Destination vérifiée
                </span>
                <span>0 clic</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2 lg:mt-6">
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