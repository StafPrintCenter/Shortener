import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { SITE_LINK } from "@/data/site";

const ALLOWED_DOMAINS = [
  SITE_LINK.landingUrl,
  SITE_LINK.docsUrl,
  SITE_LINK.aiUrl,
].filter(Boolean);

const formatDomain = (url: string) => url.replace(/^https?:\/\//, "");

export function AllowedDomainsTooltip() {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
  };

  const handleShow = () => {
    updatePosition();
    setShow(true);
  };

  return (
    <span className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={handleShow}
        onMouseLeave={() => setShow(false)}
        onFocus={handleShow}
        onBlur={() => setShow(false)}
        aria-label="Voir la liste des domaines autorisés"
        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-2 hover:bg-muted hover:decoration-foreground cursor-help shrink-0"
      >
        <Info size={12} className="text-primary" />
      </button>

      {show && coords && typeof document !== "undefined" &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-200 w-60 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground shadow-lg"
          >
            <strong className="block mb-1.5 text-foreground font-semibold">
              Domaines acceptés :
            </strong>
            <ul className="space-y-1 font-mono text-[11px]">
              {ALLOWED_DOMAINS.map((domain) => (
                <li key={domain} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-primary shrink-0" />
                  {formatDomain(domain)}
                </li>
              ))}
            </ul>
          </span>,
          document.body
        )}
    </span>
  );
}