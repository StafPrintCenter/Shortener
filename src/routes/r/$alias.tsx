import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Globe, ArrowRight, CheckCircle2, Loader2, X, ImageOff, BarChart3, Clock, } from "lucide-react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { fetchShortlinkByAlias } from "@/stores/useShortlinksStore";
import { fetchSiteMetadata } from "@/lib/metadata.functions";

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
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:8000";

/** Reproduit la logique d'autorité de DomainGuard côté Laravel : host:port, port par défaut explicite */

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

  // Le vrai lien à suivre pour que le clic soit comptabilisé côté backend
  const realRedirectUrl = `${BACKEND_URL}/r/${alias}`;

  const isBlocked = shortlink && (shortlink.status !== "active" || shortlink.isActive === false);

  useEffect(() => {
    if (redirected || cancelled || !longUrl || isBlocked) return;

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
  }, [seconds, redirected, cancelled, longUrl, isBlocked]);

  function redirectNow() {
    if (redirected || cancelled || !longUrl || isBlocked) return;
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

  const domain = longUrl ? new URL(longUrl).hostname.replace(/^www\./, "") : "";
  const title = meta?.title ?? "Contenu STAF PRINT CENTER";

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / COUNTDOWN);

  // Lien introuvable
  if (!isLoadingLink && (linkError || !shortlink)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <X className="h-8 w-8" />
        </span>
        <h1 className="text-lg font-semibold">Lien introuvable</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ce lien court n'existe pas. Vérifiez l'adresse ou revenez à l'accueil.
        </p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  // Lien désactivé, en attente d'activation, ou expiré
  if (!isLoadingLink && isBlocked) {
    const isPending = shortlink!.activateAt && new Date(shortlink!.activateAt) > new Date();
    const isExpired = shortlink!.expiresAt && new Date(shortlink!.expiresAt) < new Date();

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Clock className="h-8 w-8" />
        </span>
        <h1 className="text-lg font-semibold">
          {isPending ? "Ce lien n'est pas encore actif" : isExpired ? "Ce lien a expiré" : "Ce lien est désactivé"}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isPending
            ? `Il sera disponible à partir du ${new Date(shortlink!.activateAt!).toLocaleDateString("fr-FR")}.`
            : "Contactez STAF PRINT CENTER si vous pensez qu'il s'agit d'une erreur."}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <ReportDialog alias={alias} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link to="/" className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-80">
            SPC Redirect
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            /r/{alias}
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

        <div className="relative w-full max-w-4xl">
          <div className="grid gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-panel lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
            {/* Colonne gauche — destination */}
            <div className="p-6 md:p-8">
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Destination
              </p>

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
            </div>

            {/* Colonne droite — countdown et actions */}
            <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
              {redirected ? (
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
                </>
              )}

              <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                {cancelled ? (
                  <Button size="lg" className="w-full" onClick={resume}>
                    Reprendre la redirection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="w-full" onClick={redirectNow} disabled={redirected}>
                      {redirected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Destination atteinte
                        </>
                      ) : (
                        <>
                          Rediriger maintenant
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {!redirected && (
                      <Button size="lg" variant="outline" className="w-full" onClick={cancel}>
                        <X className="h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </>
                )}

                <div className="flex items-center justify-center pt-1">
                  <ReportDialog alias={alias} />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © 2026 SPC Redirect · Le raccourcisseur officiel STAF PRINT CENTER. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  );
}