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
    alias: "doc",
    url: "https://developer.mozilla.org/fr/docs/Web",
    label: "Documentation technique",
  },
  dashboard: {
    alias: "dashboard",
    url: "https://vercel.com",
    label: "Tableau de bord",
  },
  verify: {
    alias: "verify",
    url: "https://www.cloudflare.com",
    label: "Portail de vérification",
  },
};

export function getLinkEntry(alias: string): LinkEntry {
  return (
    linkDatabase[alias] ?? {
      alias,
      url: `https://example.com/${alias}`,
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
