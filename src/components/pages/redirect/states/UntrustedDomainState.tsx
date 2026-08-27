import { ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UntrustedDomainState() {
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