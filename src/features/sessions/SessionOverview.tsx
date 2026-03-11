import { SessionList } from "./components/SessionList";
import { SessionStatsCards } from "./components/SessionStatsCards";
import { SessionAnalytics } from "./components/SessionAnalytics";

export const SessionOverview = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Charging Sessions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and analyze all charging sessions across your network
        </p>
      </div>

      <SessionStatsCards />

      <div className="mt-6">
        <SessionAnalytics />
      </div>

      <div className="mt-6">
        <SessionList />
      </div>
    </div>
  );
};

export default SessionOverview;
