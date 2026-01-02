import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string;
  chargePointId: string;
  connectorId: number;
  message: string;
  timestamp: string;
}

interface LastEventsCardProps {
  events: Event[];
}

export const LastEventsCard = ({ events }: LastEventsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Last events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-200 pb-3 last:border-0"
            >
              <p className="text-sm text-gray-900">{event.message}</p>
              <p className="mt-1 text-xs text-gray-500">{event.timestamp}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
