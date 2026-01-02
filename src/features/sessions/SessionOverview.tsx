import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionList } from "./SessionList";

export const SessionOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionList />
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionOverview;
