import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateRFIDTagModal } from "./CreateRFIDTagModal";
import { RFIDTagsList } from "./RFIDTagsList";
import { RFIDStatsCards } from "./components/RFIDStatsCards";

export const RFIDOverview = () => {
  const [createRFIDTagModalOpen, setCreateRFIDTagModalOpen] = useState(false);
  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">RFID Tags</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage RFID cards and review usage across charging sessions
          </p>
        </div>
        <Button onClick={() => setCreateRFIDTagModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add RFID Tag
        </Button>
      </div>

      <RFIDStatsCards />

      <div className="mt-6">
        <RFIDTagsList />
      </div>

      <CreateRFIDTagModal
        open={createRFIDTagModalOpen}
        onOpenChange={setCreateRFIDTagModalOpen}
        onSuccess={() => {
          setCreateRFIDTagModalOpen(false);
        }}
      />
    </div>
  );
};

export default RFIDOverview;
