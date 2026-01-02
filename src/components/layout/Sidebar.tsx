import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Zap,
  Calendar,
  Users,
  UserCog,
  CreditCard,
  FileText,
  TrendingUp,
  Grid3x3,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/activity", label: "Activity", icon: Activity },
  { path: "/sessions", label: "Sessions", icon: Zap },
  { path: "/reservation", label: "Reservation", icon: Calendar },
  { path: "/chargers", label: "Chargers", icon: Zap },
  { path: "/users", label: "Users", icon: Users },
  { path: "/user-groups", label: "User Groups", icon: UserCog },
  { path: "/rfid-tags", label: "RFID Tags", icon: CreditCard },
  { path: "/tariff", label: "Tariff", icon: FileText },
  { path: "/reports", label: "Reports", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gray-100">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <Grid3x3 className="h-6 w-6 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">ChargeOPS</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-gray-600"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
