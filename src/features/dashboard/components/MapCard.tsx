import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Zap } from "lucide-react";

export const MapCard = () => {
  // Dummy charger locations for the map
  const chargerLocations = [
    { id: 1, x: "15%", y: "25%" },
    { id: 2, x: "35%", y: "30%" },
    { id: 3, x: "55%", y: "20%" },
    { id: 4, x: "70%", y: "40%" },
    { id: 5, x: "25%", y: "60%" },
    { id: 6, x: "60%", y: "70%" },
    { id: 7, x: "80%", y: "75%" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Map</CardTitle>
          <Search className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Map background with street names */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200">
            {/* Street lines */}
            <div className="absolute left-0 top-1/4 h-0.5 w-full bg-gray-300 opacity-30" />
            <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-300 opacity-30" />
            <div className="absolute left-0 top-3/4 h-0.5 w-full bg-gray-300 opacity-30" />
            <div className="absolute left-1/4 top-0 h-full w-0.5 bg-gray-300 opacity-30" />
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 opacity-30" />
            <div className="absolute left-3/4 top-0 h-full w-0.5 bg-gray-300 opacity-30" />

            {/* Street name placeholder */}
            <div className="absolute left-4 top-1/4 text-xs text-gray-400">
              Marichemsvägen
            </div>
          </div>

          {/* Charger location markers */}
          {chargerLocations.map((location) => (
            <div
              key={location.id}
              className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-lg"
              style={{
                left: location.x,
                top: location.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Zap className="h-4 w-4 text-white" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
