import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { LocationsList } from "./LocationsList";
import { CreateLocationModal } from "./CreateLocationModal";
import { useQueryClient } from "@tanstack/react-query";

export const LocationsOverview = () => {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage charging locations and assign charge points
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Location
        </Button>
      </div>

      <CreateLocationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["locations"] })
        }
      />

      <LocationsList />
    </div>
  );
};
