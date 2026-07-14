import { ShieldCheck, Eye, UserRoundX } from "lucide-react";
import { SITE } from "@/data/site";

const pillars = [
  {
    icon: ShieldCheck,
    title: `Exclusivement ${SITE.name}`,
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

export function PillarsSection() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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
    </div>
  );
}