import { Link } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
      <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleX className="h-10 w-10" strokeWidth={2} />
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