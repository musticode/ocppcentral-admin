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

export const SessionDetails = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const session = {
    id: 1,
    name: "Session 1",
    status: "Active",
    startTime: "2021-01-01 10:00:00",
    endTime: "2021-01-01 11:00:00",
    energyKWh: 10,
    duration: "1 hour",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            View session information and charging data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Session Name</Label>
              <p className="text-sm font-medium">{session.name}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Status</Label>
              <p className="text-sm font-medium">{session.status}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Start Time</Label>
              <p className="text-sm font-medium">{session.startTime}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">End Time</Label>
              <p className="text-sm font-medium">{session.endTime}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Energy (kWh)</Label>
              <p className="text-sm font-medium">{session.energyKWh}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Duration</Label>
              <p className="text-sm font-medium">{session.duration}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
