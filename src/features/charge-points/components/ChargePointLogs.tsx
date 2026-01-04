import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export const ChargePointLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    setLogs([
      {
        timestamp: "2021-01-01 10:00:00",
        message: "Message 1",
        severity: "Info",
      },
      {
        timestamp: "2021-01-01 10:00:01",
        message: "Message 2",
        severity: "Warning",
      },
      {
        timestamp: "2021-01-01 10:00:02",
        message: "Message 3",
        severity: "Error",
      },
    ]);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Charge Point Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.timestamp}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.severity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
