import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConnectorStatusIndicator } from "@/components/ui/connector-status";
import { ChargePoint, ChargePointStatus } from "@/types/ocpp";
import { chargePointApi } from "@/api";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { CreateChargePointModal } from "./CreateChargePointModal";
import { useCompanyStore } from "@/store/company.store";
import { ChargePointsStatsCards } from "./ChargePointsStatsCards";

export const ChargePointsList = () => {
  const companyId = useCompanyStore((state) => state.companyId);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ChargePointStatus>("all");

  useEffect(() => {
    let cancelled = false;

    const fetchChargePoints = async () => {
      setIsLoading(true);
      try {
        const res = await chargePointApi.getChargePoints({
          companyId: companyId ?? "",
        });
        if (!cancelled) {
          setChargePoints(res.data ?? []);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchChargePoints();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  // if (!companyId) {
  //   return (
  //     <div className="p-6">Please sign in to view charge points.</div>
  //   );
  // }

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const filteredChargePoints = (chargePoints ?? []).filter((cp) => {
    const matchesSearch =
      cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.chargePointId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cp.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cp.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (cp.model?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "all" || cp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: ChargePointStatus) => {
    if (status === "Faulted" || status === "Unavailable") return "destructive";
    if (status === "Charging") return "default";
    if (status === "Preparing" || status === "Reserved") return "secondary";
    return "outline";
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Charge Points</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage chargers, connector health, and operational status
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Charge Point
        </Button>
      </div>

      <ChargePointsStatsCards chargePoints={chargePoints} />
      <CreateChargePointModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      //onSuccess={fetchChargePoints}
      />
      <Card>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search name, ID, location, vendor, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-[220px]">                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Preparing">Preparing</SelectItem>
                <SelectItem value="Charging">Charging</SelectItem>
                <SelectItem value="Finishing">Finishing</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Unavailable">Unavailable</SelectItem>
                <SelectItem value="Faulted">Faulted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Charge Point ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Connectors</TableHead>
                  <TableHead>Vendor / Model</TableHead>
                  <TableHead>OCPP</TableHead>
                  <TableHead>Last Heartbeat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChargePoints.map((cp) => (
                  <TableRow key={cp.id}>
                    <TableCell>
                      <Link
                        to={`/chargers/${cp.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {cp.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {cp.chargePointId}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/locations/${cp.locationId}`}
                        className="text-primary hover:underline"
                      >
                        {cp.locationName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(cp.status)}>
                        {cp.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {(cp.connectors ?? []).length}
                        </span>
                        <div className="flex gap-1">
                          {(cp.connectors ?? []).map((connector) => (
                            <ConnectorStatusIndicator
                              key={connector.id}
                              status={connector.status}
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {cp.vendor ?? "-"}
                        </div>
                        <div className="text-gray-500">{cp.model ?? "-"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{cp.ocppVersion ?? "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {cp.lastHeartbeat ? new Date(cp.lastHeartbeat).toLocaleString() : "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 pb-4">
            <div>
              Showing {filteredChargePoints.length} of {(chargePoints ?? []).length} charge points
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
