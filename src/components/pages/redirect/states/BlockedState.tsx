import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

interface BlockedStateProps {
  shortlink: any;
  renderReportTrigger: () => React.ReactNode;
}

export function BlockedState({ shortlink, renderReportTrigger }: BlockedStateProps) {
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
          : `Contactez ${SITE.name} si vous pensez qu'il s'agit d'une erreur.`}
      </p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
        <Button asChild size="lg" variant="outline" className="w-full">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
        <div className="flex items-center justify-center pt-1">
          {renderReportTrigger()}
        </div>
      </div>
    </div>
  );
}