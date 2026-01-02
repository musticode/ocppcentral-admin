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
import { ConnectorStatus } from "@/types/ocpp";
import { chargePointApi } from "@/api";

export const ChargePointsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["charge-points"],
    queryFn: () => chargePointApi.getChargePoints(),
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Chargers</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Charge Points</CardTitle>
        </CardHeader>
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
              {data?.data.map((cp) => (
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
