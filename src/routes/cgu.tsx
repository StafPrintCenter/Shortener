import { createFileRoute } from "@tanstack/react-router";
import { ShortShell } from "@/components/site";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Conditions Générales d'Utilisation - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Conditions Générales d'Utilisation de la plateforme ${SITE.tool}. Fonctionnement des redirections, sécurité, signalements et responsabilités.`;
const LAST_UPDATE_DATE = "5 octobre 2026";

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
    id: "preambule",
    title: "1. Présentation & Éditeur du service",
    paragraphs: [
      `La plateforme ${SITE.tool} est un outil de redirection sécurisée et de raccourcissement de liens, conçu et édité par ${SITE.name}, établissement situé à ${SITE.city}.`,
      `Le service a pour vocation de renforcer la confiance numérique lors de la consultation de liens raccourcis en offrant un sas de vérification préalable avant toute redirection finale.`,
    ],
  },
  {
    id: "acceptation",
    title: "2. Acceptation des conditions",
    paragraphs: [
      `L'accès et l'utilisation de ${SITE.tool} (notamment l'accès aux pages de transit sous la forme /r/:alias) emportent l'acceptation pleine, entière et sans réserve des présentes Conditions Générales d'Utilisation (CGU).`,
      "Si un utilisateur refuse tout ou partie de ces stipulations, il lui est expressément recommandé d'interrompre la navigation ou de cliquer sur le bouton « Annuler » disponible sur chaque page d'interstitiel.",
    ],
  },
  {
    id: "fonctionnement",
    title: "3. Fonctionnement de la redirection & Compte à rebours",
    paragraphs: [
      `Lorsqu'un utilisateur ouvre un lien ${SITE.tool}, une page d'attente affiche un compte à rebours de 10 secondes ainsi que l'URL cible intégrale avant que la redirection automatique ne soit déclenchée.`,
      "L'utilisateur conserve à tout moment la faculté de suspendre le décompte en cliquant sur « Annuler », de le « Reprendre » à sa convenance, ou d'accélérer l'accès immédiat via « Rediriger maintenant ».",
    ],
  },
  {
    id: "metadonnees",
    title: "4. Extraction de métadonnées & Mention « Vérifié »",
    paragraphs: [
      `${SITE.tool} interroge en temps réel les balises publiques Open Graph (titre, description, visuel d'aperçu) publiées par le site de destination afin de donner une visibilité claire sur la ressource ciblée.`,
      `La mention « Vérifié sécurisé » atteste de la bonne conformité technique du lien et du protocole chiffré (HTTPS), mais ne constitue en aucun cas une certification d'innocuité absolue ni un aval éditorial de ${SITE.name} quant aux contenus édités par les éditeurs tiers.`,
    ],
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
