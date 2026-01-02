import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationList } from "./ReservationList";

export const ReservationOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reservation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationList />
        </CardContent>
      </Card>
    </div>
  );
};
