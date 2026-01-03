import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "./UserList";
import { CreateUserModal } from "./CreateUserModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const UserOverview = () => {
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCreateUserModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </CardContent>
        <CreateUserModal
          open={createUserModalOpen}
          onOpenChange={setCreateUserModalOpen}
        />
        <CardContent>
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
};
