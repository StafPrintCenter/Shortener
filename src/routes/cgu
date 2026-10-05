import { createFileRoute } from "@tanstack/react-router";
import { BriefShell } from "@/components/site";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Conditions Générales d'Utilisation - ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Conditions générales d'utilisation de la plateforme ${SITE.tool} : données personnelles, devis gratuit, propriété intellectuelle et délais.`;

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

const SECTIONS = [
  {
    title: "1. Objet",
    body: `${SITE.tool} est un service gratuit édité par ${SITE.name} (Porto-Novo, Bénin). Il permet à toute personne de formaliser un besoin en impression, identité visuelle, packaging ou solution digitale, puis de le transmettre à notre équipe commerciale.`,
  },
  {
    title: "2. Données personnelles",
    body: `Les briefs sont enregistrés dans la mémoire de votre navigateur (stockage local) et ne sont transmis à ${SITE.name} que lorsque vous décidez de les envoyer. Les informations collectées servent exclusivement au traitement de votre demande et ne sont ni revendues, ni cédées à des tiers. Vous pouvez supprimer un brief à tout moment depuis la page « Mes briefs ».`,
  },
  {
    title: "3. Devis gratuit et sans engagement",
    body: "L'envoi d'un brief ne constitue ni une commande, ni un engagement contractuel. Le devis établi à partir de vos informations est gratuit et valable trente (30) jours. Toute commande ferme fait l'objet d'un bon de commande signé.",
  },
  {
    title: "4. Propriété intellectuelle",
    body: `Les créations graphiques réalisées par ${SITE.name} demeurent sa propriété jusqu'au règlement intégral de la prestation. Le client garantit détenir les droits sur les éléments qu'il transmet (logos, photographies, textes) et assume l'entière responsabilité de leur utilisation.`,
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
    <BriefShell>
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
    </BriefShell>
  );
}
