import { ArrowRight, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelledStateProps {
  onResume: () => void;
  renderReportTrigger: () => React.ReactNode;
}

export function CancelledState({ onResume, renderReportTrigger }: CancelledStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
      <span className="flex h-21 w-21 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleX className="h-10 w-10" strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-lg font-semibold">Redirection annulée</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous pouvez reprendre la redirection à tout moment.
      </p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" className="w-full" onClick={onResume}>
          Reprendre la redirection
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center pt-1">
          {renderReportTrigger()}
        </div>
      </div>
    </div>
  );
}