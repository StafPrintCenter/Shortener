import { SITE_LINK } from "@/data/site";

/**
 * Reproduit côté client la logique d'autorité de App\Support\DomainGuard :
 * host:port en minuscules, avec le port par défaut du schéma explicité.
 */
export function urlAuthority(url: string): string | null {
  try {
    const u = new URL(url);
    const port = u.port || (u.protocol === "https:" ? "443" : "80");
    return `${u.hostname.toLowerCase()}:${port}`;
  } catch {
    return null;
  }
}

/**
 * Vérifie qu'une URL pointe bien vers le site principal ou la documentation.
 */
export function isAllowedFrontendUrl(url: string): boolean {
  const target = urlAuthority(url);
  if (!target) return false;

  const allowedLanding = urlAuthority(SITE_LINK.landingUrl);
  const allowedDocs = urlAuthority(SITE_LINK.docsUrl);

  return target === allowedLanding || target === allowedDocs;
}

/** Retire le protocole (http(s)://) d'une URL pour un affichage plus lisible */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}