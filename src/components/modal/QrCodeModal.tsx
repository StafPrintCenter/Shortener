import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Download, QrCode as QrCodeIcon, Loader2 } from "lucide-react";
import { buildQrCodeUrl } from "@/lib/qr-code";

interface QrCodeAutoPanelProps {
  /** Alias du lien court — dès qu'il devient non-null, le panneau s'affiche automatiquement */
  alias: string | null;
  /** Lien affiché sous le QR code, pour confirmer visuellement la destination */
  shortUrl?: string;
  /** Durée avant fermeture automatique, en secondes (0 pour désactiver) */
  autoCloseSeconds?: number;
}

/**
 * Affiche automatiquement le QR code d'un lien court dès qu'il devient disponible,
 * sans action de l'utilisateur. Reste ouvert jusqu'à fermeture manuelle ou expiration
 * du compte à rebours. Ne se réaffiche pas pour le même alias une fois fermé.
 */
export function QrCodeAutoPanel({ alias, shortUrl, autoCloseSeconds = 20 }: QrCodeAutoPanelProps) {
  const dismissedAliasRef = useRef<string | null>(null);
  const [visibleAlias, setVisibleAlias] = useState<string | null>(null);

  useEffect(() => {
    if (alias && alias !== dismissedAliasRef.current) {
      setVisibleAlias(alias);
    }
    if (!alias) {
      setVisibleAlias(null);
    }
  }, [alias]);

  const handleClose = () => {
    dismissedAliasRef.current = visibleAlias;
    setVisibleAlias(null);
  };

  if (!visibleAlias) return null;

  return (
    <QrCodePanelUI
      key={visibleAlias}
      alias={visibleAlias}
      shortUrl={shortUrl}
      onClose={handleClose}
      autoCloseSeconds={autoCloseSeconds}
    />
  );
}

interface QrCodePanelUIProps {
  alias: string;
  shortUrl?: string;
  onClose: () => void;
  autoCloseSeconds: number;
}

function QrCodePanelUI({ alias, shortUrl, onClose, autoCloseSeconds }: QrCodePanelUIProps) {
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(autoCloseSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const qrUrl = buildQrCodeUrl(alias);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (autoCloseSeconds <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoCloseSeconds, isPaused, onClose]);

  if (!mounted) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `qr-${alias}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-110 flex justify-center px-4 pb-4 md:inset-x-auto md:bottom-6 md:left-6 md:justify-start md:px-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-bold">
            <QrCodeIcon size={16} className="text-primary" /> Code QR
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center rounded-xl border border-border bg-white p-3">
          <div className="relative flex h-36 w-36 items-center justify-center">
            {!imageLoaded && (
              <Loader2 size={20} className="absolute animate-spin text-muted-foreground" />
            )}
            <img
              src={qrUrl}
              alt={`Code QR du lien ${alias}`}
              onLoad={() => setImageLoaded(true)}
              className={`h-full w-full object-contain transition-opacity ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        </div>

        {shortUrl && (
          <p className="mt-2 truncate text-center text-xs text-muted-foreground">{shortUrl}</p>
        )}

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {isDownloading ? "Téléchargement…" : "Télécharger"}
        </button>

        {autoCloseSeconds > 0 && (
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Fermeture dans {secondsLeft}s{isPaused && " (en pause)"}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}