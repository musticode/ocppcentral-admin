import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";

export const RFIDTagsList = () => {
  const [rfidTags, setRFIDTags] = useState<any[]>([]);

  useEffect(() => {
    setRFIDTags([
      {
        id: "1",
        name: "RFID Tag 1",
        status: "Active",
      },
      {
        id: "2",
        name: "RFID Tag 2",
        status: "Inactive",
      },
      {
        id: "3",
        name: "RFID Tag 3",
        status: "Active",
      },
    ]);
  }, []);

  return (
    <Card>
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
            {rfidTags.map((rfidTag) => (
              <TableRow key={rfidTag.id}>
                <TableCell>{rfidTag.id}</TableCell>
                <TableCell>{rfidTag.name}</TableCell>
                <TableCell>{rfidTag.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RFIDTagsList;
