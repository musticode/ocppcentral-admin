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
import type { Location } from "@/types/api";

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
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length > 0 &&
              locations.map((loc: Location) => (
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
                  <TableCell className="max-w-[240px] truncate text-gray-600">
                    {loc.description ?? "-"}
                  </TableCell>
                  <TableCell className="text-right text-gray-600">
                    {loc.createdAt ? new Date(loc.createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
