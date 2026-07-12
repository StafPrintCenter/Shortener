import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, PageFooter } from "@/components/site";
import { fetchShortlinkByAlias } from "@/stores/useShortlinksStore";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import { FRONTEND_ORIGIN, urlAuthority } from "@/lib/domain";

// Importations des sous-composants locaux isolés
import { DomainWarning } from "@/components/pages/redirect/DomainWarning";
import { MetadataPreview } from "@/components/pages/redirect/MetadataPreview";
import { RedirectControlPanel } from "@/components/pages/redirect/ControlPanel";

export const Route = createFileRoute("/r/$alias")({
  head: ({ params }) => ({
    meta: [
      { title: `Redirection STAF PRINT CENTER · /r/${params.alias}` },
      {
        name: "description",
        content:
          "Page de redirection SPC Redirect — le raccourcisseur officiel de STAF PRINT CENTER. Vérifiez la destination avant de poursuivre.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedirectPage,
});

const COUNTDOWN = 5;
const BACKEND_URL = import.meta.env.VITE_API_ORIGIN;

function RedirectPage() {
  const { alias } = useParams({ from: "/r/$alias" });

  // 1. Collecte des données du lien court
  const { data: shortlink, isLoading: isLoadingLink, isError: linkError } = useQuery({
    queryKey: ["shortlink", "by-alias", alias],
    queryFn: () => fetchShortlinkByAlias(alias),
    staleTime: 1000 * 60,
  });

  const longUrl = shortlink?.longUrl ?? "";

  // 2. Récupération distante des métadonnées du site cible
  const fetchMeta = useServerFn(fetchSiteMetadata);
  const { data: meta, isLoading: isLoadingMeta } = useQuery({
    queryKey: ["site-metadata", longUrl],
    queryFn: () => fetchMeta({ data: { url: longUrl } }),
    enabled: !!longUrl,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingLink || isLoadingMeta;

  // 3. Gestion de l'état local du processus de redirection
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const realRedirectUrl = `${BACKEND_URL}/r/${alias}`;
  const isBlocked = shortlink && (shortlink.status !== "active" || shortlink.isActive === false);
  const isDomainAllowed = longUrl ? urlAuthority(longUrl) === urlAuthority(FRONTEND_ORIGIN) : true;
  const domain = longUrl ? new URL(longUrl).hostname.replace(/^www\./, "") : "";
  const canRedirect = !!longUrl && !isBlocked && isDomainAllowed;

  // 4. Cycle de vie du compte à rebours automatique
  useEffect(() => {
    if (redirected || cancelled || !canRedirect) return;

    if (seconds <= 0) {
      setRedirected(true);
      toast.success("Redirection effectuée en toute sécurité.", {
        description: domain,
      });
      window.location.href = realRedirectUrl;
      return;
    }

    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, redirected, cancelled, canRedirect, domain, realRedirectUrl]);

  // Actions de contrôle utilisateur
  const redirectNow = () => !redirected && !cancelled && canRedirect && setSeconds(0);
  const cancel = () => {
    if (redirected) return;
    setCancelled(true);
    toast("Redirection annulée.", { description: "Vous n'avez pas été dirigé vers la destination." });
  };
  const resume = () => {
    setCancelled(false);
    setSeconds(COUNTDOWN);
  };

  const notFound = !isLoadingLink && (linkError || !shortlink);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader>
        <span className="font-mono text-xs text-muted-foreground">/r/{alias}</span>
      </PageHeader>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

        <div className="relative w-full max-w-4xl">
          {/* Alerte si le domaine cible n'est pas autorisé par l'organisation */}
          {!notFound && !isBlocked && !isDomainAllowed && <DomainWarning />}

          <div className="grid gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-panel lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">

            {/* Colonne Gauche : Affichage des métadonnées du site ciblé */}
            <MetadataPreview
              notFound={notFound}
              isLoading={isLoading}
              shortlink={shortlink}
              meta={meta}
              domain={domain}
              longUrl={longUrl}
            />

            {/* Colonne Droite : États de redirection et Compte à rebours */}
            <RedirectControlPanel
              notFound={notFound}
              isBlocked={!!isBlocked}
              isDomainAllowed={isDomainAllowed}
              redirected={redirected}
              cancelled={cancelled}
              seconds={seconds}
              countdownMax={COUNTDOWN}
              shortlink={shortlink}
              domain={domain}
              onResume={resume}
              onRedirectNow={redirectNow}
              onCancel={cancel}
            />

          </div>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}