import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface Props {
  errorCode?: string;
  errorTitle?: string;
  errorMessage?: string;
  chargePointId: string;
  onRetry: () => void;
  onBack: () => void;
}

export const StepConnectionFailed = ({
  errorCode,
  errorTitle,
  errorMessage,
  chargePointId,
  onRetry,
  onBack,
}: Props) => {
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
        <h2 className="text-xl font-semibold">Connection failed</h2>
      </div>

      <div className="flex justify-center py-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Error code:</span>
          <span>{errorCode || "null"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Error title:</span>
          <span>{errorTitle || "Unknown error"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Error message:</span>
          <span>
            {errorMessage ||
              `Failed to establish connection with charge point: ${chargePointId}`}
          </span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
};
