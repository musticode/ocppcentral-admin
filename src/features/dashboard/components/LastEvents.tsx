import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactionApi } from "@/api";
import type { Event } from "@/types/ocpp";

interface LastEventsProps {
  locationId: string;
}

export const LastEvents = ({ locationId }: LastEventsProps) => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", locationId],
    queryFn: () => transactionApi.getEvents({ limit: 5 }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last Events</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="border-b pb-2 last:border-0">
                <p className="text-sm text-gray-900">{event.message}</p>
                <p className="text-xs text-gray-500">{event.timestamp}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No events found</p>
        )}
      </CardContent>
    </Card>
  );
};
