import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Eye,
  Link2,
  Lock,
  ScanLine,
  AlertTriangle,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/n")({
  component: Home,
});

const pillars = [
  {
    icon: ScanLine,
    title: "Vérification Documentaire",
    text: "Garantit que le lien redirige bien vers un document officiel, une facture ou un livrable certifié par SPC.",
  },
  {
    icon: Eye,
    title: "Transparence des Flux",
    text: "Visualisez l'aperçu et les métadonnées réelles du lien avant d'ouvrir vos fichiers de production.",
  },
  {
    icon: Lock,
    title: "Confiance Numérique",
    text: "Un protocole de sécurité strict pour protéger vos échanges professionnels contre le phishing.",
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <BrandMark />
          <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Passerelle sécurisée opérationnelle
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden flex items-center">
        {/* Background Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

        <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-20 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Service de redirection officiel · STAF PRINT CENTER
              </span>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                Sécurisez vos accès et vos partages de{" "}
                <span className="text-primary">liens pro</span>
              </h1>

              <p className="mt-6 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
                La passerelle de redirection **SPC Redirect** protège vos transferts de fichiers, justificatifs et documents d'impression. Nous analysons chaque URL raccourcie pour prémunir vos collaborateurs et clients contre les redirections frauduleuses.
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-4">
                <Button asChild size="lg" className="shadow-sm">
                  <Link to="/r/$alias" params={{ alias: "doc" }}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Raccourcir un lien
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-card">
                  <Link to="/r/$alias" params={{ alias: "verify" }}>
                    <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                    Signaler un problème
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Visual Element */}
            <div className="flex items-center justify-center lg:col-span-5 relative">
              <div className="absolute -inset-4 -z-10 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl border border-border bg-card shadow-panel sm:h-64 sm:w-64 transition-transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-4 rounded-2xl border border-dashed border-border/60" />

                <ShieldCheck
                  className="h-28 w-28 text-primary sm:h-36 sm:w-36"
                  strokeWidth={1}
                />

                <span className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-success text-success-foreground shadow-md">
                  <Lock className="h-4 w-4" />
                </span>
              </div>
            </div>

          </div>

          {/* Pillars Section */}
          <div className="mt-20 sm:mt-28 grid w-full gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:shadow-panel hover:border-border/100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-6">
          <p className="text-xs text-muted-foreground">
            © 2026 SPC Redirect. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}