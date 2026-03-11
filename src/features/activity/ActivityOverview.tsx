import { ActivityList } from "./ActivityList";
import { ActivityStatsCards } from "./components/ActivityStatsCards";

export const ActivityOverview = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recent Activity</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review system events and operational activity across charge points
        </p>
      </div>

      <ActivityStatsCards />

      <div className="mt-6">
        <ActivityList />
      </div>
    </div>
  );
};

export default ActivityOverview;
