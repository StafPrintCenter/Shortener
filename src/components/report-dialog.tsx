import { useState } from "react";
import { Flag, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportReasons } from "@/lib/links";

export function ReportDialog({ alias }: { alias: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");

  function reset() {
    setSubmitted(false);
    setReason("");
    setDescription("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, 250);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      toast.error("Veuillez sélectionner un motif de signalement.");
      return;
    }
    setSubmitted(true);
    toast.success("Signalement reçu — merci de contribuer à un web plus sûr.");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Flag className="h-4 w-4" />
          Signaler un problème
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-7 w-7" strokeWidth={2.25} />
            </span>
            <h2 className="mt-5 text-lg font-semibold">Signalement reçu</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Merci de contribuer à la sécurité du web. Notre équipe d'intégrité
              examinera ce lien sous peu.
            </p>
            <Button className="mt-6 w-full" onClick={() => handleOpenChange(false)}>
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <DialogTitle>Signaler ce lien</DialogTitle>
              <DialogDescription>
                Aidez-nous à protéger la communauté. Votre signalement pour{" "}
                <span className="font-mono text-xs text-foreground">/r/{alias}</span>{" "}
                est confidentiel.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Motif du signalement</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Sélectionnez un motif" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportReasons.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description{" "}
                  <span className="font-normal text-muted-foreground">(optionnel)</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le problème rencontré avec ce lien…"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Envoyer le signalement</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
