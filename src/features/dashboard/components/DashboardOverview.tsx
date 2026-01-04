import { useState } from "react";
import { ChargersSummaryCard } from "./ChargersSummaryCard";
import { MapCard } from "./MapCard";
import { LastEventsCard } from "./LastEventsCard";
import { SessionsChartCard } from "./SessionsChartCard";
import { ConnectorsStatusChartCard } from "./ConnectorsStatusChartCard";

export const DashboardOverview = () => {
  const [period, setPeriod] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("3M");

  // Dummy data matching the image
  const stats = {
    activeSessions: 4,
    totalSessions: 1051,
    totalKwh: 578,
    totalRevenue: 578,
  };

  const sessionsData = [
    { time: "7 am", activeSessions: 0 },
    { time: "8 am", activeSessions: 2 },
    { time: "9 am", activeSessions: 5 },
    { time: "10 am", activeSessions: 8 },
    { time: "11 am", activeSessions: 12 },
    { time: "12 pm", activeSessions: 15 },
    { time: "1 pm", activeSessions: 20 },
    { time: "2 pm", activeSessions: 18 },
    { time: "3 pm", activeSessions: 22 },
    { time: "4 pm", activeSessions: 19 },
    { time: "5 pm", activeSessions: 25 },
    { time: "6 pm", activeSessions: 15 },
  ];

  const connectorStatusData = {
    available: 2,
    charging: 1,
    finishing: 3,
  };

  const events = [
    {
      id: "1",
      chargePointId: "844832345689",
      connectorId: 2,
      message: "Charger ID 844832345689 connector 2 is offline",
      timestamp: "02/08/2021",
    },
    {
      id: "2",
      chargePointId: "844832345689",
      connectorId: 2,
      message: "Charger ID 844832345689 connector 2 error",
      timestamp: "02/08/2021",
    },
    {
      id: "3",
      chargePointId: "844832345689",
      connectorId: 2,
      message: "Charger ID 844832345689 connector 2 fault",
      timestamp: "02/05/2021",
    },
    {
      id: "4",
      chargePointId: "844832345689",
      connectorId: 2,
      message: "Charger ID 844832345689 connector 2 fault",
      timestamp: "02/08/2021",
    },
    {
      id: "5",
      chargePointId: "844832345689",
      connectorId: 2,
      message: "Charger ID 844832345689 connector 2 fault",
      timestamp: "02/08/2021",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Chargers Summary Card - Top */}
      <ChargersSummaryCard
        stats={stats}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Bottom Row - Sessions Chart and Connectors Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SessionsChartCard data={sessionsData} />
        <ConnectorsStatusChartCard data={connectorStatusData} />
      </div>

      {/* Middle Row - Map and Last Events */}
      <div className="col-span-full">
        {/* <MapCard /> */}
        <LastEventsCard events={events} />
      </div>
    </div>
  );
};
