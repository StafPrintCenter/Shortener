import { useState } from "react";
import { Link2, Copy, Check, Loader2, AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { createShortlink } from "@/stores/useShortlinksStore";
import { getShortlinkCategoryLabel, type ShortlinkCategory, type APIShortlink } from "@/data/shortlinks";
import { isAllowedFrontendUrl, FRONTEND_ORIGIN } from "@/lib/domain";

const SHORTLINK_CATEGORY_OPTIONS: ShortlinkCategory[] = [
  "other", "blog", "design", "web", "print", "video", "formation", "tips", "news", "newsletter",
];

interface CreateShortlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShortlinkModal({ isOpen, onClose }: CreateShortlinkModalProps) {
  const [longUrl, setLongUrl] = useState("");
  const [category, setCategory] = useState<ShortlinkCategory>("other");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<APIShortlink | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setLongUrl("");
    setCategory("other");
    setError(null);
    setResult(null);
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = longUrl.trim();
    if (!trimmed) {
      setError("Merci de renseigner un lien.");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError("Ce lien n'est pas une URL valide.");
      return;
    }
    if (!isAllowedFrontendUrl(trimmed)) {
      setError(`Seuls les liens vers ${FRONTEND_ORIGIN} peuvent être raccourcis ici.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createShortlink(trimmed, category);
      setResult(created);
    } catch {
      setError("Erreur lors de la création du lien court. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Raccourcir un lien" icon={Link2}>
      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-primary" />
        <p>Seuls les liens pointant vers <span className="font-mono text-foreground">{FRONTEND_ORIGIN}</span> peuvent être raccourcis.</p>
      </div>

      {result ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
            <Link2 size={16} className="shrink-0 text-primary" />
            <span className="flex-1 truncate text-sm font-medium text-foreground">{result.shortUrl}</span>
            <button
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
          <button
            onClick={reset}
            className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted cursor-pointer"
          >
            Raccourcir un autre lien
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Lien à raccourcir</span>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder={`${FRONTEND_ORIGIN}/articles/...`}
              className="input w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Catégorie</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ShortlinkCategory)}
              className="input w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary"
            >
              {SHORTLINK_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{getShortlinkCategoryLabel(c)}</option>
              ))}
            </select>
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
            {isSubmitting ? "Création…" : "Raccourcir"}
          </button>
        </form>
      )}
    </Modal>
  );
}