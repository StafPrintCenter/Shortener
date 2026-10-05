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
    id: "propriete",
    title: "9. Propriété intellectuelle",
    paragraphs: [
      `La marque, la charte graphique, les composants visuels et le code de ${SITE.tool} sont la propriété exclusive de ${SITE.name}. Toute reproduction ou exploitation non autorisée est interdite.`,
      "Les logos, titres et images extraits des sites de destination demeurent la propriété exclusive de leurs détenteurs respectifs.",
    ],
  },
  {
    id: "droit",
    title: "10. Droit applicable & Règlement des litiges",
    paragraphs: [
      `Les présentes CGU sont régies par le droit en vigueur en République du Bénin. En cas de différend relatif à l'interprétation ou à l'exécution des présentes, les parties privilégieront une résolution amiable avant toute saisine des juridictions compétentes du ressort de Porto-Novo.`,
    ],
  },
];

export function CguPage() {
  return (
    <ShortShell>
      <main className="mx-auto w-full max-w-3xl px-4">
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          {/* Main Content */}
          <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

          <div className="relative mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
            {/* Badge & Title */}
            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Scale className="h-3.5 w-3.5 text-primary" />
                Cadre légal & Transparence
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Conditions Générales d'Utilisation
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Plateforme <strong className="text-foreground">{SITE.tool}</strong> · Éditée par{" "}
                <strong className="text-foreground">{SITE.name}</strong> ({SITE.city})
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dernière mise à jour : {LAST_UPDATE_DATE}
              </p>
            </div>

            {/* Quick Notice */}
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p>
                En empruntant un lien de redirection géré par{" "}
                <span className="font-semibold text-foreground">{SITE.tool}</span>, vous bénéficiez
                d'un contrôle d'intégrité préalable. Ces conditions précisent vos droits, les règles
                d'usage et les limites de garantie applicables.
              </p>
            </div>

            {/* Sections List */}
            <div className="mt-10 space-y-6">
              {SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-panel"
                >
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Contact Box */}
            <section className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <h3>11. Contact & Réclamations</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pour toute question sur l'application de ces conditions ou pour notifier un contenu
                litigieux, vous pouvez joindre l'équipe de{" "}
                <strong className="text-foreground">{SITE.name}</strong> à l'adresse suivante :{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                >
                  {SITE.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </ShortShell>
  );
}
