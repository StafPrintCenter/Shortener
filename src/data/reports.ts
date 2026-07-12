export type ReportableType = "short_link" | "service" | "training" | "article" | "project";
export type ReportReason = "broken_link" | "incorrect_info" | "inappropriate_content" | "spam" | "other";
export type ReportStatus = "pending" | "resolved" | "rejected" | string;

/**
 * Type aligné sur la réponse de l'API publique /reports
 */
export type APIReport = {
  id: string;
  reportableType: ReportableType;
  reportableId: string;
  reason: ReportReason;
  message: string | null;
  reporterEmail: string | null;
  status: ReportStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  broken_link: "Lien cassé",
  incorrect_info: "Information incorrecte",
  inappropriate_content: "Contenu inapproprié",
  spam: "Spam",
  other: "Autre",
};

export const REPORTABLE_TYPE_LABELS: Record<ReportableType, string> = {
  short_link: "Lien court",
  service: "Service",
  training: "Formation",
  article: "Article",
  project: "Réalisation",
};