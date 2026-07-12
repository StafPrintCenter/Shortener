import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 md:p-12 select-none">
      <div className="grid w-full max-w-4xl gap-8 items-center md:grid-cols-12 md:gap-16">

        {/* Colonne Gauche : Illustration vivante du lien brisé */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-60 md:min-h-75">
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Arrière-plan néon diffus */}
            <div className="absolute h-40 w-40 rounded-full bg-destructive/10 blur-3xl" />

            {/* Partie supérieure de la chaîne (s'élève légèrement) */}
            <div className="absolute transform -translate-y-6 -translate-x-4 -rotate-12 animate-bounce animation-duration:3s text-muted-foreground/40">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                <line x1="8" y1="12" x2="12" y2="12" />
              </svg>
            </div>

            {/* Éclairs de rupture en temps réel */}
            <div className="absolute text-destructive font-mono font-bold text-xl animate-ping opacity-75">
              ⚡
            </div>

            {/* Partie inférieure de la chaîne (tombe vers le bas) */}
            <div className="absolute transform translate-y-8 translate-x-4 rotate-12 animate-pulse text-destructive/80">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="12" x2="16" y2="12" />
                <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
              </svg>
            </div>
          </div>

          {/* Badge technique flottant */}
          <span className="absolute bottom-0 px-3 py-1 text-xs font-mono font-bold tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-full shadow-sm">
            ERROR_404_LINK_BROKEN
          </span>
        </div>

        {/* Colonne Droite : Explications et Actions */}
        <div className="md:col-span-7 text-center md:text-left flex flex-col justify-center">
          <div className="inline-flex mx-auto md:mx-0 items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground bg-muted border border-border/60 rounded-full w-fit">
            <span className="flex h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            Rupture de faisceau
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ce lien est cassé.
          </h1>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
            La clé d'accès ou l'alias de redirection demandé n'existe pas ou a expiré. L'intégrité de la destination ne peut pas être vérifiée.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <a
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <Home size={16} />
              Retourner à la base
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   2. ERROR COMPONENT (500 - ANOMALIE CRITIQUE)
   ========================================================================== */
export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    // Loggez l'erreur ici de manière sécurisée si votre système de reporting est actif
    console.error("Critical Redirection Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 md:p-12 select-none">
      <div className="grid w-full max-w-4xl gap-8 items-center md:grid-cols-12 md:gap-16">

        {/* Colonne Gauche : Visuel d'anomalie système */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-60 md:min-h-75">
          <div className="relative flex items-center justify-center w-full h-full">
            <div className="absolute h-40 w-40 rounded-full bg-destructive/10 blur-3xl" />

            <div className="relative p-6 rounded-3xl bg-destructive/5 border border-destructive/20 text-destructive animate-pulse">
              <AlertCircle width="96" height="96" strokeWidth={1} />
            </div>
          </div>
          <span className="absolute bottom-0 px-3 py-1 text-xs font-mono font-bold tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-full">
            CRITICAL_SYS_500
          </span>
        </div>

        {/* Colonne Droite : Contenu de plantage */}
        <div className="md:col-span-7 text-center md:text-left flex flex-col justify-center">
          <div className="inline-flex mx-auto md:mx-0 items-center gap-1.5 px-3 py-1 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-full w-fit">
            <span className="flex h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            Signal d'erreur reçu
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Le décodage a échoué.
          </h1>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
            Une erreur critique empêche l'extraction des métadonnées sécurisées. L'infrastructure est intacte, mais la requête actuelle n'a pas pu aboutir.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start w-full">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={16} />
              Forcer la reconnexion
            </button>
            <a
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
            >
              <Home size={16} />
              Quitter
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}