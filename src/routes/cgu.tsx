import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Mail, Scale } from "lucide-react";
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
    id: "liens-interdits",
    title: "5. Usages interdits & Protection des utilisateurs",
    paragraphs: [
      `Il est strictement interdit d'utiliser ${SITE.tool} pour diffuser des liens pointant vers des contenus frauduleux (hameçonnage / phishing), des logiciels malveillants, des escroqueries financières ou tout contenu contraire à l'ordre public et aux bonnes mœurs.`,
      `${SITE.name} se réserve le droit de neutraliser, désactiver ou supprimer sans préavis tout alias suspect ou avéré nuisible.`,
    ],
  },
  {
    id: "signalement",
    title: "6. Procédure de signalement d'abus",
    paragraphs: [
      "Chaque page de redirection intègre un bouton « Signaler un problème » permettant à toute personne de notifier un lien suspect en précisant le motif (phishing, spam, contenu malveillant, autre).",
      `Les signalements sont instruits par l'équipe technique de ${SITE.name} afin de prendre les mesures conservatoires appropriées (suspension d'alias, blocage de domaine).`,
    ],
  },
  {
    id: "responsabilite",
    title: "7. Responsabilité & Liens tiers",
    paragraphs: [
      `${SITE.name} déploie ses meilleurs efforts pour assurer une haute disponibilité du service ${SITE.tool}. Toutefois, sa responsabilité ne saurait être engagée en cas d'interruption momentanée, d'indisponibilité du réseau ou d'indisponibilité du site tiers ciblé.`,
      `${SITE.name} n'exerçant aucun contrôle sur les sites externes vers lesquels pointent les liens redirigés, l'utilisateur navigue sur ces plateformes tierces sous sa propre responsabilité.`,
    ],
  },
  {
    id: "donnees",
    title: "8. Données personnelles & Confidentialité",
    paragraphs: [
      `${SITE.tool} privilégie la minimisation des données : le service n'exige la création d'aucun compte public et n'utilise pas de traceurs publicitaires intrusifs. Les éventuelles préférences d'affichage (ex. thème clair/sombre) sont enregistrées localement dans votre navigateur.`,
      "Les informations transmises lors d'un signalement sont exclusivement exploitées aux fins d'investigation de sécurité et d'assainissement du service.",
    ],
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
