import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RFIDTagsList from "./RFIDTagsList";

export const RFIDOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>RFID Tags Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RFIDTagsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default RFIDOverview;
