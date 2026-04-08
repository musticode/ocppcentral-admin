import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";

export const VehiclesTable = () => {
  const companyId = useCompanyStore((s) => s.companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", companyId],
    queryFn: () => carsApi.getCars({ companyId: companyId ?? undefined }),
  });

  const filtered = useMemo(() => {
    const list = vehicles ?? [];
    return list
      .filter((v) => {
        const matchesSearch =
          v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && v.isActive) ||
          (statusFilter === "inactive" && !v.isActive);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        a.licensePlate.localeCompare(b.licensePlate, undefined, { numeric: true })
      );
  }, [vehicles, searchTerm, statusFilter]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search plate, make/model, VIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License Plate</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Charging Port</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <Link
                      to={`/vehicles/${v.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {v.licensePlate}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {v.make} {v.model}
                  </TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>{v.chargingPort ?? "-"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="max-w-[180px] truncate">{v.vin ?? "-"}</div>
                  </TableCell>
                  <TableCell>
                    {v.batteryCapacity != null ? `${v.batteryCapacity} kWh` : "-"}
                  </TableCell>
                  <TableCell>{v.range != null ? `${v.range} km` : "-"}</TableCell>
                  <TableCell>
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={v.isActive ? "default" : "secondary"}>
                      {v.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/vehicles/${v.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filtered.length} of {(vehicles ?? []).length} vehicles
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
