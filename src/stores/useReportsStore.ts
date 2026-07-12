import { resolveApiUrl } from "@/lib/api-url";
import type { APIReport, ReportableType, ReportReason } from "@/data/reports";

type ReportResponse = { data: APIReport };

export interface CreateReportParams {
  reportableType: ReportableType;
  reportableId: string;
  reason: ReportReason;
  message?: string;
  reporterEmail?: string;
}

export async function createReport(params: CreateReportParams): Promise<APIReport> {
  const formData = new FormData();
  formData.append("reportable_type", params.reportableType);
  formData.append("reportable_id", params.reportableId);
  formData.append("reason", params.reason);
  if (params.message) formData.append("message", params.message);
  if (params.reporterEmail) formData.append("reporter_email", params.reporterEmail);

  const url = resolveApiUrl(`/api/public/reports`);
  const response = await fetch(url, { method: "POST", body: formData });
  if (!response.ok) {
    throw new Error("Erreur lors de l'envoi du signalement");
  }
  const json: ReportResponse = await response.json();
  return json.data;
}