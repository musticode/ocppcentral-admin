import { DetailModal } from "@/components/ui/DetailModal";

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
    <DetailModal
      open={open}
      onOpenChange={onOpenChange}
      title="Session Details"
      description="View session information"
      size="md"
    >
      <div className="space-y-2">
        <div>
          <strong>Name:</strong> {session.name}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <strong>Start Time:</strong> {session.startTime}
        </div>
        <div>
          <strong>End Time:</strong> {session.endTime}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <strong>Energy KWh:</strong> {session.energyKWh}
        </div>
        <div>
          <strong>Duration:</strong> {session.duration}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <strong>Status:</strong> {session.status}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <strong>Start Time:</strong> {session.startTime}
        </div>
        <div>
          <strong>End Time:</strong> {session.endTime}
        </div>
      </div>
    </DetailModal>
  );
};
