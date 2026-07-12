import { ShieldCheck, Link2, ArrowUpRight, Lock, Copy, Check, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ORIGIN, SHORT_ORIGIN, stripProtocol } from "@/lib/domain";

interface HeroSectionProps {
  onCreateClick: () => void;
  onReportClick: () => void;
}

export function HeroSection({ onCreateClick, onReportClick }: HeroSectionProps) {
  return (
    <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-10">
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

        <div className="mt-8 flex flex-col items-start gap-3 w-full sm:flex-row sm:items-center">
          <Button size="lg" onClick={onCreateClick} className="w-full sm:w-auto">
            <Link2 className="h-4 w-4" />
            Raccourcir un lien
          </Button>
          <Button size="lg" variant="outline" className="bg-card w-full sm:w-auto" onClick={onReportClick}>
            <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
            Signaler un problème
          </Button>
        </div>

        <div className="mt-10 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-success" />
          Domaine restreint · Aucun lien externe accepté
        </div>
      </div>

      {/* Colonne droite — démonstration du raccourcissement */}
      <div className="relative mx-auto w-full max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left min-w-0">
        <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

        <div className="rounded-2xl border border-border bg-card p-5 shadow-panel sm:p-8 min-w-0 w-full overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:justify-start">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
            Exemple de raccourcissement
          </div>

          {/* Lien long */}
          <div className="mt-5 flex w-full min-w-0 items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5 text-left">
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-xs sm:text-sm text-muted-foreground block">
              {stripProtocol(FRONTEND_ORIGIN)}/articles/5-erreurs-a-eviter-avant-dimprimer
            </span>
          </div>

          <div className="my-2 flex justify-center">
            <ArrowUpRight className="h-4 w-4 rotate-90 text-primary" />
          </div>

          {/* Lien court */}
          <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-left">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate text-xs sm:text-sm font-semibold text-foreground block">
              {stripProtocol(SHORT_ORIGIN)}/r/5h0rtn
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground sm:px-2.5 sm:py-1 sm:text-xs">
              <Copy className="h-3 w-3" />
              Copier
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-success" />
              Destination vérifiée
            </span>
            <span>0 clic</span>
          </div>
        </div>
      </div>
    </section>
  );
}