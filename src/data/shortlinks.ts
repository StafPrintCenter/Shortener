import { type Discipline } from "@/data/categories";

export type ShortlinkStatus = "active" | "disabled" | string;
export type ShortlinkCategory = "design" | "web" | "print" | "video" | "formation" | "tips" | "news" | "blog" | "newsletter" | "other";

/**
 * Type aligné sur la réponse de l'API publique /shortlinks
 */
export type APIShortlink = {
  id: string;
  alias: string;
  shortUrl: string;
  longUrl: string;
  category: ShortlinkCategory;
  clicksCount: number | null;
  isActive: boolean | null;
  activateAt: string | null;
  expiresAt: string | null;
  status: ShortlinkStatus;
  createdAt: string;
};

const DISCIPLINE_TO_SHORTLINK_CATEGORY: Partial<Record<Discipline, ShortlinkCategory>> = {
  Design: "design",
  Web: "web",
  Impression: "print",
  Vidéo: "video",
  Formation: "formation",
  Conseils: "tips",
  Actus: "news",
};

/**
 * Traduit une discipline du site (Design, Web, Impression, Vidéo, Formation...)
 */
export function getShortlinkCategory(discipline?: string): ShortlinkCategory {
  return DISCIPLINE_TO_SHORTLINK_CATEGORY[discipline as Discipline] ?? "other";
}