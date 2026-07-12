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

export const FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_URL ?? "http://localhost:3000";

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