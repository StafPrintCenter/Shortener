import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Download, QrCode as QrCodeIcon, Loader2 } from "lucide-react";
import { buildQrCodeUrl } from "@/lib/qr-code";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Alias du lien court (ex: "5pmycn") — sert à construire l'image et le nom du fichier téléchargé */
  alias: string;
  /** Lien affiché sous le QR code, pour confirmer visuellement la destination */
  shortUrl?: string;
  /** Durée avant fermeture automatique, en secondes (0 pour désactiver) */
  autoCloseSeconds?: number;
}

export function QrCodeModal({ isOpen, onClose, alias, shortUrl, autoCloseSeconds = 20 }: QrCodeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(autoCloseSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const qrUrl = buildQrCodeUrl(alias);

  useEffect(() => setMounted(true), []);

  // Réinitialise le compte à rebours et l'état de l'image à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(autoCloseSeconds);
      setImageLoaded(false);
      setIsPaused(false);
    }
  }, [isOpen, autoCloseSeconds]);

  // Compte à rebours de fermeture automatique
  useEffect(() => {
    if (!isOpen || autoCloseSeconds <= 0 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          onClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, autoCloseSeconds, isPaused, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

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
      // Repli si le téléchargement direct échoue (ex: CORS) : ouvre l'image dans un nouvel onglet
      window.open(qrUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl border border-border bg-card p-6 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <QrCodeIcon size={18} className="text-primary" /> Code QR
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center rounded-xl border border-border bg-white p-4">
          <div className="relative flex h-52 w-52 items-center justify-center">
            {!imageLoaded && (
              <Loader2 size={24} className="absolute animate-spin text-muted-foreground" />
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
          <p className="mt-3 truncate text-center text-sm text-muted-foreground">{shortUrl}</p>
        )}

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isDownloading ? "Téléchargement…" : "Télécharger"}
        </button>

        {autoCloseSeconds > 0 && (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Fermeture automatique dans {secondsLeft}s
            {isPaused && " (en pause)"}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}