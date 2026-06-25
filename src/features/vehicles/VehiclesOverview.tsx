import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehiclesTable } from "./VehiclesTable";
import { CreateVehicleModal } from "./CreateVehicleModal";
import { VehiclesStatsCards } from "./VehiclesStatsCards";

export const VehiclesOverview = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Vehicles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage fleet vehicles and assign them to drivers
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Vehicle
        </Button>
      </div>

      <CreateVehicleModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      <VehiclesStatsCards />

      <div className="mt-6">
        <VehiclesTable />
      </div>
    </div>
  );
};
