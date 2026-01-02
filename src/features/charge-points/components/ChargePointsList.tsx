import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConnectorStatusIndicator } from "@/components/ui/connector-status";
import { ChargePoint, Connector, ConnectorStatus } from "@/types/ocpp";
import { chargePointApi } from "@/api";
import { useEffect, useState } from "react";

export const ChargePointsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["charge-points"],
    queryFn: () => chargePointApi.getChargePoints(),
  });

  const [chargePointList, setChargePointList] = useState<any>([
    {
      id: "1",
      name: "Charger 1",
      chargePointId: "1234567890",
      locationId: "1",
      locationName: "Location 1",
      status: ConnectorStatus.AVAILABLE,
      connectors: [{ id: "1", status: ConnectorStatus.AVAILABLE }],
    },
    {
      id: "2",
      name: "Charger 2",
      chargePointId: "1234567891",
      locationId: "2",
      locationName: "Location 2",
      status: ConnectorStatus.AVAILABLE,
      connectors: [{ id: "2", status: ConnectorStatus.AVAILABLE }],
    },
    {
      id: "3",
      name: "Charger 3",
      chargePointId: "1234567892",
      locationId: "3",
      locationName: "Location 3",
      status: ConnectorStatus.AVAILABLE,
      connectors: [{ id: "3", status: ConnectorStatus.AVAILABLE }],
    },
  ]);

  const [chargePoints, setChargePoints] = useState<
    (ChargePoint & { connectors: Connector[] })[]
  >([]);

  useEffect(() => {
    setChargePoints(chargePointList);
  }, [chargePointList]);

  if (isLoading || !chargePoints) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Charge Points</h1>
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
                      {cp.connectors.map((connector) => (
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
