import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import type { Event } from "@/types/ocpp";

export const ActivityList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Event["type"]>("all");

  const {
    data: events,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["events", "activity-list"],
    queryFn: () => transactionApi.getEvents({ limit: 200 }),
  });

  const list = (events ?? [])
    .map((e) => ({
      ...e,
      severity: e.severity ?? "info",
    }))
    .filter((e) => {
      const matchesSearch =
        e.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.chargePointId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.connectorId !== undefined && String(e.connectorId).includes(searchTerm)) ||
        e.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = severityFilter === "all" || e.severity === severityFilter;
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      return matchesSearch && matchesSeverity && matchesType;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getSeverityVariant = (severity: string) => {
    if (severity === "error") return "destructive";
    if (severity === "warning") return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Log</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search message, charge point, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={severityFilter} onValueChange={(v: any) => setSeverityFilter(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severity</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="StatusNotification">StatusNotification</SelectItem>
              <SelectItem value="MeterValues">MeterValues</SelectItem>
              <SelectItem value="StartTransaction">StartTransaction</SelectItem>
              <SelectItem value="StopTransaction">StopTransaction</SelectItem>
              <SelectItem value="Heartbeat">Heartbeat</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading activity...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No activity found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Charge Point</TableHead>
                <TableHead>Connector</TableHead>
                <TableHead>Message</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="text-sm">{new Date(event.timestamp).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(event.severity)}>{event.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{event.chargePointId}</TableCell>
                  <TableCell>{event.connectorId ?? "-"}</TableCell>
                  <TableCell>
                    <div className="max-w-xl truncate text-sm text-gray-700">{event.message}</div>
                  </TableCell>
                  <TableCell>
                    {/* <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
