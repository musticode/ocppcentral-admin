import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "@/api";
import { useCompanyStore } from "@/store/company.store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const VehiclesTable = () => {
  const companyId = useCompanyStore((s) => s.companyId);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", companyId],
    queryFn: () => carsApi.getCars({ companyId: companyId ?? undefined }),
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>License Plate</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Charging Port</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(vehicles ?? []).map((v) => (
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
                <TableCell>
                  <Badge variant={v.isActive ? "default" : "secondary"}>
                    {v.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
