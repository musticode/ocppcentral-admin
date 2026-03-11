import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Clock, 
  Battery, 
  DollarSign, 
  MapPin, 
  User, 
  Calendar,
  Activity,
  TrendingUp
} from "lucide-react";

interface SessionDetailModalProps {
  session: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SessionDetailModal = ({
  session,
  open,
  onOpenChange,
}: SessionDetailModalProps) => {
  if (!session) return null;

  const calculateEnergy = () => {
    if (session.meterStop && session.meterStart) {
      return ((session.meterStop - session.meterStart) / 1000).toFixed(2);
    }
    return "0.00";
  };

  const calculateDuration = () => {
    if (session.startTimestamp && session.stopTimestamp) {
      const duration = (new Date(session.stopTimestamp).getTime() - new Date(session.startTimestamp).getTime()) / (1000 * 60);
      return Math.floor(duration);
    }
    if (session.startTimestamp && session.status === "Active") {
      const duration = (Date.now() - new Date(session.startTimestamp).getTime()) / (1000 * 60);
      return Math.floor(duration);
    }
    return 0;
  };

  const calculateAveragePower = () => {
    const energy = parseFloat(calculateEnergy());
    const duration = calculateDuration() / 60; // hours
    if (duration > 0) {
      return (energy / duration).toFixed(2);
    }
    return "0.00";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Session #{session.transactionId}
            </DialogTitle>
            <Badge variant={getStatusColor(session.status)}>
              {session.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="h-4 w-4 text-blue-600" />
                <div className="text-sm font-medium text-blue-600">Energy</div>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {calculateEnergy()} kWh
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div className="text-sm font-medium text-green-600">Duration</div>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {calculateDuration()} min
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div className="text-sm font-medium text-purple-600">Avg Power</div>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {calculateAveragePower()} kW
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <div className="text-sm font-medium text-yellow-600">Cost</div>
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                ${session.totalCost?.toFixed(2) || "0.00"}
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Session Information</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Transaction ID</span>
                <span className="text-sm text-gray-600 font-mono">
                  {session.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
              </div>
              {session.stopReason && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Stop Reason</span>
                  <span className="text-sm text-gray-600">{session.stopReason}</span>
                </div>
              )}
              {session.reservationId && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Reservation ID</span>
                  <span className="text-sm text-gray-600">{session.reservationId}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Charge Point Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Charge Point Details</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Charge Point ID</span>
                <span className="text-sm text-gray-600 font-mono">
                  {session.chargePointId}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Connector ID</span>
                <span className="text-sm text-gray-600">{session.connectorId}</span>
              </div>
              {session.location && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <span className="text-sm text-gray-600">{session.location}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">User Information</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">ID Tag</span>
                <span className="text-sm text-gray-600 font-mono">{session.idTag}</span>
              </div>
              {session.userName && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">User Name</span>
                  <span className="text-sm text-gray-600">{session.userName}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Timing Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Timing</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Start Time</div>
                <div className="text-lg font-semibold">
                  {new Date(session.startTimestamp).toLocaleString()}
                </div>
              </div>
              {session.stopTimestamp && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Stop Time</div>
                  <div className="text-lg font-semibold">
                    {new Date(session.stopTimestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Meter Readings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Battery className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold">Meter Readings</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Start</div>
                <div className="text-xl font-bold mt-1">
                  {session.meterStart ? (session.meterStart / 1000).toFixed(2) : "0.00"} kWh
                </div>
              </div>
              {session.meterStop && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Stop</div>
                  <div className="text-xl font-bold mt-1">
                    {(session.meterStop / 1000).toFixed(2)} kWh
                  </div>
                </div>
              )}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600">Consumed</div>
                <div className="text-xl font-bold text-blue-900 mt-1">
                  {calculateEnergy()} kWh
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {session.totalCost !== undefined && (
            <>
              <Separator />
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-3 text-blue-900">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  {session.energyCost !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Energy Cost</span>
                      <span className="font-medium">${session.energyCost.toFixed(2)}</span>
                    </div>
                  )}
                  {session.timeCost !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Time Cost</span>
                      <span className="font-medium">${session.timeCost.toFixed(2)}</span>
                    </div>
                  )}
                  {session.sessionFee !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Session Fee</span>
                      <span className="font-medium">${session.sessionFee.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-blue-900 text-base">
                    <span>Total Cost</span>
                    <span>${session.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
