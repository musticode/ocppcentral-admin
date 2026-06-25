import {
  Activity,
  Calendar,
  Car,
  CreditCard,
  FileText,
  LayoutDashboard,
  MapPin,
  Settings,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { cn } from "@/utils/cn";
import { useSidebarStore } from "@/store/sidebar.store";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/activity", label: "Activity", icon: Activity },
  { path: "/sessions", label: "Sessions", icon: Zap },
  { path: "/reservation", label: "Reservation", icon: Calendar },
  { path: "/chargers", label: "Chargers", icon: Zap },
  { path: "/vehicles", label: "Vehicles", icon: Car },
  { path: "/fleet", label: "Fleet Management", icon: Truck },
  { path: "/locations", label: "Locations", icon: MapPin },
  { path: "/users", label: "Users", icon: Users },
  //{ path: "/user-groups", label: "User Groups", icon: UserCog },
  { path: "/rfid-tags", label: "RFID Tags", icon: CreditCard },
  { path: "/tariff", label: "Tariff", icon: FileText },
  { path: "/reports", label: "Reports", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebarStore();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    close();
  }, [location.pathname, close]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-gray-100 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" className="h-6 w-6" alt="ChargeOPS" />
            <span className="text-sm font-medium text-gray-700">ChargeOPS</span>
          </div>
          <button
            onClick={close}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-200 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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
    </>
  );
};
