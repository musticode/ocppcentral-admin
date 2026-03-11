import { UserList } from "./UserList";
import { CreateUserModal } from "./CreateUserModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UsersStatsCards } from "./components/UsersStatsCards";

export const UserOverview = () => {
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setCreateUserModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>

      <UsersStatsCards />

      <div className="mt-6">
        <UserList />
      </div>

      <CreateUserModal
        open={createUserModalOpen}
        onOpenChange={setCreateUserModalOpen}
      />
    </div>
  );
};
