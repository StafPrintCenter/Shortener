import { useEffect, useState } from "react";
import { Flag, Loader2, CheckCircle2 } from "lucide-react";
import { Modal } from "./Modal";
import { createReport } from "@/stores/useReportsStore";
import { REPORT_REASON_LABELS, REPORTABLE_TYPE_LABELS, type ReportReason, type ReportableType } from "@/data/reports";

const REASON_OPTIONS = Object.keys(REPORT_REASON_LABELS) as ReportReason[];
const TYPE_OPTIONS = Object.keys(REPORTABLE_TYPE_LABELS) as ReportableType[];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: { reportableId: string };
}

export function ReportModal({ isOpen, onClose, prefill }: ReportModalProps) {
  const [reportableId, setReportableId] = useState(prefill?.reportableId ?? "");
  const [reason, setReason] = useState<ReportReason>("broken_link");
  const [message, setMessage] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReportableId(prefill?.reportableId ?? "");
      setReason("broken_link");
      setMessage("");
      setReporterEmail("");
      setError(null);
      setSubmitted(false);
    }
  }, [isOpen, prefill?.reportableId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reportableId.trim()) {
      setError("Merci d'indiquer l'identifiant du lien court concerné.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        reportableType: "short_link",
        reportableId: reportableId.trim(),
        reason,
        message: message.trim() || undefined,
        reporterEmail: reporterEmail.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("Erreur lors de l'envoi du signalement. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Signaler un problème" icon={Flag}>
      <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4 text-left">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={28} />
            </span>
            <p className="text-sm font-medium">Signalement envoyé, merci.</p>
            <p className="text-xs text-muted-foreground">Notre équipe l'examinera dans les meilleurs délais.</p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="mb-1.5 block text-sm font-medium">Type de ressource</span>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-primary bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {REPORTABLE_TYPE_LABELS["short_link"]}
                </span>
              </div>
            </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Identifiant du lien court</span>
            <input
              type="text"
              value={reportableId}
              onChange={(e) => setReportableId(e.target.value)}
              disabled={!!prefill?.reportableId}
              placeholder="ex: ab93b47d-4e45-4da2-8b81-d033df89bcb6"
              className="input w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
            />
            {prefill?.reportableId && (
              <span className="mt-1 block text-xs text-muted-foreground">Rempli automatiquement depuis cette page.</span>
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Motif</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="input w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary"
            >
              {REASON_OPTIONS.map((r) => (
                <option key={r} value={r}>{REPORT_REASON_LABELS[r]}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Message (optionnel)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Décrivez le problème rencontré…"
              className="input w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Votre email (optionnel)</span>
            <input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="input w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary"
            />
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}
            {isSubmitting ? "Envoi…" : "Envoyer le signalement"}
          </button>
        </form>
      )}
    </Modal>
  );
}