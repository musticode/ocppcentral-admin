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
import { PlusCircle, Zap, ArrowRight } from "lucide-react";
import type { ChargerWizardData } from "./types";
import type { Location } from "@/types/ocpp";

interface Props {
  data: ChargerWizardData;
  onChange: (field: keyof ChargerWizardData, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  locations: Location[];
}

export const StepSiteLocation = ({
  data,
  onChange,
  onNext,
  onBack,
  onCancel,
  locations,
}: Props) => {
  const showNewSiteForm = data.siteOption === "new";
  const showExistingSelect = data.siteOption === "existing";

  const canProceed =
    data.siteOption === "none" ||
    (data.siteOption === "existing" && data.locationId) ||
    (data.siteOption === "new" && data.newSiteName && data.newSiteAddress);

  return (
    <div className="space-y-4">
      {/* Option cards */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onChange("siteOption", "new")}
          className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent ${data.siteOption === "new" ? "border-primary bg-accent/50" : "border-border"
            }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <PlusCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Add to a new charge site</p>
            <p className="text-sm text-muted-foreground">Create a new charge site</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => onChange("siteOption", "existing")}
          className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent ${data.siteOption === "existing" ? "border-primary bg-accent/50" : "border-border"
            }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Add to an existing charge site</p>
            <p className="text-sm text-muted-foreground">Select an existing charge site</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => {
            onChange("siteOption", "none");
            onChange("locationId", "");
          }}
          className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent ${data.siteOption === "none" ? "border-primary bg-accent/50" : "border-border"
            }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Continue without a charge site</p>
            <p className="text-sm text-muted-foreground">Add only the charger address</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Existing site selector */}
      {showExistingSelect && (
        <div className="space-y-2 pt-2">
          <Label>Select location</Label>
          <Select
            value={data.locationId}
            onValueChange={(v) => onChange("locationId", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a charge site" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name} — {loc.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* New site form */}
      {showNewSiteForm && (
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label>Site name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g., Main Office"
              value={data.newSiteName}
              onChange={(e) => onChange("newSiteName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Address <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g., 123 Main St, City"
              value={data.newSiteAddress}
              onChange={(e) => onChange("newSiteAddress", e.target.value)}
            />
          </div>
        </div>
      )}

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" disabled={!canProceed} onClick={onNext}>
            Next
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
};
