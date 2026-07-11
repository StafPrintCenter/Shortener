import { cn } from "@/lib/utils";
import logo from "@/assets/logos.json";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto" />
    </span>
  );
}

