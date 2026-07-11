import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldAlert, Info, ExternalLink, Globe, ArrowRight, CheckCircle2, Loader2, X, ImageOff, ShieldAlert as AlertIcon } from "lucide-react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/report-dialog";
import { Button } from "@/components/ui/button";
import { getLinkEntry } from "@/lib/links";
import { fetchSiteMetadata } from "@/lib/metadata.functions";
import logo from "@/assets/logos.json";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/r/$alias")({
  head: ({ params }) => ({
    meta: [
      { title: `Vérification de sécurité · /r/${params.alias} — STAF PRINT` },
      {
        name: "description",
        content:
          "Service de sécurisation et de redirection transparente DomainGuard par STAF PRINT. Analyse préventive des liens.",
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
    queryFn: () => fetchMeta({ data: { url: entry.url } }),
    staleTime: 5 * 60 * 1000,
  });

  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [redirected, setRedirected] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (redirected || cancelled) return;

    if (seconds <= 0) {
      setRedirected(true);
      toast.success("Redirection sécurisée établie.", {
        description: meta?.domain ?? entry.url,
      });

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
    toast("Flux interrompu par l'utilisateur.", {
      description: "La redirection automatique a été suspendue.",
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
      label: "Lien vérifié & sûr",
      className: "border-success/30 bg-success/10 text-success",
    }
    : {
      icon: ShieldAlert,
      label: "Attention requise",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    };
  const StatusIcon = status.icon;

  const domain = meta?.domain ?? new URL(entry.url).hostname;
  const title = meta?.title ?? entry.label;

  // Countdown geometry
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (seconds / COUNTDOWN);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      {/* Top Header Minimaliste */}
      <header className="border-b border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="text-sm font-bold tracking-tight text-foreground">STAF PRINT</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase">
              DomainGuard
            </span>
          </Link>
          <span className="font-mono text-xs text-muted-foreground/80">
            ID: /r/{alias}
          </span>
        </div>
      </header>

      {/* Main Layout en 2 colonnes sur lg */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10 lg:py-16">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-30" />

        <div className="relative mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-12">

          {/* COLONNE GAUCHE : Statut & Actions (7 colonnes sur grands écrans) */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* Logo inséré directement au-dessus du bloc interactif principal */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <Link to="/" className="transition-transform hover:scale-[1.01]">
                <img src={logo.dc} alt="STAF PRINT" className="h-12 w-auto dark:invert-[0.1]" />
              </Link>
            </div>

            {/* Info bar réglementaire STAF PRINT */}
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-accent/40 px-4 py-3 text-accent-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed">
                <span className="font-semibold text-foreground">Passerelle de sécurité active :</span>{" "}
                Ce lien transite par l'infrastructure de routage **STAF PRINT**. Nous analysons l'intégrité de la cible pour empêcher le typosquatting et le phishing.
              </p>
            </div>

            {/* Panneau d'action interactif */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-panel">
              <div className="flex flex-col items-center px-6 py-8 text-center lg:px-8">
                {redirected ? (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                    </span>
                    <h1 className="mt-4 text-xl font-bold tracking-tight">Transmission sécurisée</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Vous êtes en cours de redirection vers le noeud certifié : <br />
                      <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground font-medium">{domain}</span>
                    </p>
                  </>
                ) : cancelled ? (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <X className="h-8 w-8" strokeWidth={2} />
                    </span>
                    <h1 className="mt-4 text-xl font-bold tracking-tight">Redirection suspendue</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Par mesure de sécurité, le compte à rebours a été figé.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="relative h-20 w-20">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          fill="none"
                          stroke="var(--color-border)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r={radius}
                          fill="none"
                          stroke="var(--color-primary)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashoffset}
                          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums">
                        {seconds}
                      </span>
                    </div>
                    <h1 className="mt-4 text-xl font-bold tracking-tight">Analyse préventive en cours…</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ouverture automatique du lien externe dans {seconds} seconde{seconds > 1 ? "s" : ""}.
                    </p>
                  </>
                )}

                {/* Boutons de contrôle */}
                <div className="mt-6 flex w-full flex-col gap-2.5">
                  {cancelled ? (
                    <Button size="lg" className="w-full" onClick={resume}>
                      Reprendre le processus
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="lg"
                        className="w-full font-medium"
                        onClick={redirectNow}
                        disabled={redirected}
                      >
                        {redirected ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Accès autorisé
                          </>
                        ) : (
                          <>
                            Poursuivre immédiatement
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      {!redirected && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full text-muted-foreground hover:text-foreground"
                          onClick={cancel}
                        >
                          <X className="h-4 w-4" />
                          Interrompre et inspecter
                        </Button>
                      )}
                    </>
                  )}

                  <div className="mt-2 flex items-center justify-center border-t border-border/40 pt-4 w-full">
                    <ReportDialog alias={alias} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Métadonnées du Domaine (5 colonnes sur grands écrans) */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Fiche d'identité du site
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  status.className,
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Image d'aperçu du site cible */}
              <div className="relative aspect-[16/9] w-full border-b border-border bg-muted/50">
                {isLoading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : meta?.image ? (
                  <img
                    src={meta.image}
                    alt={title}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground/70">
                    <ImageOff className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Aperçu visuel non disponible</span>
                  </div>
                )}
              </div>

              {/* Contenu textuel enrichi */}
              <div className="p-4 sm:p-5">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold leading-snug text-foreground">
                      {title || "Page Web externe sans titre"}
                    </h3>
                    {meta?.description && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {meta.description}
                      </p>
                    )}
                  </>
                )}

                {/* Liens techniques isolés */}
                <div className="mt-4 space-y-2.5 border-t border-border/60 pt-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span className="text-foreground font-medium">{domain}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <span className="break-all text-[11px] leading-tight text-muted-foreground/90">{entry.url}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-secondary/40 p-2.5 text-[10px] text-muted-foreground">
                  Analyse temps réel effectuée par **STAF PRINT DomainGuard**. Veillez à ne pas fournir vos clés d'accès ou identifiants sur une plateforme dont vous ne reconnaissez pas la légitimité.
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Institutionnel */}
      <footer className="border-t border-border/40 py-4 text-center text-[11px] text-muted-foreground/70">
        <p>© 2026 STAF PRINT · Solution intégrée DomainGuard · Tous droits réservés.</p>
      </footer>
    </div>
  );
}