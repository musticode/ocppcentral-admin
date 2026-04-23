import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { chargePointApi, locationApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import {
  type WizardStep,
  type ChargerWizardData,
  defaultWizardData,
} from "./types";
import { StepBrandModel } from "./StepBrandModel";
import { StepSiteLocation } from "./StepSiteLocation";
import { StepChargerName } from "./StepChargerName";
import { StepChargerAdded } from "./StepChargerAdded";
import { StepOcppIntegration } from "./StepOcppIntegration";
import { StepOcppUrlConfig } from "./StepOcppUrlConfig";
import { StepConnectionFailed } from "./StepConnectionFailed";
import { StepConnectionSuccess } from "./StepConnectionSuccess";

const getOcppWsUrl = (chargePointId: string): string => {
  const envWsUrl = import.meta.env.VITE_OCPP_WS_URL as string | undefined;
  if (envWsUrl) {
    return `${envWsUrl.replace(/\/$/, "")}/${chargePointId}`;
  }
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
  const wsBase = apiBase
    .replace(/\/api$/, "")
    .replace(/^https:/, "wss:")
    .replace(/^http:/, "ws:");
  return `${wsBase}/ocpp/${chargePointId}`;
};

interface AddChargerWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddChargerWizard = ({
  open,
  onOpenChange,
  onSuccess,
}: AddChargerWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>("brand-model");
  const [data, setData] = useState<ChargerWizardData>({ ...defaultWizardData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [wsUrl, setWsUrl] = useState("");
  const [connectionError, setConnectionError] = useState<{
    code?: string;
    title?: string;
    message?: string;
  }>({});

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: () => chargePointApi.getLocations(),
    enabled: open,
  });

  const handleChange = useCallback(
    (field: keyof ChargerWizardData, value: string | boolean) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetWizard = useCallback(() => {
    setStep("brand-model");
    setData({ ...defaultWizardData });
    setIsSubmitting(false);
    setIsPairing(false);
    setWsUrl("");
    setConnectionError({});
  }, []);

  const handleClose = useCallback(
    (openState: boolean) => {
      if (!openState) resetWizard();
      onOpenChange(openState);
    },
    [onOpenChange, resetWizard]
  );

  const handleCreateChargePoint = async () => {
    setIsSubmitting(true);
    try {
      let locationId = data.locationId;

      // Create new location if needed
      if (data.siteOption === "new") {
        const newLoc = await locationApi.createLocation({
          name: data.newSiteName,
          address: data.newSiteAddress,
        });
        locationId = newLoc.id;
      }

      await chargePointApi.createChargePoint({
        name: data.name,
        chargePointId:
          data.chargePointId || `CP-${Date.now().toString(36).toUpperCase()}`,
        locationId,
        model: data.model || undefined,
        vendor: data.vendor || undefined,
        ocppVersion: data.ocppVersion,
        connectorCount: parseInt(data.connectorCount, 10),
      });

      toast({
        title: "Charge point created",
        description: "The charge point has been created successfully.",
      });
      onSuccess?.();
      setStep("charger-added");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create charge point.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePair = async () => {
    setIsPairing(true);
    try {
      // Simulate pairing attempt — in production this would check WebSocket connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if charger is connected by fetching its status
      const cp = await chargePointApi.getChargePointById(data.chargePointId);
      if (cp.status === "Unavailable" || cp.status === "Faulted") {
        setConnectionError({
          title: "Connection timeout",
          message: `Charge point ${data.chargePointId} did not establish a connection. Make sure the OCPP URL is configured correctly on the charger.`,
        });
        setStep("connection-failed");
      } else {
        setStep("connection-success");
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setConnectionError({
        title: "Connection failed",
        message: msg,
      });
      setStep("connection-failed");
    } finally {
      setIsPairing(false);
    }
  };

  // Determine dialog title based on step
  const getTitle = () => {
    switch (step) {
      case "brand-model":
      case "site-location":
      case "charger-name":
        return "Add charger";
      case "charger-added":
      case "ocpp-integration":
      case "ocpp-url-config":
      case "connection-failed":
      case "connection-success":
        return "";
    }
  };

  const showHeader = ["brand-model", "site-location", "charger-name"].includes(step);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {showHeader && (
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription className="sr-only">
              Multi-step charger registration wizard
            </DialogDescription>
          </DialogHeader>
        )}

        {step === "brand-model" && (
          <StepBrandModel
            data={data}
            onChange={handleChange}
            onNext={() => setStep("site-location")}
            onCancel={() => handleClose(false)}
          />
        )}

        {step === "site-location" && (
          <StepSiteLocation
            data={data}
            onChange={handleChange}
            onNext={() => setStep("charger-name")}
            onBack={() => setStep("brand-model")}
            onCancel={() => handleClose(false)}
            locations={locations}
          />
        )}

        {step === "charger-name" && (
          <StepChargerName
            data={data}
            onChange={handleChange}
            onNext={handleCreateChargePoint}
            onBack={() => setStep("site-location")}
            onCancel={() => handleClose(false)}
            isSubmitting={isSubmitting}
          />
        )}

        {step === "charger-added" && (
          <StepChargerAdded
            onConnect={() => setStep("ocpp-integration")}
            onSkip={() => handleClose(false)}
          />
        )}

        {step === "ocpp-integration" && (
          <StepOcppIntegration
            data={data}
            onChange={handleChange}
            onNext={() => {
              setWsUrl(getOcppWsUrl(data.chargePointId));
              setStep("ocpp-url-config");
            }}
            onBack={() => setStep("charger-added")}
          />
        )}

        {step === "ocpp-url-config" && (
          <StepOcppUrlConfig
            data={data}
            wsUrl={wsUrl}
            onPair={handlePair}
            onBack={() => setStep("ocpp-integration")}
            isPairing={isPairing}
          />
        )}

        {step === "connection-failed" && (
          <StepConnectionFailed
            errorCode={connectionError.code}
            errorTitle={connectionError.title}
            errorMessage={connectionError.message}
            chargePointId={data.chargePointId}
            onRetry={() => {
              setConnectionError({});
              setStep("ocpp-url-config");
            }}
            onBack={() => setStep("ocpp-url-config")}
          />
        )}

        {step === "connection-success" && (
          <StepConnectionSuccess
            chargePointId={data.chargePointId}
            onDone={() => handleClose(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
