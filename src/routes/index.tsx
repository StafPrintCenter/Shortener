import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageFooter } from "@/components/site";
import { CreateShortlinkModal, ReportModal } from "@/components/modal";
import { HeroSection, PillarsSection } from "@/components/pages/home";
import { SITE } from "@/data/site";

const SHORTEN_TITLE = `${SITE.shortName}  - Redirection de liens sécurisée & transparente pour ${SITE.name}`;
const SHORTEN_DESC = `${SITE.shortName} redirige vos liens avec transparence: chaque destination est analysée et ses métadonnées sont extraites pour votre sécurité avant l'accès.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "title", content: SHORTEN_TITLE },
      { name: "description", content: SHORTEN_DESC },
      { property: "og:title", content: SHORTEN_TITLE },
      { property: "og:description", content: SHORTEN_DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [initialLongUrl, setInitialLongUrl] = useState("");

  // Intercepte l'URL passée en paramètre (via la Landing page par exemple)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToCreate = params.get("create");

    if (urlToCreate) {
      setInitialLongUrl(decodeURIComponent(urlToCreate));
      setIsCreateOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader>
        <span className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Systèmes opérationnels
        </span>
      </PageHeader>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-field opacity-70" />

        {/* Bloc d'introduction et d'action */}
        <HeroSection
          onCreateClick={() => setIsCreateOpen(true)}
          onReportClick={() => setIsReportOpen(true)}
        />

        {/* Bloc descriptif des arguments clés */}
        <PillarsSection />
      </main>

      <PageFooter />

      {/* Gestion des Modals */}
      <CreateShortlinkModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setInitialLongUrl("");
        }}
        defaultLongUrl={initialLongUrl}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}