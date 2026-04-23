import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Props {
  chargePointId: string;
  onDone: () => void;
}

export const StepConnectionSuccess = ({ chargePointId, onDone }: Props) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>

      <h2 className="text-xl font-semibold">Connection successful</h2>

      <p className="text-sm text-muted-foreground max-w-md">
        Your charge point <span className="font-medium">{chargePointId}</span>{" "}
        has been successfully paired and is now connected to the OCPP server.
        You can manage it from the charge points list.
      </p>

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm w-full">
        <div className="flex gap-2 justify-center">
          <span className="font-medium text-muted-foreground">Status:</span>
          <span className="text-emerald-600 font-medium">Connected</span>
        </div>
        <div className="flex gap-2 justify-center">
          <span className="font-medium text-muted-foreground">Charge Point ID:</span>
          <span>{chargePointId}</span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onDone}>
        Done
      </Button>
    </div>
  );
};
