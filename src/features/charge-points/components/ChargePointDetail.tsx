import { useParams } from "react-router-dom";
import { ChargerDetailsPanel } from "./ChargerDetailsPanel";
import { SessionsPanel } from "./SessionsPanel";

export const ChargePointDetail = () => {
  const { chargerId } = useParams<{ chargerId: string }>();

  // Dummy data matching the image
  const chargerData = {
    id: chargerId || "1",
    name: "Charger Name",
    chargePointId: "23442",
    model: "Easee Home 22kW med kabel",
    tariff: "Tariff name",
    supportPhone: "+123 456 78 90",
    location: "Location Name",
    address: "Country, City name, ZIP, Mainstreet 123 goes here",
    connectors: [
      { id: 1, connectorId: 1, powerKw: 50, status: "Available" },
      { id: 2, connectorId: 2, powerKw: 50, status: "Available" },
      { id: 3, connectorId: 2, powerKw: 50, status: "Available" },
    ],
  };

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Left Panel - Charger Details */}
      <div className="w-1/2 space-y-6">
        <ChargerDetailsPanel charger={chargerData} />
      </div>

      {/* Right Panel - Sessions */}
      <div className="w-1/2">
        <SessionsPanel chargerId={chargerId || ""} />
      </div>
    </div>
  );
};

