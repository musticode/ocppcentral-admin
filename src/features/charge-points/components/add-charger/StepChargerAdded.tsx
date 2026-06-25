import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onConnect: () => void;
  onSkip: () => void;
}

export const StepChargerAdded = ({ onConnect, onSkip }: Props) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>

      <h2 className="text-xl font-semibold">Charger added</h2>

      <p className="text-sm text-muted-foreground max-w-md">
        &ldquo;Connecting&rdquo; pairs your charger hardware with our software.
        This is a critical step before you can start charging. If your charger is
        installed, connect it now or do this later whenever your charger is
        installed.
      </p>

      <div className="flex w-full flex-col gap-3 pt-2">
        <Button className="w-full" size="lg" onClick={onConnect}>
          Connect
        </Button>
        <Button
          className="w-full"
          size="lg"
          variant="outline"
          onClick={onSkip}
        >
          Not now
        </Button>
      </div>
    </div>
  );
};
