import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TariffList } from "./TariffList";

export const TariffOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tariff Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <TariffList />
        </CardContent>
      </Card>
    </div>
  );
};

export default TariffOverview;
