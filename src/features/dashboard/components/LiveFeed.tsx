import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveFeedProps {
  locationId: string;
}

export const LiveFeed = ({ locationId }: LiveFeedProps) => {
  // In a real app, this would fetch a live image or video feed
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-200">
          <div className="flex h-full items-center justify-center text-gray-500">
            Live feed placeholder - {locationId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
