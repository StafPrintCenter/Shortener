import { useState } from "react";
import { Flag } from "lucide-react";
import { ReportModal } from "@/components/modal/ReportModal";

interface ReportDialogProps {
  shortlinkId?: string;
}

export function ReportDialog({ shortlinkId }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
      >
        <Flag size={13} />
        Signaler un problème
      </button>

      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prefill={shortlinkId ? { reportableId: shortlinkId } : undefined}
      />
    </>
  );
}
