import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import { isDemoMode } from "@/demo/demoMode";
import { useCompanyStore } from "@/store/company.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, Download } from "lucide-react";
import { SessionDetailModal } from "./SessionDetailModal";

export const SessionList = () => {
  const companyId = useCompanyStore((state) => state.companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Completed" | "Failed">("all");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions", companyId],
    queryFn: () => transactionApi.getSessionsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const sessionData = sessions?.data || [];

  const filteredSessions = sessionData.filter((session: any) => {
    const matchesSearch =
      session.chargePointId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.idTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.transactionId?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (session: any) => {
    setSelectedSession(session);
    setDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const calculateEnergy = (session: any) => {
    if (session.meterStop && session.meterStart) {
      return ((session.meterStop - session.meterStart) / 1000).toFixed(2);
    }
    return "-";
  };

  const calculateDuration = (session: any) => {
    if (session.startTimestamp && session.stopTimestamp) {
      const duration = (new Date(session.stopTimestamp).getTime() - new Date(session.startTimestamp).getTime()) / (1000 * 60);
      return `${Math.floor(duration)} min`;
    }
    if (session.startTimestamp && session.status === "Active") {
      const duration = (Date.now() - new Date(session.startTimestamp).getTime()) / (1000 * 60);
      return `${Math.floor(duration)} min (ongoing)`;
    }
    return "-";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charging Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading sessions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Charging Sessions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by charge point, ID tag, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sessions found matching your criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Charge Point</TableHead>
                    <TableHead>Connector</TableHead>
                    <TableHead>ID Tag</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Energy (kWh)</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stop Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session: any) => (
                    <TableRow key={session.transactionId}>
                      <TableCell className="font-medium">
                        #{session.transactionId}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{session.chargePointId}</div>
                      </TableCell>
                      <TableCell>{session.connectorId}</TableCell>
                      <TableCell>
                        <div className="text-sm">{session.idTag}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(session.startTimestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{calculateDuration(session)}</TableCell>
                      <TableCell className="font-medium">
                        {calculateEnergy(session)}
                      </TableCell>
                      <TableCell>
                        {session.totalCost !== undefined
                          ? `$${session.totalCost.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {session.stopReason || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(session)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              Showing {filteredSessions.length} of {sessionData.length} sessions
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      )}
    </>
  );
};
