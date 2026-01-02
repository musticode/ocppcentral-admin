import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export const TariffList = () => {
  const [tariffs, setTariffs] = useState<any[]>([]);

  useEffect(() => {
    setTariffs([
      { id: 1, name: "Tariff 1", status: "Active" },
      { id: 2, name: "Tariff 2", status: "Inactive" },
      { id: 3, name: "Tariff 3", status: "Active" },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tariff List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tariffs.map((tariff) => (
              <TableRow key={tariff.id}>
                <TableCell>{tariff.id}</TableCell>
                <TableCell>{tariff.name}</TableCell>
                <TableCell>{tariff.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
