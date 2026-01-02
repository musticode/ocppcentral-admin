import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Copy,
  RefreshCw,
  Play,
  Square,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface Connector {
  id: number;
  connectorId: number;
  powerKw: number;
  status: string;
}

interface Charger {
  id: string;
  name: string;
  chargePointId: string;
  model: string;
  tariff: string;
  supportPhone: string;
  location: string;
  address: string;
  connectors: Connector[];
}

interface ChargerDetailsPanelProps {
  charger: Charger;
}

export const ChargerDetailsPanel = ({ charger }: ChargerDetailsPanelProps) => {
  const [selectedConnector, setSelectedConnector] = useState<number | null>(2);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/chargers"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Chargers
      </Link>

      {/* Charger Name Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Charger Name</h2>
          <h1 className="text-2xl font-bold text-gray-900">{charger.name}</h1>
        </div>
        <Button variant="outline" size="sm" className="text-primary">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Charger Details */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Charger ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">
                {charger.chargePointId}
              </span>
              <Copy className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Model Name:</span>
            <span className="text-sm font-medium">{charger.model}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tariff:</span>
            <span className="text-sm font-medium">{charger.tariff}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Support phone number:</span>
            <span className="text-sm font-medium">{charger.supportPhone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Location:</span>
            <span className="text-sm font-medium">{charger.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Address:</span>
            <span className="text-sm font-medium">{charger.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Reset Charger Button */}
      <Button variant="outline" className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset Charger
      </Button>

      {/* Connectors List */}
      <div className="space-y-3">
        {charger.connectors.map((connector) => (
          <Card
            key={connector.id}
            className={cn(
              "cursor-pointer transition-all",
              selectedConnector === connector.connectorId &&
                "ring-2 ring-primary shadow-lg"
            )}
            onClick={() => setSelectedConnector(connector.connectorId)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {connector.connectorId}
                    </span>
                    <span className="text-sm text-gray-600">
                      {connector.powerKw}kW
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Play className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Square className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
