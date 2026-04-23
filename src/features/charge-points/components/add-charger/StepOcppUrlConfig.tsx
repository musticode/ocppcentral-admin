import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { ChargerWizardData } from "./types";

interface Props {
  data: ChargerWizardData;
  wsUrl: string;
  onPair: () => void;
  onBack: () => void;
  isPairing: boolean;
}

export const StepOcppUrlConfig = ({ data, wsUrl, onPair, onBack, isPairing }: Props) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wsUrl);
    toast({ title: "Copied", description: "WebSocket URL copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">OCPP Url Configuration</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        In order to establish a connection between your charge point and our
        server, your charge point needs to have its OCPP URL configured with
        the one shown below.
      </p>
      <p className="text-sm text-muted-foreground">
        If you are unsure about where to set the OCPP URL, you have to consult
        with the charge point&apos;s manufacturer.
      </p>

      <div className="space-y-2">
        <Label>WebSocket URL</Label>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={wsUrl}
            className="font-mono text-sm bg-muted"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-800">
          Not all charge points support setting an OCPP URL. If this is the case
          with your charge point, then skip this step.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Brand:</span>
          <span>{data.vendor || "—"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Model:</span>
          <span>{data.model || "—"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Integration:</span>
          <span>OCPP</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Serial number:</span>
          <span>{data.chargePointId || "—"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Connector:</span>
          <span>{data.connectorCount}</span>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onPair}
        disabled={isPairing}
      >
        {isPairing ? "Pairing..." : "Yes, pair charge point"}
      </Button>
    </div>
  );
};
