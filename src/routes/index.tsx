import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Eye,
  Link2,
  AlertTriangle,
  Lock,
  ScanLine,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

const pillars = [
  {
    icon: ScanLine,
    title: "Intégrité SPC",
    text: "Chaque URL ou QR code généré par nos services d'impression fait l'objet d'une analyse de sécurité stricte avant redirection.",
  },
  {
    icon: Eye,
    title: "Transparence client",
    text: "La destination finale et les métadonnées sont affichées de manière claire pour rassurer vos destinataires.",
  },
  {
    icon: Lock,
    title: "Protection des flux",
    text: "Un standard de confiance numérique développé pour isoler et sécuriser les accès à vos documents SPC.",
  },
];

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <BrandMark />
          <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Infrastructure SPC opérationnelle
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Hero Section en 2 Colonnes */}
          <section className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

            {/* Colonne Gauche : Textes & Actions */}
            <div className="text-left lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Passerelle Raccourcisseur de Liens · Staf Print Center
              </span>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Sécurisez vos partages de liens et de{" "}
                <span className="text-primary">documents SPC</span>
              </h1>

              <p className="mt-6 text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
                Développé exclusivement pour l'écosystème **Staf Print Center**, notre service de redirection protège vos collaborateurs et clients. Nous analysons chaque lien raccourci, validons la destination en direct et extrayons un aperçu fidèle pour éliminer tout risque de redirection malveillante.
              </p>

              {/* Boutons mis à jour selon tes consignes */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="shadow-sm" asChild>
                  <Link to="/">
                    <Link2 className="h-4 w-4" />
                    Raccourcir un lien
                  </Link>
                </Button>

                {/* Note: À lier vers ta modale ou page de signalement /r/$alias ou /report plus tard */}
                <Button variant="outline" size="lg" asChild>
                  <Link to="/">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Signaler un problème
                  </Link>
                </Button>
              </div>
            </div>

            {/* Colonne Droite : Visuel abstrait du Shield */}
            <div className="relative flex justify-center lg:col-span-5">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl border border-border bg-card shadow-panel sm:h-64 sm:w-64">
                <div className="absolute inset-4 rounded-2xl border border-dashed border-border/80" />
                <ShieldCheck
                  className="h-28 w-28 text-primary sm:h-36 sm:w-36"
                  strokeWidth={1}
                />
                <span className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-success text-success-foreground shadow-sm">
                  <Lock className="h-4 w-4" />
                </span>
              </div>
            </div>

          </section>

          {/* Section Piliers/Features conservée et contextualisée */}
          <section className="mt-24">
            <div className="grid w-full gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-lg border border-border bg-card p-6 text-left shadow-sm transition-all duration-200 hover:shadow-panel hover:border-border/100"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card/30">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-center px-6">
          <p className="text-xs text-muted-foreground">
            © 2026 SPC Redirect · Staf Print Center. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}