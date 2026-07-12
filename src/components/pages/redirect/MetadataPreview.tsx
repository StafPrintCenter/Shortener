import { ImageOff, Loader2, Tag, Globe, ExternalLink, BarChart3 } from "lucide-react";
import { getShortlinkCategoryLabel } from "@/data/shortlinks";

interface MetadataPreviewProps {
  notFound: boolean;
  isLoading: boolean;
  shortlink: any;
  meta: any;
  domain: string;
  longUrl: string;
}

export function MetadataPreview({
  notFound,
  isLoading,
  shortlink,
  meta,
  domain,
  longUrl,
}: MetadataPreviewProps) {
  const title = meta?.title ?? "Contenu STAF PRINT CENTER";
  const categoryLabel = shortlink ? getShortlinkCategoryLabel(shortlink.category) : null;

  return (
    <div className="p-6 md:p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Destination
      </p>

      {notFound ? (
        <div className="mt-2 flex h-full min-h-70 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ImageOff className="h-6 w-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            Aucune information disponible pour ce lien.
          </p>
        </div>
      ) : (
        <div className="mt-2 overflow-hidden rounded-lg border border-border bg-secondary/50">
          <div className="relative aspect-[1.9/1] w-full border-b border-border bg-muted">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : meta?.image ? (
              <img src={meta.image} alt={title} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">Aperçu indisponible</span>
              </div>
            )}
          </div>

          <div className="p-4">
            {categoryLabel && (
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Tag className="h-3 w-3" />
                {categoryLabel}
              </span>
            )}

            {isLoading ? (
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            ) : (
              <p className="text-sm font-semibold leading-snug">{title}</p>
            )}

            {!isLoading && meta?.description ? (
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {meta.description}
              </p>
            ) : null}

            <div className="mt-3 space-y-2 text-xs">
              {/* Squelettes d'attente pendant le chargement initial pour éviter le flash de contenu */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              )}

              {/* Affichage conditionnel des lignes complètes après chargement */}
              {!isLoading && domain && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-foreground">{domain}</span>
                </div>
              )}

              {!isLoading && longUrl && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-all font-mono">{longUrl}</span>
                </div>
              )}

              {!isLoading && typeof shortlink?.clicksCount === "number" && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {shortlink.clicksCount} clic{shortlink.clicksCount > 1 ? "s" : ""} enregistré
                    {shortlink.clicksCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}