import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Link2, ArrowUpRight, Lock, Eye, UserRoundX, AlertTriangle, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageFooter } from "@/components/site";
import { CreateShortlinkModal, ReportModal } from "@/components/modal";
import { FRONTEND_ORIGIN, SHORT_ORIGIN, stripProtocol } from "@/lib/domain";

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
  },
];

function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader>
        <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Systèmes opérationnels
        </span>
      </PageHeader>

      <main className="relative flex-1 overflow-hidden">
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
              réalisations, formations et articles ; jamais vers une destination
              externe. Un aperçu clair avant chaque clic, et un suivi des clics
              pour vos partages.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={() => setIsCreateOpen(true)}>
                <Link2 className="h-4 w-4" />
                Raccourcir un lien
              </Button>
              <Button size="lg" variant="outline" className="bg-card" onClick={() => setIsReportOpen(true)}>
                <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                Signaler un problème
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-success" />
              Domaine restreint · Aucun lien externe accepté
            </div>
          </div>

          {/* Colonne droite — démonstration du raccourcissement (illustrative, centrée sur mobile) */}
          <div className="relative mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

            <div className="rounded-2xl border border-border bg-card p-6 shadow-panel sm:p-8">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:justify-start">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                Exemple de raccourcissement
              </div>

              {/* Lien long */}
              <div className="mt-5 flex min-w-0 items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5 text-left">
                <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {stripProtocol(FRONTEND_ORIGIN)}/articles/5-erreurs-a-eviter-avant-dimprimer
                </span>
              </div>

              <div className="my-3 flex justify-center">
                <ArrowUpRight className="h-4 w-4 rotate-90 text-primary" />
              </div>

              {/* Lien court */}
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-left">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                  {stripProtocol(SHORT_ORIGIN)}/r/5h0rtn
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  <Copy className="h-3 w-3" />
                  Copier
                </span>
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground lg:justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
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

      <PageFooter />

      <CreateShortlinkModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}