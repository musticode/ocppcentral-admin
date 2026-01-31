import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { locationApi } from "@/api";
import type { Location } from "@/types/ocpp";

export const LocationsList = () => {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationApi.getLocations(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500">Loading locations...</p>
        </CardContent>
      </Card>
    );
  }

  if (locations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500">
            No locations yet. Create one to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Stations</TableHead>
              <TableHead className="text-right">Connectors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc: Location) => (
              <TableRow key={loc.id}>
                <TableCell>
                  <Link
                    to={`/locations/${loc.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {loc.name}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-gray-600">
                  {loc.address}
                </TableCell>
                <TableCell>{loc.city}</TableCell>
                <TableCell>{loc.country}</TableCell>
                <TableCell className="text-right">{loc.totalStations}</TableCell>
                <TableCell className="text-right">{loc.totalConnectors}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
