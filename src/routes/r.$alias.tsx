import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
} from "lucide-react";
import { toast } from "sonner";

import { BrandMark } from "@/components/brand-mark";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { getLinkEntry } from "@/lib/links";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/r/$alias")({
  head: ({ params }) => ({
    meta: [
      { title: `Redirection sécurisée · /r/${params.alias} — SPC Redirect` },
      {
        name: "description",
        content:
          "Page de redirection transparente SPC Redirect. Vérifiez la destination avant de poursuivre.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedirectPage,
});

const COUNTDOWN = 5;

function RedirectPage() {
  const { alias } = useParams({ from: "/r/$alias" });
  const entry = useMemo(() => getLinkEntry(alias), [alias]);

  const fetchMeta = useServerFn(fetchSiteMetadata);
  const { data: meta, isLoading } = useQuery({
    queryKey: ["site-metadata", entry.url],
    // CORRECTION ICI : Grâce à la mise à jour de .validator(), on passe directement l'objet attendu par Zod
    queryFn: () => fetchMeta({ url: entry.url }),
    staleTime: 5 * 60 * 1000,
  });

  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (redirected || cancelled) return;

    if (seconds <= 0) {
      setRedirected(true);
      toast.success("Redirection effectuée en toute sécurité.", {
        description: meta?.domain ?? entry.url,
      });

      // CORRECTION ICI : Déclenchement de la redirection réelle du navigateur
      window.location.href = entry.url;
      return;
    }

    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, redirected, cancelled, meta?.domain, entry.url]);

  function redirectNow() {
    if (redirected || cancelled) return;
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

  const safe = meta?.safe ?? true;
  const status = safe
    ? {
      icon: ShieldCheck,
      label: "Vérifié sécurisé",
      className: "border-success/30 bg-success/10 text-success",
    }
    : {
      icon: ShieldAlert,
      label: "Prudence recommandée",
      className:
        "border-destructive/30 bg-destructive/10 text-destructive",
    };
  const StatusIcon = status.icon;

  const domain = meta?.domain ?? new URL(entry.url).hostname;
  const title = meta?.title ?? entry.label;

  // Countdown ring geometry
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / COUNTDOWN);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <BrandMark />
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            /r/{alias}
          </span>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-50" />

        <div className="relative w-full max-w-lg">
          {/* Security info bar */}
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-border bg-accent/60 px-4 py-3 text-accent-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs leading-relaxed">
              <span className="font-semibold">
                Contrôle d'intégrité SPC Redirect :
              </span>{" "}
              ce lien a été analysé. Vérifiez toujours le domaine de destination
              avant de saisir vos identifiants.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
            {/* Countdown header */}
            <div className="flex flex-col items-center border-b border-border px-6 py-8 text-center">
              {redirected ? (
                <>
                  <span className="flex h-21 w-21 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
                  </span>
                  <h1 className="mt-4 text-lg font-semibold">
                    Redirection effectuée
                  </h1>
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
                  <h1 className="mt-4 text-lg font-semibold">
                    Redirection annulée
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous pouvez reprendre la redirection à tout moment.
                  </p>
                </>
              ) : (
                <>
                  <div className="relative h-21 w-21">
                    <svg
                      className="h-full w-full -rotate-90"
                      viewBox="0 0 80 80"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="5"
                      />
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
                  <h1 className="mt-4 text-lg font-semibold">
                    Redirection en cours…
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vous serez redirigé automatiquement dans {seconds}{" "}
                    seconde{seconds > 1 ? "s" : ""}.
                  </p>
                </>
              )}
            </div>

            {/* Metadata */}
            <div className="px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Destination
                </span>
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

              <div className="overflow-hidden rounded-lg border border-border bg-secondary/50">
                {/* Extracted preview image */}
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
                    <p className="text-sm font-semibold leading-snug">
                      {title}
                    </p>
                  )}

                  {meta?.description ? (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      {meta.description}
                    </p>
                  ) : null}

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono text-foreground">
                        {domain}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="break-all font-mono">{entry.url}</span>
                    </div>
                  </div>

                  <p className="mt-3 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
                    Métadonnées extraites en direct · Protégé par SPC Redirect
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-2.5">
                {cancelled ? (
                  <Button size="lg" className="w-full" onClick={resume}>
                    Reprendre la redirection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={redirectNow}
                      disabled={redirected}
                    >
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
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={cancel}
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </>
                )}

                <div className="flex items-center justify-center">
                  <ReportDialog alias={alias} />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            © 2026 SPC Redirect. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  );
}
