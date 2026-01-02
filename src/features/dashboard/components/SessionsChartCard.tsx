import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionsChartCardProps {
  data: Array<{ time: string; activeSessions: number }>;
}

export const SessionsChartCard = ({ data }: SessionsChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="activeSessions" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
