export interface LinkEntry {
  alias: string;
  /** Real destination the short link points to. */
  url: string;
  /** Editorial label shown while metadata loads. */
  label: string;
}

/**
 * SPC Redirect — link registry.
 * Each alias points to a real destination so its metadata (title, image,
 * description) can be extracted live on the redirection page.
 */
export const linkDatabase: Record<string, LinkEntry> = {
  doc: {
    alias: "blog",
    url: "http://localhost:3000/articles/5-erreurs-a-eviter-avant-dimprimer-1-000-flyers",
    label: "Article flyers",
  },
  dashboard: {
    alias: "form-rs",
    url: "https://stafprint.netlify.app/training/143f2f42-fab5-4add-91a2-9734d1784af4",
    label: "Formation",
  },
  verify: {
    alias: "ser-23",
    url: "https://stafprint.netlify.app/services/impression-de-baches",
    label: "Service",
  },
};

export function getLinkEntry(alias: string): LinkEntry {
  return (
    linkDatabase[alias] ?? {
      alias,
      url: `https://stafprint.netlify.app/${alias}`,
      label: "Ressource externe",
    }
  );
}

export const reportReasons = [
  { value: "phishing", label: "Hameçonnage (Phishing)" },
  { value: "spam", label: "Spam" },
  { value: "malicious", label: "Contenu malveillant" },
  { value: "other", label: "Autre" },
] as const;
