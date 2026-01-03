import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RFIDTagsList from "./RFIDTagsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateRFIDTagModal } from "./CreateRFIDTagModal";

export const RFIDOverview = () => {
  const [createRFIDTagModalOpen, setCreateRFIDTagModalOpen] = useState(false);
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>RFID Tags Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCreateRFIDTagModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add RFID Tag
          </Button>
        </CardContent>
        <CreateRFIDTagModal
          open={createRFIDTagModalOpen}
          onOpenChange={setCreateRFIDTagModalOpen}
          onSuccess={() => {
            // Refresh RFID tag list
            console.log("RFID Tag created!");
            setCreateRFIDTagModalOpen(false);
          }}
        />
        <CardContent>
          <RFIDTagsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default RFIDOverview;
