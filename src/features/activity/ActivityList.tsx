import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ActivityList = () => {
  const [activityList, setActivityList] = useState<any[]>([]);

  useEffect(() => {
    setActivityList([
      {
        timestamp: "2021-01-01 10:00:00",
        activity: "Activity 1",
        user: "User 1",
        location: "Location 1",
        chargePoint: "Charge Point 1",
        connector: "Connector 1",
        session: "Session 1",
        reservation: "Reservation 1",
        tariff: "Tariff 1",
        rfidTag: "RFID Tag 1",
        card: "Card 1",
      },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Charge Point</TableHead>
              <TableHead>Connector</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Reservation</TableHead>
              <TableHead>Tariff</TableHead>
              <TableHead>RFID Tag</TableHead>
              <TableHead>Card</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityList.map((activity) => (
              <TableRow key={activity.timestamp}>
                <TableCell>{activity.timestamp}</TableCell>
                <TableCell>{activity.activity}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.location}</TableCell>
                <TableCell>{activity.chargePoint}</TableCell>
                <TableCell>{activity.connector}</TableCell>
                <TableCell>{activity.session}</TableCell>
                <TableCell>{activity.reservation}</TableCell>
                <TableCell>{activity.tariff}</TableCell>
                <TableCell>{activity.rfidTag}</TableCell>
                <TableCell>{activity.card}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
