import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, ShieldAlert, CircleX, Undo2, Flag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "@/components/modal/ReportModal";
import { SITE, SITE_LINK } from "@/data/site";

interface RedirectControlPanelProps {
  notFound: boolean;
  isBlocked: boolean;
  isDomainAllowed: boolean;
  redirected: boolean;
  cancelled: boolean;
  seconds: number;
  countdownMax: number;
  shortlink: any;
  domain: string;
  onResume: () => void;
  onRedirectNow: () => void;
  onCancel: () => void;
}

export function RedirectControlPanel({
  notFound,
  isBlocked,
  isDomainAllowed,
  redirected,
  cancelled,
  seconds,
  countdownMax,
  shortlink,
  domain,
  onResume,
  onRedirectNow,
  onCancel,
}: RedirectControlPanelProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const landingBase = SITE_LINK.landingUrl.replace(/\/$/, "");
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / countdownMax);

  // Bouton/modal de signalement partagé
  const renderReportTrigger = () => (
    <>
      <button
        onClick={() => setIsReportOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
      >
        <Flag size={13} />
        Signaler un problème
      </button>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        prefill={shortlink?.id ? { reportableId: shortlink.id } : undefined}
      />
    </>
  );

  // Lien introuvable 404
  if (notFound) {
    return <NotFoundState />;
  }

  // Lien bloqué, suspendu ou expiré
  if (isBlocked && shortlink) {
    return (
      <BlockedState
        shortlink={shortlink}
        renderReportTrigger={renderReportTrigger}
      />
    );
  }

  // Redirection effectuée avec succès
  if (redirected) {
    return <RedirectedState domain={domain} />;
  }

  // 4. État : Redirection annulée manuellement
  if (cancelled) {
    return (
      <CancelledState
        onResume={onResume}
        renderReportTrigger={renderReportTrigger}
      />
    );
  }

  // 5. État : Domaine non sécurisé ou non autorisé
  if (!isDomainAllowed) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-10 w-10" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-lg font-semibold">Redirection désactivée</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Le domaine de destination n'a pas pu être vérifié. Consultez les informations
          ci-contre avant de continuer manuellement.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Button size="lg" className="w-full" disabled>
            Rediriger maintenant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // 6. État par défaut : Décompte en cours actif
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
      <div className="relative h-21 w-21">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="5" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums">
          {seconds}
        </span>
      </div>
      <h1 className="mt-4 text-lg font-semibold">Redirection en cours…</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous serez redirigé dans {seconds} seconde
        {seconds > 1 ? "s" : ""}.
      </p>

      {/* Notice d'information sur la collecte anonyme */}
      <div className="mt-5 flex max-w-xs items-start gap-2 rounded-xl bg-muted/50 p-3 text-left text-xs text-muted-foreground/90 border border-border/50">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          En poursuivant, vous prenez connaissance que des données techniques anonymisées (IP, ville, appareil) sont mesurées à des fins statistiques. Voir notre{" "}
          <a
            href={`${landingBase}/legal/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 hover:text-primary transition-colors"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </div>

      <div className="mt-4 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" className="w-full cursor-pointer" onClick={onRedirectNow}>
          Rediriger maintenant
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="w-full cursor-pointer" onClick={onCancel}>
          <Undo2 className="h-4 w-4" />
          Annuler
        </Button>
      </div>
    </div>
  );
}