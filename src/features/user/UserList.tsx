import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";

export const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleActionModalOpen = (user: any) => {
    setSelectedUser(user);
    setActionModalOpen(true);
  };

  const handleActionModalClose = () => {
    setActionModalOpen(false);
  };

  const handleAction = (action: string) => {
    console.log(action, selectedUser);
  };

  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        company: "Company 1",
        status: "Active",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        role: "User",
        company: "Company 2",
        status: "Inactive",
      },
      {
        id: 3,
        name: "Jim Doe",
        email: "jim.doe@example.com",
        role: "Admin",
        company: "Company 3",
        status: "Active",
      },
      {
        id: 4,
        name: "Jill Doe",
        email: "jill.doe@example.com",
        role: "User",
        company: "Company 4",
        status: "Inactive",
      },
      {
        id: 5,
        name: "Jack Doe",
        email: "jack.doe@example.com",
        role: "Admin",
        company: "Company 5",
        status: "Active",
      },
      {
        id: 6,
        name: "Jill Doe",
        email: "jill.doe@example.com",
        role: "User",
        company: "Company 6",
        status: "Inactive",
      },
      {
        id: 7,
        name: "Jack Doe",
        email: "jack.doe@example.com",
        role: "Admin",
        company: "Company 7",
        status: "Active",
      },
    ]);
  }, []);

  return (
    <>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleActionModalOpen(user)}
                  >
                    <EllipsisVerticalIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};
