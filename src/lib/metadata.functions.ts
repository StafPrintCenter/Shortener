import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface SiteMetadata {
  url: string;
  domain: string;
  title: string;
  description: string;
  image: string | null;
  siteName: string | null;
  safe: boolean;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, "/")
    .trim();
}

function extractMeta(html: string, keys: string[]): string | undefined {
  for (const key of keys) {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`,
      "i",
    );
    const tag = html.match(re);
    if (tag) {
      const content = tag[0].match(/content=["']([^"']*)["']/i);
      if (content?.[1]) return decodeEntities(content[1]);
    }
  }
  return undefined;
}

export const fetchSiteMetadata = createServerFn({ method: "GET" })
  .validator(z.object({ url: z.string().url() })) // <-- Changement ici : .validator() prend directement le schéma Zod
  .handler(async ({ data }): Promise<SiteMetadata> => {
    const target = new URL(data.url);

    let html = "";
    let ok = false;
    try {
      const res = await fetch(target.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SPCRedirectBot/1.0; +https://spc.redirect)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(8000),
      });
      ok = res.ok;
      html = await res.text();
    } catch {
      ok = false;
    }

    const title =
      extractMeta(html, ["og:title", "twitter:title"]) ??
      decodeEntities(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "") ??
      target.hostname;

    const description =
      extractMeta(html, [
        "og:description",
        "twitter:description",
        "description",
      ]) ?? "";

    let image =
      extractMeta(html, ["og:image", "twitter:image", "twitter:image:src"]) ??
      null;

    if (image) {
      try {
        image = new URL(image, target).toString();
      } catch {
        image = null;
      }
    }

    const siteName = extractMeta(html, ["og:site_name"]) ?? null;

    return {
      url: target.toString(),
      domain: target.hostname,
      title: title || target.hostname,
      description,
      image,
      siteName,
      safe: ok && target.protocol === "https:",
    };
  });
