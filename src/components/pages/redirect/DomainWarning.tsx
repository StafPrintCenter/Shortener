import { ShieldAlert } from "lucide-react";
import { SITE } from "@/data/site";

export function DomainWarning() {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-xs leading-relaxed">
        <span className="font-semibold">Domaine non reconnu :</span> cette
        destination ne correspond pas à un domaine {SITE.name} autorisé.
        La redirection automatique a été désactivée par précaution.
      </p>
    </div>
  );
}