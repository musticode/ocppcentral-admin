import { Bell, Menu, User } from "lucide-react";

import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState } from "react";
import { useCompanyStore } from "@/store/company.store";
import { useSidebarStore } from "@/store/sidebar.store";

export const Header = () => {
  useAuthStore();
  //useCompanyStore();
  //const [companyName] = useState("Energy Management Company");
  const company = useCompanyStore();
  const [unreadCount] = useState(3); // Dummy unread count
  const toggleSidebar = useSidebarStore((s) => s.toggle);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-3 shadow-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="truncate text-sm font-medium text-gray-700">{company.companyName ? company.companyName : "Energy Management Company"}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4 text-gray-600" />
          </Button>
        </Link>
      </div>
    </header>
  );
};
