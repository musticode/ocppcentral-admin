import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/api";

function formatDuration(startedAt: string, stoppedAt?: string): string {
  if (!stoppedAt) return "—";
  try {
    const start = new Date(startedAt).getTime();
    const end = new Date(stoppedAt).getTime();
    const ms = end - start;
    if (ms < 0) return "—";
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    const remainderMins = mins % 60;
    if (hours > 0) return `${hours}h ${remainderMins}m`;
    return `${mins}m`;
  } catch {
    return "—";
  }
}

export const SessionDetails = ({
  open,
  onOpenChange,
  session,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Transaction | null;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            View session information and charging data.
          </DialogDescription>
        </DialogHeader>

        {!session ? (
          <p className="text-muted-foreground text-sm py-4">
            Select a session to view details.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Transaction ID</Label>
                <p className="text-sm font-medium">{session.transactionId}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Status</Label>
                <p className="text-sm font-medium">
                  <Badge
                    variant={
                      session.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {session.status}
                  </Badge>
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Charge Point ID</Label>
                <p className="text-sm font-medium">{session.chargePointId}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Connector ID</Label>
                <p className="text-sm font-medium">{session.connectorId}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">ID Tag</Label>
                <p className="text-sm font-medium">{session.idTag}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Reservation ID</Label>
                <p className="text-sm font-medium">
                  {session.reservationId ?? "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Timestamp</Label>
                <p className="text-sm font-medium">{session.timestamp}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Started At</Label>
                <p className="text-sm font-medium">{session.startedAt}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Stopped At</Label>
                <p className="text-sm font-medium">
                  {session.stoppedAt ?? "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Duration</Label>
                <p className="text-sm font-medium">
                  {formatDuration(session.startedAt, session.stoppedAt)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Meter Start</Label>
                <p className="text-sm font-medium">{session.meterStart}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Meter Stop</Label>
                <p className="text-sm font-medium">
                  {session.meterStop ?? "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Energy Consumed (kWh)</Label>
                <p className="text-sm font-medium">
                  {session.energyConsumed ?? "—"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Stop Reason</Label>
                <p className="text-sm font-medium">
                  {session.stopReason ?? "—"}
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Meter Values</Label>
                <p className="text-sm font-medium">
                  {session.meterValues?.length
                    ? `${session.meterValues.length} reading(s)`
                    : "—"}
                </p>
                {session.meterValues && session.meterValues.length > 0 && (
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
                    {session.meterValues.map((mv, i) => (
                      <li key={i}>
                        {mv.value} {mv.unit} ({mv.measurand})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
