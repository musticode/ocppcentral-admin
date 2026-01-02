import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export const ReservationList = () => {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    setReservations([
      {
        id: 1,
        name: "Reservation 1",
        status: "Active",
        startTime: "2021-01-01 10:00:00",
        endTime: "2021-01-01 11:00:00",
      },
      {
        id: 2,
        name: "Reservation 2",
        status: "Inactive",
        startTime: "2021-01-01 11:00:00",
        endTime: "2021-01-01 12:00:00",
      },
      {
        id: 3,
        name: "Reservation 3",
        status: "Active",
        startTime: "2021-01-01 12:00:00",
        endTime: "2021-01-01 13:00:00",
      },
    ]);
  }, [reservations]);
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.name}</TableCell>
                <TableCell>{reservation.status}</TableCell>
                <TableCell>{reservation.startTime}</TableCell>
                <TableCell>{reservation.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
