import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TariffList } from "./components/TariffList";
import { CreateTariffModal } from "./CreateTariffModal";
import { TariffStatsCards } from "./components/TariffStatsCards";

export const TariffOverview = () => {
  const [createTariffModalOpen, setCreateTariffModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tariff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage pricing plans and tariffs for charging services
          </p>
        </div>
        <Button onClick={() => setCreateTariffModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tariff
        </Button>
      </div>

      <TariffStatsCards />

      <div className="mt-6">
        <TariffList />
      </div>

      <CreateTariffModal
        open={createTariffModalOpen}
        onOpenChange={setCreateTariffModalOpen}
        onSuccess={() => {
          setCreateTariffModalOpen(false);
        }}
      />
    </div>
  );
};

export default TariffOverview;
