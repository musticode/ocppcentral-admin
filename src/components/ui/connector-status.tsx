import { ConnectorStatus } from "@/types/ocpp";
import { cn } from "@/utils/cn";

interface ConnectorStatusIndicatorProps {
  status: ConnectorStatus;
  size?: "sm" | "md" | "lg";
}

const statusColors: Record<ConnectorStatus, string> = {
  [ConnectorStatus.AVAILABLE]: "bg-green-500",
  [ConnectorStatus.RESERVED]: "bg-blue-500",
  [ConnectorStatus.CHARGING]: "bg-purple-500",
  [ConnectorStatus.FINISHING]: "bg-purple-300",
  [ConnectorStatus.FAULTED]: "bg-red-500",
  [ConnectorStatus.UNAVAILABLE]: "bg-gray-400",
  [ConnectorStatus.PREPARING]: "bg-yellow-500",
  [ConnectorStatus.SUSPENDED_EVSE]: "bg-orange-500",
  [ConnectorStatus.SUSPENDED_EV]: "bg-orange-300",
};

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export const ConnectorStatusIndicator = ({
  status,
  size = "md",
}: ConnectorStatusIndicatorProps) => {
  return (
    <div
      className={cn(
        "rounded-full",
        statusColors[status] || "bg-gray-400",
        sizeClasses[size]
      )}
      title={status}
    />
  );
};

export const ConnectorStatusBadge = ({
  status,
}: {
  status: ConnectorStatus;
}) => {
  return (
    <div className="flex items-center gap-2">
      <ConnectorStatusIndicator status={status} size="sm" />
      <span className="text-sm text-gray-700">{status}</span>
    </div>
  );
};
