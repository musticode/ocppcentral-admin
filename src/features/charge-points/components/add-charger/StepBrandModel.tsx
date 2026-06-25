import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { CHARGER_BRANDS, CONNECTOR_TYPES, type ChargerWizardData } from "./types";

interface Props {
  data: ChargerWizardData;
  onChange: (field: keyof ChargerWizardData, value: string | boolean) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const StepBrandModel = ({ data, onChange, onNext, onCancel }: Props) => {
  const selectedBrand = CHARGER_BRANDS.find((b) => b.vendor === data.vendor);
  const models = selectedBrand?.models ?? [];

  const canProceed = data.vendor && data.model && data.maxPowerKw && data.connectorType;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          Brand &amp; model <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.vendor}
          onValueChange={(v) => {
            onChange("vendor", v);
            onChange("model", "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brand and model" />
          </SelectTrigger>
          <SelectContent>
            {CHARGER_BRANDS.map((b) => (
              <SelectItem key={b.vendor} value={b.vendor}>
                {b.vendor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {data.vendor && (
          <Select
            value={data.model}
            onValueChange={(v) => onChange("model", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          Maximum charging power (kW) <span className="text-red-500">*</span>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Label>
        <div className="relative">
          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={data.maxPowerKw}
            onChange={(e) => onChange("maxPowerKw", e.target.value)}
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            kW
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Connectors <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.connectorType}
          onValueChange={(v) => onChange("connectorType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select available connectors" />
          </SelectTrigger>
          <SelectContent>
            {CONNECTOR_TYPES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Connector Count</Label>
        <Select
          value={data.connectorCount}
          onValueChange={(v) => onChange("connectorCount", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 4, 8].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" disabled={!canProceed} onClick={onNext}>
          Next
        </Button>
      </DialogFooter>
    </div>
  );
};
