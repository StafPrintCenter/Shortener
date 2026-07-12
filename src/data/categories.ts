export type Discipline = | "Design" | "Web" | "Impression" | "Vidéo" | "Formation" | "Conseils" | "Actus";
export const DISCIPLINES: Discipline[] = ["Design", "Web", "Impression", "Vidéo", "Formation", "Conseils", "Actus",];

export const DISCIPLINE_COLORS: Record<Discipline, string> = {
  Design: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/20 border-indigo-500/20",
  Web: "bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:bg-sky-500/20 border-sky-500/20",
  Impression: "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20 border-amber-500/20",
  Vidéo: "bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20 border-purple-500/20",
  Formation: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20 border-emerald-500/20",
  Conseils: "bg-teal-500/10 text-teal-600 dark:text-teal-400 dark:bg-teal-500/20 border-teal-500/20",
  Actus: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/20 border-rose-500/20",
};

// Style neutre de repli quand une catégorie ne correspond à aucune discipline connue
// (ex: la catégorie "Service" utilisée pour les résultats de recherche de type service).
const FALLBACK_BADGE_COLOR = "bg-primary/10 text-primary border-primary/20";

/**
 * Retourne la classe de couleur associée à une discipline pour un badge.
 */
export function getDisciplineColorClass(category?: string): string {
  if (category && (DISCIPLINES as string[]).includes(category)) {
    return DISCIPLINE_COLORS[category as Discipline];
  }
  return FALLBACK_BADGE_COLOR;
}
