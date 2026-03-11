import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tariffApi } from "@/api";
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
import { Eye, Edit, Trash2, Search } from "lucide-react";
import { EditTariffModal } from "./EditTariffModal";
import type { Tariff } from "@/types/api";
import { Link } from "react-router-dom";

export const TariffList = () => {
  const companyId = useCompanyStore((state) => state.companyId);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: tariffs, isLoading } = useQuery({
    queryKey: ["tariffs", companyId],
    queryFn: () => tariffApi.getTariffsByCompany(companyId ?? ""),
    enabled: isDemoMode || !!companyId,
  });

  const filteredTariffs = tariffs?.filter((tariff) => {
    const matchesSearch = tariff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tariff.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && tariff.isActive) ||
      (statusFilter === "inactive" && !tariff.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (tariff: Tariff) => {
    setSelectedTariff(tariff);
    setEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tariffs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading tariffs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tariffs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tariffs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!filteredTariffs || filteredTariffs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tariffs found. Create your first tariff to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price/kWh</TableHead>
                    <TableHead>Price/Min</TableHead>
                    <TableHead>Price/Session</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTariffs.map((tariff) => (
                    <TableRow key={tariff.id}>
                      <TableCell className="font-medium">{tariff.name}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {tariff.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tariff.pricePerKwh !== undefined
                          ? `$${tariff.pricePerKwh.toFixed(3)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {tariff.pricePerMinute !== undefined
                          ? `$${tariff.pricePerMinute.toFixed(3)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {tariff.pricePerSession !== undefined
                          ? `$${tariff.pricePerSession.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {tariff.taxRate !== undefined
                          ? `${(tariff.taxRate * 100).toFixed(1)}%`
                          : "-"}
                      </TableCell>
                      <TableCell>{tariff.currency}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>From: {new Date(tariff.validFrom).toLocaleDateString()}</div>
                          {tariff.validTo && (
                            <div className="text-gray-500">
                              To: {new Date(tariff.validTo).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tariff.isActive ? "default" : "secondary"}>
                          {tariff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {tariff.chargePointId && tariff.connectorId ? (
                            <div>
                              <div className="font-medium">Connector</div>
                              <div className="text-gray-500 text-xs">
                                {tariff.chargePointId}:{tariff.connectorId}
                              </div>
                            </div>
                          ) : tariff.chargePointId ? (
                            <div>
                              <div className="font-medium">Charger</div>
                              <div className="text-gray-500 text-xs">{tariff.chargePointId}</div>
                            </div>
                          ) : (
                            <Badge variant="outline">Company-wide</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/tariff/${tariff.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tariff)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTariff && (
        <>
          <EditTariffModal
            tariff={selectedTariff}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />
        </>
      )}
    </>
  );
};
