import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { AlertCircle, FileQuestion, RefreshCw, Home, ShieldAlert } from "lucide-react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/data/site";
import logo from "@/assets/logos.json";
import { buildShareUrl } from "@/lib/share/build-share-url";

// Configuration des constantes SEO de l'application Shortener
const SHORTEN_TITLE = "SPC Redirect — Redirection de liens sécurisée & transparente";
const SHORTEN_DESC = "SPC Redirect redirige vos liens avec transparence : chaque destination est analysée et ses métadonnées sont extraites pour votre sécurité avant l'accès.";

/* ==========================================================================
   COMPOSANTS D'ERREUR ET UX AMÉLIORÉS
   ========================================================================== */

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center select-none">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground border border-border/60 shadow-sm animate-pulse">
        <FileQuestion className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Page introuvable
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        L'adresse demandée n'existe pas, a été déplacée ou le lien court n'est plus disponible.
      </p>
      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 cursor-pointer"
        >
          <Home size={16} />
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    // Rapport d'anomalie automatisé
    reportError(error, { boundary: "tanstack_root_error_component" });
    console.error("Root Boundary Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center select-none">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-sm animate-bounce">
        <AlertCircle className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Une erreur est survenue
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        Impossible de charger correctement les données de cette page. Notre équipe technique a été notifiée du problème.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 cursor-pointer"
        >
          <RefreshCw size={16} />
          Réessayer le chargement
        </button>
        <a
          href="/"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted cursor-pointer"
        >
          <Home size={16} />
          Aller à l'accueil
        </a>
      </div>
    </div>
  );
}

/* ==========================================================================
   DÉFINITION DE LA ROUTE RACINE (ROOT ROUTE)
   ========================================================================== */

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const canonicalUrl = buildShareUrl("/");

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: SHORTEN_TITLE },
        { name: "description", content: SHORTEN_DESC },
        { name: "author", content: SITE?.name || "STAF PRINT CENTER" },
        { name: "keywords", content: "raccourcisseur, lien court, redirection securisee, transparence, spc redirect, staf print center, porto-novo" },

        // Open Graph / Facebook / LinkedIn
        { property: "og:title", content: SHORTEN_TITLE },
        { property: "og:description", content: SHORTEN_DESC },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: SITE?.name || "STAF PRINT CENTER" },
        { property: "og:image", content: logo?.meta || "" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: SHORTEN_TITLE },
        { property: "og:url", content: canonicalUrl },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: SHORTEN_TITLE },
        { name: "twitter:description", content: SHORTEN_DESC },
        { name: "twitter:image", content: logo?.meta || "" },
        { name: "twitter:site", content: "@StafPrintCenter" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SPC Redirect",
            alternateName: "SPC Shortener",
            description: SHORTEN_DESC,
            applicationCategory: "SecurityApplication",
            operatingSystem: "All",
            author: {
              "@type": "Organization",
              name: SITE?.name || "STAF PRINT CENTER",
              url: "https://stafprintcenter.com" // Ajustez si nécessaire
            }
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/* ==========================================================================
   SHELL ET RACINE DU COMPOSANT
   ========================================================================== */

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
