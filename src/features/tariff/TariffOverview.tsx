import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TariffList } from "./TariffList";
import { Button } from "@/components/ui/button";
import { CreateTariffModal } from "./CreateTariffModal";
import { useState } from "react";

export const TariffOverview = () => {
  const [createTariffModalOpen, setCreateTariffModalOpen] = useState(false);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tariff Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setCreateTariffModalOpen(true)}>
            Create Tariff
          </Button>
        </CardContent>
        <CreateTariffModal
          open={createTariffModalOpen}
          onOpenChange={() => {}}
          onSuccess={() => {
            // Refresh tariff list
            console.log("Tariff created!");
            setCreateTariffModalOpen(false);
          }}
        />
        <CardContent>
          <TariffList />
        </CardContent>
      </Card>
    </div>
  );
};

export default TariffOverview;
