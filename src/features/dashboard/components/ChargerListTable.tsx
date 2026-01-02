import React, { useEffect } from "react";
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
import {
  ConnectorStatusBadge,
  ConnectorStatusIndicator,
} from "@/components/ui/connector-status";
import type { ChargePoint, Connector, Location } from "@/types/ocpp";
import { useState } from "react";
import { ConnectorStatus } from "@/types/ocpp";
interface ChargerListTableProps {
  location: Location;
}

export const ChargerListTable = ({ location }: ChargerListTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Charger List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Charger Name</TableHead>
              <TableHead>Charge ID</TableHead>
              <TableHead>Connector status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {location.chargePoints.map(
              (chargePoint: ChargePoint & { connectors: Connector[] }) => (
                <TableRow key={chargePoint.id}>
                  <TableCell>
                    <Link
                      to={`/chargers/${chargePoint.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {chargePoint.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {chargePoint.chargePointId}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {chargePoint.connectors.map((connector: Connector) => (
                        <ConnectorStatusBadge
                          key={connector.id}
                          status={connector.status as ConnectorStatus}
                        />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
