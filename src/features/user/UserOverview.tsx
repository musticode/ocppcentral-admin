import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "./UserList";

export const UserOverview = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
};
