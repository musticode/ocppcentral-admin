import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FleetsTable } from "./components/FleetsTable";
import { CreateFleetModal } from "./components/CreateFleetModal";
import { FleetStatsCards } from "./components/FleetStatsCards";

export const FleetsOverview = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your EV fleets, vehicles, and drivers
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Fleet
        </Button>
      </div>

      <FleetStatsCards />

      <div className="mt-6">
        <FleetsTable />
      </div>

      <CreateFleetModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};
