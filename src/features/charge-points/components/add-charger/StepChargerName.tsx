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
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import type { ChargerWizardData } from "./types";

interface Props {
  data: ChargerWizardData;
  onChange: (field: keyof ChargerWizardData, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ACCESS_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "restricted", label: "Restricted" },
];

export const StepChargerName = ({
  data,
  onChange,
  onNext,
  onBack,
  onCancel,
  isSubmitting,
}: Props) => {
  const canProceed = data.name.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chargerName">Charger name</Label>
        <Input
          id="chargerName"
          placeholder="Add a charger name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Charger access</Label>
        <Select
          value={data.chargerAccess}
          onValueChange={(v) => onChange("chargerAccess", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Please select accessibility" />
          </SelectTrigger>
          <SelectContent>
            {ACCESS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Set charger as active</p>
          <p className="text-sm text-muted-foreground">
            A charger in inactive mode can still be used for testing your setup.
            Set it to Active to enable full functionality.
          </p>
        </div>
        <Switch
          checked={data.isActive}
          onCheckedChange={(v) => onChange("isActive", v)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Show on map</p>
          <p className="text-sm text-muted-foreground">
            Enable this feature to have the charger visible to end-users in the
            app.
          </p>
        </div>
        <Switch
          checked={data.showOnMap}
          onCheckedChange={(v) => onChange("showOnMap", v)}
        />
      </div>

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="button"
            disabled={!canProceed || isSubmitting}
            onClick={onNext}
          >
            {isSubmitting ? "Creating..." : "Next"}
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
};
