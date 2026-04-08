import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { locationApi } from "@/api";
import { safeAddress } from "@/api/utils";
import type { Location } from "@/types/api";
import { Search } from "lucide-react";

export const LocationsList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationApi.getLocations(),
  });

  const filtered = useMemo(() => {
    return (locations ?? [])
      .filter((loc) => {
        const q = searchTerm.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          safeAddress(loc.address).toLowerCase().includes(q) ||
          (loc.description?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, searchTerm]);

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
      <CardHeader>
        <CardTitle>Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search name, address, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Stations</TableHead>
                <TableHead className="text-right">Connectors</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 &&
                filtered.map((loc: Location) => (
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
                      {safeAddress(loc.address)}
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate text-gray-600">
                      {loc.description ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {(loc as any).totalStations ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {(loc as any).totalConnectors ?? "-"}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {loc.createdAt ? new Date(loc.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filtered.length} of {(locations ?? []).length} locations
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
