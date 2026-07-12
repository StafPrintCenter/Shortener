import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportDialog } from "@/components/report-dialog";

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
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / countdownMax);

  // 1. État : Lien introuvable 404
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <X className="h-10 w-10" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-lg font-semibold">Lien introuvable</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce lien court n'existe pas. Vérifiez l'adresse ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Button asChild size="lg" className="w-full">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 2. État : Lien bloqué, suspendu ou expiré
  if (isBlocked && shortlink) {
    const isPending = shortlink.activateAt && new Date(shortlink.activateAt) > new Date();
    const isExpired = shortlink.expiresAt && new Date(shortlink.expiresAt) < new Date();
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Clock className="h-10 w-10" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-lg font-semibold">
          {isPending ? "Ce lien n'est pas encore actif" : isExpired ? "Ce lien a expiré" : "Ce lien est désactivé"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPending
            ? `Il sera disponible à partir du ${new Date(shortlink.activateAt).toLocaleDateString("fr-FR")}.`
            : "Contactez STAF PRINT CENTER si vous pensez qu'il s'agit d'une erreur."}
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <div className="flex items-center justify-center pt-1">
            <ReportDialog shortlinkId={shortlink.id} />
          </div>
        </div>
      </div>
    );
  }

  // 3. État : Redirection effectuée avec succès
  if (redirected) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-lg font-semibold">Redirection effectuée</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous avez été dirigé en toute sécurité vers{" "}
          <span className="font-mono text-foreground">{domain}</span>
        </p>
      </div>
    );
  }

  // 4. État : Redirection annulée manuellement
  if (cancelled) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <X className="h-10 w-10" strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-lg font-semibold">Redirection annulée</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous pouvez reprendre la redirection à tout moment.
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Button size="lg" className="w-full" onClick={onResume}>
            Reprendre la redirection
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center pt-1">
            <ReportDialog shortlinkId={shortlink?.id} />
          </div>
        </div>
      </div>
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
        Vous serez redirigé vers STAF PRINT CENTER dans {seconds} seconde
        {seconds > 1 ? "s" : ""}.
      </p>

      <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" className="w-full" onClick={onRedirectNow}>
          Rediriger maintenant
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="w-full" onClick={onCancel}>
          <X className="h-4 w-4" />
          Annuler
        </Button>
      </div>
    </div>
  );
}