import { Button } from "@/components/ui/button";
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
import { SessionDetails } from "./SessionDetails";
import { Transaction } from "@/types/api";
import { transactionApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { Session, TransactionStatus } from "@/types/ocpp";

export const SessionList = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const companyId = useCompanyStore((state) => state.companyId);
  const [open, setOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Transaction | null>(
    null
  );

  useEffect(() => {
    //if (!companyId) return;

    const controller = new AbortController();

    const fetchCompanySessions = async () => {
      try {
        const response = await transactionApi.getSessionsByCompany(
          companyId ?? "",
          controller.signal
        );
        console.log(response);
        setSessions((response.data as unknown as Session[]) ?? []);
      } catch (err) {
        if (err instanceof Error && err.name === "CanceledError") return;
        throw err;
      }
    };

    fetchCompanySessions();

    return () => controller.abort();
  }, [companyId]);

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Charge Point ID</TableHead>
              <TableHead>Connector ID</TableHead>
              <TableHead>ID Tag</TableHead>
              <TableHead>Meter Start</TableHead>
              <TableHead>Reservation ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Started At</TableHead>
              <TableHead>Stopped At</TableHead>
              <TableHead>Meter Stop</TableHead>
              <TableHead>Energy Consumed</TableHead>
              <TableHead>Meter Values</TableHead>
              <TableHead>Stop Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.transactionId}>
                <TableCell>{session.transactionId}</TableCell>
                <TableCell>{session.chargePointId}</TableCell>
                <TableCell>{session.connectorId}</TableCell>
                <TableCell>{session.idTag}</TableCell>
                <TableCell>{session.meterStart}</TableCell>
                <TableCell>{session.startTimestamp}</TableCell>
                <TableCell>{session.stopTimestamp}</TableCell>
                <TableCell>{session.meterStop}</TableCell>
                <TableCell>{session.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectedSession(session as unknown as Transaction);
                      setOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SessionDetails
          open={open}
          onOpenChange={setOpen}
          session={selectedSession}
        />
      </CardContent>
    </Card>
  );
};
