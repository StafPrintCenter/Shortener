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

  // Redirection annulée manuellement
  if (cancelled) {
    return (
      <CancelledState
        onResume={onResume}
        renderReportTrigger={renderReportTrigger}
      />
    );
  }

  // Domaine non sécurisé ou non autorisé
  if (!isDomainAllowed) {
    return <UntrustedDomainState />;
  }

  // 6. État par défaut : Décompte en cours actif
  return (
    <CountdownState
      seconds={seconds}
      countdownMax={countdownMax}
      onRedirectNow={onRedirectNow}
      onCancel={onCancel}
    />
  );
}