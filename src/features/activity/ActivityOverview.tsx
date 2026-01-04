import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityList } from "./ActivityList";

export const ActivityOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityOverview;
