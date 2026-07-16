import { useQuery } from "@tanstack/react-query";
import { createShortlink } from "@/stores/useShortlinksStore";
import type { ShortlinkCategory } from "@/data/shortlinks";

interface UseShortUrlResult {
  displayUrl: string;
  alias: string | null;
  isLoading: boolean;
  isReady: boolean;
  hasError: boolean;
}

/**
 * Fournit un lien court pour une URL longue
 */
export function useShortUrl(longUrl: string, category?: ShortlinkCategory): UseShortUrlResult {
  const query = useQuery({
    queryKey: ["shortlink", "create", longUrl, category],
    queryFn: () => createShortlink(longUrl, category),
    enabled: !!longUrl,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });

  return {
    displayUrl: query.data?.shortUrl ?? longUrl,
    alias: query.data?.alias ?? null,
    isLoading: query.isLoading,
    isReady: !!query.data,
    hasError: query.isError,
  };
}