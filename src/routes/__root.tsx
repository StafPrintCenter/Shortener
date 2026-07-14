import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { type ReactNode } from "react";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { NotFoundComponent, ErrorComponent } from "@/components/errors";
import { SITE } from "@/data/site";

const SHORTEN_TITLE = "SPC Redirect — Redirection de liens sécurisée & transparente";
const SHORTEN_DESC = "SPC Redirect redirige vos liens avec transparence : chaque destination est analysée et ses métadonnées sont extraites pour votre sécurité avant l'accès.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "title", content: SHORTEN_TITLE },
      { name: "description", content: SHORTEN_DESC },
      { name: "author", content: SITE.name },
      { name: "keywords", content: `raccourcisseur, lien court, redirection securisee, transparence, spc redirect, deconnexion, ${SITE.name}, porto-novo` },

      // Open Graph / Facebook / LinkedIn
      { property: "og:title", content: SHORTEN_TITLE },
      { property: "og:description", content: SHORTEN_DESC },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "STAF PRINT CENTER" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SHORTEN_TITLE },
      { name: "twitter:description", content: SHORTEN_DESC },
      { name: "twitter:site", content: "@StafPrintCenter" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
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
            name: "STAF PRINT CENTER"
          }
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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