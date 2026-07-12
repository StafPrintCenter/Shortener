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

/** Origine du site principal STAF PRINT CENTER (les liens raccourcis doivent y pointer) */
export const FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_URL ?? "http://localhost:3000";

/** Origine de ce site de raccourcissement lui-même (SPC Redirect) */
export const SHORT_ORIGIN = import.meta.env.VITE_SHORTSITE_URL ?? "http://localhost:3001";

/**
 * Vérifie qu'une URL pointe bien vers le site principal STAF PRINT CENTER
 * (VITE_FRONTEND_URL) — miroir client de DomainGuard::isAllowed, à titre
 * de garde-fou UX avant même l'appel réseau. Le backend reste seul juge final.
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