import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConnectorStatusIndicator } from "@/components/ui/connector-status";
import { ChargePoint, ConnectorStatus } from "@/types/ocpp";
import { chargePointApi } from "@/api";
import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { CreateChargePointModal } from "./CreateChargePointModal";
import { useCompanyStore } from "@/store/company.store";

export const ChargePointsList = () => {
  const companyId = useCompanyStore((state) => state.companyId);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("companyId", companyId);
    const chargePoints = chargePointApi.getChargePoints({
      companyId: companyId ?? "",
    });

    setChargePoints(chargePoints.data ?? []);
  }, [companyId]);

  // if (!companyId) {
  //   return (
  //     <div className="p-6">Please sign in to view charge points.</div>
  //   );
  // }

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Charge Points</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Charge Point
        </Button>
      </div>
      <CreateChargePointModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        //onSuccess={fetchChargePoints}
      />
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Charge Point ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connectors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chargePoints.map((cp) => (
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
                    <ConnectorStatusIndicator
                      status={cp.status as unknown as ConnectorStatus}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(cp.connectors ?? []).map((connector) => (
                        <ConnectorStatusIndicator
                          key={connector.id}
                          status={connector.status}
                          size="sm"
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
