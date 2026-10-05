import { createFileRoute } from "@tanstack/react-router";
import { ShortShell } from "@/components/site";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Conditions Générales d'Utilisation - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Conditions générales d'utilisation de la plateforme ${SITE.tool} : données personnelles, propriété intellectuelle et délais.`;

// Date de dernière mise à jour fixe
const LAST_UPDATE_DATE = "17 septembre 2026";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: CguPage,
});

interface CguSection {
  id: string;
  title: string;
  paragraphs: string[];
}

const SECTIONS: CguSection[] = [
  {
    title: "1. Préambule & objet",
    body: `${SITE.tool} est un service de redirection de liens courts édité par ${SITE.name} avec vérification préalable (aperçu titre/image/description) avant redirection vers la destination finale.`,
  },
  {
    title: "2. Acceptation des conditions",
    body: "L'utilisation du service (clic sur un lien /r/:alias) implique l'acceptation des présentes CGU.",
  },
  {
    title: "3. Description du service",
    body: "Fonctionnement de la redirection, délai de 10 secondes, bouton « Annuler », extraction de métadonnées depuis la destination réelle, mention « Vérifié sécurisé » (préciser que c'est une vérification d'intégrité technique, pas une garantie absolue de sécurité du contenu tiers).",
  },
  {
    title: "4. Signalement de liens",
    body: `Rôle du formulaire de signalement, traitement des signalements (actuellement non persistés en base réelle — à adapter si vous branchez un vrai backend plus tard).`,
  },
  {
    title: "5. Délais et production",
    body: `Les délais indiqués (Ultra Express, Standard, Planifié) sont donnés à titre indicatif et courent à partir de la validation du bon à tirer et du versement de l'acompte convenu. Les retards liés à la fourniture tardive d'éléments par le client ne peuvent être imputés à ${SITE.name}.`,
  },
  {
    title: "6. Retrait et livraison",
    body: "Les commandes peuvent être retirées dans nos locaux à Porto-Novo aux heures d'ouverture, ou livrées à l'adresse indiquée. Les frais de livraison varient selon la zone et sont précisés dans le devis.",
  },
  {
    title: "7. Modification des CGU",
    body: `${SITE.name} se réserve le droit de faire évoluer les présentes conditions. La version applicable est celle publiée sur cette page au moment de l'envoi du brief.`,
  },
];

function CguPage() {
  return (
    <ShortShell>
      <main className="mx-auto w-full max-w-3xl px-4">
        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
          Conditions Générales d'Utilisation
        </h1>
        <p className="mt-3 text-muted-foreground">
          Dernière mise à jour : {LAST_UPDATE_DATE}
        </p>

        <div className="mt-8 space-y-6">
          {SECTIONS.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </ShortShell>
  );
}
