import { CheckCircle2 } from "lucide-react";

interface RedirectedStateProps {
  domain: string;
}

export function RedirectedState({ domain }: RedirectedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
      <span className="flex h-21 w-21 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-10 w-10" strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-lg font-semibold">Redirection effectuée</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous avez été dirigé en toute sécurité vers{" "}
        <span className="font-mono text-foreground">{domain}</span>
      </p>
    </div>
  );
}