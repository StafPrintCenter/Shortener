import { SITE } from "@/data/site";

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

export const SHORT_ORIGIN = import.meta.env.VITE_SHORTSITE_URL;

/**
 * Vérifie qu'une URL pointe bien vers le site principal.
 */
export function isAllowedFrontendUrl(url: string): boolean {
  const target = urlAuthority(url);
  const allowed = urlAuthority(FRONTEND_ORIGIN);
  return !!target && target === allowed;
}

/** Retire le protocole (http(s)://) d'une URL pour un affichage plus lisible */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}