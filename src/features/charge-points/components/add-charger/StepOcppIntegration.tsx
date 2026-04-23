import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import type { ChargerWizardData } from "./types";

interface Props {
  data: ChargerWizardData;
  onChange: (field: keyof ChargerWizardData, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepOcppIntegration = ({ data, onChange, onNext, onBack }: Props) => {
  const canProceed = data.chargePointId.trim().length > 0;

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
        <h2 className="text-xl font-semibold text-primary">OCPP Integration</h2>
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Charge point identifier</Label>
        <p className="text-sm text-muted-foreground">
          To establish a connection between your charge point and our server, we
          need the identification number of your charge point. The identification
          number is usually the charge point&apos;s serial number.
        </p>
        <Input
          placeholder="Example: '12345678912345678'"
          value={data.chargePointId}
          onChange={(e) => onChange("chargePointId", e.target.value)}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!canProceed}
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
};
