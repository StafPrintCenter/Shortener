import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  ShieldAlert,
  Info,
  ExternalLink,
  Globe,
  ArrowRight,
  CheckCircle2,
  Loader2,
  X,
  ImageOff,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { fetchShortlinkByAlias } from "@/stores/useShortlinksStore";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import { useServerFn } from "@tanstack/react-start";
import logo from "@/assets/logos.json";
import { cn } from "@/lib/utils";

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
const ALLOWED_DOMAIN = "stafprintcenter.com";

function RedirectPage() {
  const { alias } = useParams({ from: "/r/$alias" });

  // ⚠️ Suppose un endpoint GET /api/public/shortlinks/get/{alias} à confirmer côté backend —
  // resolve/create ne fonctionnent que par long_url, pas par alias.
  const { data: shortlink, isLoading: isLoadingLink, isError: linkError } = useQuery({
    queryKey: ["shortlink", "by-alias", alias],
    queryFn: () => fetchShortlinkByAlias(alias),
    staleTime: 5 * 60 * 1000,
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

  useEffect(() => {
    if (redirected || cancelled || !longUrl) return;

    if (seconds <= 0) {
      setRedirected(true);
      toast.success("Redirection effectuée en toute sécurité.", {
        description: meta?.domain ?? domain,
      });
      window.location.href = longUrl;
      return;
    }

    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, redirected, cancelled, meta?.domain, longUrl]);

  function redirectNow() {
    if (redirected || cancelled || !longUrl) return;
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
  const isAllowedDomain = domain === ALLOWED_DOMAIN || domain.endsWith(`.${ALLOWED_DOMAIN}`);

  const status = isAllowedDomain
    ? {
      icon: ShieldCheck,
      label: "Domaine STAF PRINT CENTER vérifié",
      className: "border-success/30 bg-success/10 text-success",
    }
    : {
      icon: ShieldAlert,
      label: "Domaine non reconnu — vérifiez ce lien",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    };
  const StatusIcon = status.icon;

  const title = meta?.title ?? shortlink?.category ?? "Contenu STAF PRINT CENTER";

  // Countdown ring geometry
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / COUNTDOWN);

  if (!isLoadingLink && (linkError || !shortlink)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <X className="h-8 w-8" />
        </span>
        <h1 className="text-lg font-semibold">Lien introuvable</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ce lien court n'existe pas ou n'est plus actif. Vérifiez l'adresse ou revenez à l'accueil.
        </p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
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
          {/* Security info bar */}
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-border bg-accent/60 px-4 py-3 text-accent-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs leading-relaxed">
              <span className="font-semibold">SPC Redirect — le raccourcisseur officiel STAF PRINT CENTER :</span>{" "}
              ce lien ne peut mener que vers un contenu STAF PRINT CENTER. Vérifiez toujours le domaine
              affiché avant de poursuivre.
            </p>
          </div>

          <div className="grid gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-panel lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-border">
            {/* Colonne gauche — destination et logo */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <img src={logo.dc} alt="Logo STAF PRINT CENTER" className="h-9 w-auto" />
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                    status.className,
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
              </div>

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
                    <img
                      src={meta.image}
                      alt={title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
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

              {/* Actions */}
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