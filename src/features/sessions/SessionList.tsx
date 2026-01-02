import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export const SessionList = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    setSessions([
      {
        id: 1,
        name: "Session 1",
        status: "Active",
        startTime: "2021-01-01 10:00:00",
        endTime: "2021-01-01 11:00:00",
        energyKWh: 10,
        duration: "1 hour",
      },
      {
        id: 2,
        name: "Session 2",
        status: "Inactive",
        startTime: "2021-01-01 11:00:00",
        endTime: "2021-01-01 12:00:00",
        energyKWh: 20,
        duration: "1 hour",
      },
      {
        id: 3,
        name: "Session 3",
        status: "Active",
        startTime: "2021-01-01 12:00:00",
        endTime: "2021-01-01 13:00:00",
        energyKWh: 30,
        duration: "1 hour",
      },
      {
        id: 4,
        name: "Session 4",
        status: "Inactive",
        startTime: "2021-01-01 13:00:00",
        endTime: "2021-01-01 14:00:00",
        energyKWh: 40,
        duration: "1 hour",
      },
      {
        id: 5,
        name: "Session 5",
        status: "Active",
        startTime: "2021-01-01 14:00:00",
        endTime: "2021-01-01 15:00:00",
        energyKWh: 50,
        duration: "1 hour",
      },
      {
        id: 6,
        name: "Session 6",
        status: "Inactive",
        startTime: "2021-01-01 15:00:00",
        endTime: "2021-01-01 16:00:00",
        energyKWh: 60,
        duration: "1 hour",
      },
      {
        id: 7,
        name: "Session 7",
        status: "Active",
        startTime: "2021-01-01 16:00:00",
        endTime: "2021-01-01 17:00:00",
        energyKWh: 70,
        duration: "1 hour",
      },
      {
        id: 8,
        name: "Session 8",
        status: "Inactive",
        startTime: "2021-01-01 17:00:00",
        endTime: "2021-01-01 18:00:00",
        energyKWh: 80,
        duration: "1 hour",
      },
      {
        id: 9,
        name: "Session 9",
        status: "Active",
        startTime: "2021-01-01 18:00:00",
        endTime: "2021-01-01 19:00:00",
        energyKWh: 90,
        duration: "1 hour",
      },
      {
        id: 10,
        name: "Session 10",
        status: "Inactive",
        startTime: "2021-01-01 19:00:00",
        endTime: "2021-01-01 20:00:00",
        energyKWh: 100,
        duration: "1 hour",
      },
    ]);
  }, []);
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
              <TableHead>Energy KWh</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.id}</TableCell>
                <TableCell>{session.name}</TableCell>
                <TableCell>{session.status}</TableCell>
                <TableCell>{session.startTime}</TableCell>
                <TableCell>{session.endTime}</TableCell>
                <TableCell>{session.energyKWh}</TableCell>
                <TableCell>{session.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
