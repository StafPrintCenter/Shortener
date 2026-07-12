import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

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