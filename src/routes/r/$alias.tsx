import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Globe, ArrowRight, CheckCircle2, Loader2, X, ImageOff, BarChart3, Clock, Tag, ShieldAlert, } from "lucide-react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { PageFooter } from "@/components/site/PageFooter";
import { fetchShortlinkByAlias } from "@/stores/useShortlinksStore";
import { getShortlinkCategoryLabel } from "@/data/shortlinks";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import { FRONTEND_ORIGIN, urlAuthority } from "@/lib/domain";

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

  const { data: shortlink, isLoading: isLoadingLink, isError: linkError } = useQuery({
    queryKey: ["shortlink", "by-alias", alias],
    queryFn: () => fetchShortlinkByAlias(alias),
    staleTime: 1000 * 60,
  });

  const longUrl = shortlink?.longUrl ?? "";

  const fetchMeta = useServerFn(fetchSiteMetadata);
  const { data: meta, isLoading: isLoadingMeta } = useQuery({
    queryKey: ["site-metadata", longUrl],
    queryFn: () => fetchMeta({ data: { url: longUrl } }),
    enabled: !!longUrl,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingLink || isLoadingMeta;

  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const realRedirectUrl = `${BACKEND_URL}/r/${alias}`;
  const isBlocked = shortlink && (shortlink.status !== "active" || shortlink.isActive === false);
  const isDomainAllowed = longUrl ? urlAuthority(longUrl) === urlAuthority(FRONTEND_ORIGIN) : true;
  const domain = longUrl ? new URL(longUrl).hostname.replace(/^www\./, "") : "";
  const canRedirect = !!longUrl && !isBlocked && isDomainAllowed;

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
  }, [seconds, redirected, cancelled, canRedirect]);

  function redirectNow() {
    if (redirected || cancelled || !canRedirect) return;
    setSeconds(0);
  }

  function cancel() {
    if (redirected) return;
    setCancelled(true);
    toast("Redirection annulée.", {
      description: "Vous n'avez pas été dirigé vers la destination.",
    });
  }

  function resume() {
    setCancelled(false);
    setSeconds(COUNTDOWN);
  }

  const title = meta?.title ?? "Contenu STAF PRINT CENTER";
  const categoryLabel = shortlink ? getShortlinkCategoryLabel(shortlink.category) : null;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / COUNTDOWN);

  const notFound = !isLoadingLink && (linkError || !shortlink);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader>
        <span className="font-mono text-xs text-muted-foreground">
          /r/{alias}
        </span>
      </PageHeader>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

        <div className="relative w-full max-w-4xl">
          {!notFound && !isBlocked && !isDomainAllowed && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs leading-relaxed">
                <span className="font-semibold">Domaine non reconnu :</span>{" "}
                cette destination ne correspond pas à un domaine STAF PRINT CENTER autorisé.
                La redirection automatique a été désactivée par précaution.
              </p>
            </div>
          )}

          <div className="grid gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-panel lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
            {/* Colonne gauche — destination (toujours affichée, même si introuvable) */}
            <div className="p-6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Destination
              </p>

              {notFound ? (
                <div className="mt-2 flex h-full min-h-70 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ImageOff className="h-6 w-6" />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Aucune information disponible pour ce lien.
                  </p>
                </div>
              ) : (
                <div className="mt-2 overflow-hidden rounded-lg border border-border bg-secondary/50">
                  <div className="relative aspect-[1.9/1] w-full border-b border-border bg-muted">
                    {isLoading ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : meta?.image ? (
                      <img src={meta.image} alt={title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                        <ImageOff className="h-6 w-6" />
                        <span className="text-xs">Aperçu indisponible</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {categoryLabel && (
                      <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        {categoryLabel}
                      </span>
                    )}

                    {isLoading ? (
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    ) : (
                      <p className="text-sm font-semibold leading-snug">{title}</p>
                    )}

                    {meta?.description ? (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {meta.description}
                      </p>
                    ) : null}

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-mono text-foreground">{domain}</span>
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="break-all font-mono">{longUrl}</span>
                      </div>
                      {typeof shortlink?.clicksCount === "number" && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                          <span>{shortlink.clicksCount} clic{shortlink.clicksCount > 1 ? "s" : ""} enregistré{shortlink.clicksCount > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
                      Métadonnées extraites en direct · Lien STAF PRINT CENTER vérifié
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne droite — état (introuvable / bloqué / countdown / actions) */}
            <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
              {notFound ? (
                <>
                  <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <X className="h-10 w-10" strokeWidth={2} />
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
                </>
              ) : isBlocked ? (
                (() => {
                  const isPending = shortlink!.activateAt && new Date(shortlink!.activateAt) > new Date();
                  const isExpired = shortlink!.expiresAt && new Date(shortlink!.expiresAt) < new Date();
                  return (
                    <>
                      <span className="flex h-21 w-21 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Clock className="h-10 w-10" strokeWidth={2} />
                      </span>
                      <h1 className="mt-4 text-lg font-semibold">
                        {isPending ? "Ce lien n'est pas encore actif" : isExpired ? "Ce lien a expiré" : "Ce lien est désactivé"}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isPending
                          ? `Il sera disponible à partir du ${new Date(shortlink!.activateAt!).toLocaleDateString("fr-FR")}.`
                          : "Contactez STAF PRINT CENTER si vous pensez qu'il s'agit d'une erreur."}
                      </p>
                      <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                        <Button asChild size="lg" variant="outline" className="w-full">
                          <Link to="/">Retour à l'accueil</Link>
                        </Button>
                        <div className="flex items-center justify-center pt-1">
                          <ReportDialog shortlinkId={shortlink?.id} />
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : redirected ? (
                <>
                  <span className="flex h-21 w-21 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
                  </span>
                  <h1 className="mt-4 text-lg font-semibold">Redirection effectuée</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous avez été dirigé en toute sécurité vers{" "}
                    <span className="font-mono text-foreground">{domain}</span>
                  </p>
                </>
              ) : cancelled ? (
                <>
                  <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <X className="h-10 w-10" strokeWidth={2} />
                  </span>
                  <h1 className="mt-4 text-lg font-semibold">Redirection annulée</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous pouvez reprendre la redirection à tout moment.
                  </p>
                  <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                    <Button size="lg" className="w-full" onClick={resume}>
                      Reprendre la redirection
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center pt-1">
                      <ReportDialog shortlinkId={shortlink?.id} />
                    </div>
                  </div>
                </>
              ) : !isDomainAllowed ? (
                <>
                  <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <ShieldAlert className="h-10 w-10" strokeWidth={2} />
                  </span>
                  <h1 className="mt-4 text-lg font-semibold">Redirection désactivée</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Le domaine de destination n'a pas pu être vérifié. Consultez les informations
                    ci-contre avant de continuer manuellement.
                  </p>
                  <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                    <Button size="lg" className="w-full" disabled>
                      Rediriger maintenant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative h-21 w-21">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="5" />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums">
                      {seconds}
                    </span>
                  </div>
                  <h1 className="mt-4 text-lg font-semibold">Redirection en cours…</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous serez redirigé vers STAF PRINT CENTER dans {seconds}{" "}
                    seconde{seconds > 1 ? "s" : ""}.
                  </p>

                  <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                    <Button size="lg" className="w-full" onClick={redirectNow}>
                      Rediriger maintenant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" onClick={cancel}>
                      <X className="h-4 w-4" />
                      Annuler
                    </Button>
                    {/* ReportDialog masqué pendant le décompte — visible uniquement après annulation */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}