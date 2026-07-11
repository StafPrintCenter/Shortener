import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <Waypoints className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
      <span className="text-[15px] font-extrabold tracking-tight">
        SPC<span className="text-primary"> Redirect</span>
      </span>
    </span>
  );
}

