import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types/api";
import { Calendar, MapPin, Zap, User, Clock, X } from "lucide-react";

interface ReservationDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onCancel?: () => void;
}

const statusColors = {
  Active: "bg-green-500",
  Used: "bg-blue-500",
  Cancelled: "bg-gray-500",
  Expired: "bg-red-500",
};

export const ReservationDetail = ({
  open,
  onOpenChange,
  reservation,
  onCancel,
}: ReservationDetailProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
          <DialogDescription>
            Reservation ID: {reservation.reservationId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={statusColors[reservation.status]}>
              {reservation.status}
            </Badge>
            {reservation.status === "Active" && onCancel && (
              <Button variant="destructive" size="sm" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel Reservation
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Zap className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Charge Point</div>
                <div className="text-sm text-muted-foreground">
                  {reservation.chargePointName || reservation.chargePointId}
                </div>
                <div className="text-xs text-muted-foreground">
                  Connector: {reservation.connectorId}
                </div>
              </div>
            </div>

            {reservation.locationName && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {reservation.locationName}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">ID Tag</div>
                <div className="font-mono text-sm text-muted-foreground">
                  {reservation.idTag}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Expiry Date</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(reservation.expiryDate)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Created</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(reservation.createdAt)}
                </div>
              </div>
            </div>

            {reservation.transactionId && (
              <div className="flex items-start gap-3">
                <Zap className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Transaction ID</div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {reservation.transactionId}
                  </div>
                </div>
              </div>
            )}

            {reservation.cancelledAt && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="font-medium text-red-900">Cancellation Info</div>
                <div className="mt-1 text-sm text-red-700">
                  Cancelled at: {formatDate(reservation.cancelledAt)}
                </div>
                {reservation.cancelledBy && (
                  <div className="text-sm text-red-700">
                    Cancelled by: {reservation.cancelledBy}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
