import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";
import { ChargePointLogs } from "./ChargePointLogs";

interface SessionsPanelProps {
  chargerId: string;
}

const tabs = ["Sessions", "Transactions", "Reservations", "Logs"] as const;

const logsData = [
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
  {
    timestamp: "2021-01-01 10:00:03",
    message: "Message 4",
    severity: "Info",
  },
  {
    timestamp: "2021-01-01 10:00:04",
    message: "Message 5",
    severity: "Warning",
  },
];
// Dummy session data matching the image
const sessionsData = [
  {
    id: 1,
    timestamp: "2021/07/24 07:54:00",
    sessionId: "4555687",
    userId: "2345689",
    status: "Completed",
    duration: "1.1 hrs",
    highlighted: true,
  },
  {
    id: 2,
    timestamp: "2021/07/24 07:54:00",
    sessionId: "4555687",
    userId: "2345689",
    status: "Completed",
    duration: "1.1 hrs",
    highlighted: false,
  },
  {
    id: 3,
    timestamp: "2021/07/24 07:54:00",
    sessionId: "4555687",
    userId: "2345689",
    status: "Completed",
    duration: "1.1 hrs",
    highlighted: false,
  },
  {
    id: 4,
    timestamp: "2021/07/24 07:54:00",
    sessionId: "4555687",
    userId: "2345689",
    status: "Completed",
    duration: "1.1 hrs",
    highlighted: false,
  },
  {
    id: 5,
    timestamp: "2021/07/24 07:54:00",
    sessionId: "4555687",
    userId: "2345689",
    status: "Completed",
    duration: "1.1 hrs",
    highlighted: false,
  },
];

export const SessionsPanel = ({ chargerId }: SessionsPanelProps) => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Sessions");
  const [logs, setLogs] = useState<any[]>(logsData);

  useEffect(() => {
    setLogs(logsData);
  }, []);

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as (typeof tabs)[number])}
          className="space-y-6"
        >
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6 mt-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    defaultValue="2021-07-24"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" defaultValue="2021-07-24" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Timestamp
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </TableHead>
                      <TableHead>Session ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionsData.map((session) => (
                      <TableRow
                        key={session.id}
                        className={cn(
                          session.highlighted && "bg-purple-50 font-semibold",
                        )}
                      >
                        <TableCell
                          className={cn(session.highlighted && "text-base")}
                        >
                          {session.timestamp}
                        </TableCell>
                        <TableCell
                          className={cn(session.highlighted && "text-base")}
                        >
                          {session.sessionId}
                        </TableCell>
                        <TableCell
                          className={cn(session.highlighted && "text-base")}
                        >
                          {session.userId}
                        </TableCell>
                        <TableCell
                          className={cn(session.highlighted && "text-base")}
                        >
                          {session.status}
                        </TableCell>
                        <TableCell
                          className={cn(session.highlighted && "text-base")}
                        >
                          {session.duration}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
