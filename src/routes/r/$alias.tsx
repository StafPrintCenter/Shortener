import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, PageFooter } from "@/components/site";
import { fetchShortlinkByAlias } from "@/stores/useShortlinksStore";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import { FRONTEND_ORIGIN, urlAuthority } from "@/lib/domain";
import { DomainWarning, MetadataPreview, RedirectControlPanel } from "@/components/pages/redirect";

export const Route = createFileRoute("/r/$alias")({
  // 1. Le Loader s'exécute côté serveur au premier chargement
  loader: async ({ params }) => {
    let shortlink = null;
    let meta = null;

    try {
      shortlink = await fetchShortlinkByAlias(params.alias);

      if (shortlink?.longUrl) {
        meta = await fetchSiteMetadata({ data: { url: shortlink.longUrl } });
      }
    } catch (error) {
      console.error("Erreur de pré-rendu des métadonnées :", error);
    }

    return {
      initialShortlink: shortlink,
      initialMeta: meta,
    };
  },

  // 2. On utilise le paramètre direct 'loaderData' fourni par TanStack
  head: ({ loaderData, params }) => {
    const title = loaderData?.initialMeta?.title ?? `Redirection STAF PRINT CENTER · /r/${params.alias}`;
    const description = loaderData?.initialMeta?.description ?? "Page de redirection SPC Redirect — Vérifiez la destination avant de poursuivre.";
    const image = loaderData?.initialMeta?.image ?? null;
    const domain = loaderData?.initialMeta?.domain ?? "spc.redirect";
    const targetUrl = loaderData?.initialMeta?.url ?? "";

    return {
      meta: [
        { name: "title", content: title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },

        // Open Graph (Discord, WhatsApp, LinkedIn, Facebook)
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: domain },
        ...(image ? [{ property: "og:image", content: image }] : []),
        ...(targetUrl ? [{ property: "og:url", content: targetUrl }] : []),

        // Twitter Cards
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
    };
  },
  component: RedirectPage,
});

const COUNTDOWN = 10;
const BACKEND_URL = import.meta.env.VITE_API_ORIGIN;

function RedirectPage() {
  const { alias } = useParams({ from: "/r/$alias" });
  const { initialShortlink, initialMeta } = Route.useLoaderData();
  const fetchMeta = useServerFn(fetchSiteMetadata);

  const { data: shortlink, isLoading: isLoadingLink, isError: linkError } = useQuery({
    queryKey: ["shortlink", "by-alias", alias],
    queryFn: () => fetchShortlinkByAlias(alias),
    initialData: initialShortlink ?? undefined,
    staleTime: 1000 * 60,
  });

  const longUrl = shortlink?.longUrl ?? "";

  const { data: meta, isLoading: isLoadingMeta } = useQuery({
    queryKey: ["site-metadata", longUrl],
    queryFn: () => fetchMeta({ data: { url: longUrl } }),
    enabled: !!longUrl,
    initialData: initialMeta ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = (!shortlink && isLoadingLink) || (!meta && isLoadingMeta);

  // Gestion de l'état local du processus de redirection
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const realRedirectUrl = `${BACKEND_URL}/r/${alias}`;
  const isBlocked = shortlink && (shortlink.status !== "active" || shortlink.isActive === false);
  const isDomainAllowed = longUrl ? urlAuthority(longUrl) === urlAuthority(FRONTEND_ORIGIN) : true;
  const domain = longUrl ? new URL(longUrl).hostname.replace(/^www\./, "") : "";
  const canRedirect = !!longUrl && !isBlocked && isDomainAllowed;

  // Cycle de vie du compte à rebours automatique
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

  const notFound = !isLoadingLink && (!!linkError || !shortlink);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader>
        <span className="font-mono text-xs text-muted-foreground">/r/{alias}</span>
      </PageHeader>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

        <div className="relative w-full max-w-4xl">
          {!notFound && !isBlocked && !isDomainAllowed && <DomainWarning />}

          <div className="grid gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-panel lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">

            <MetadataPreview
              notFound={notFound}
              isLoading={isLoading}
              shortlink={shortlink}
              meta={meta}
              domain={domain}
              longUrl={longUrl}
            />

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