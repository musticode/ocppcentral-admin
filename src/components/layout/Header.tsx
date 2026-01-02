import { ChevronUp, User, Bell } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserDetail } from "@/features/user/UserDetail";

export const Header = () => {
  const { user } = useAuthStore();
  const [companyName] = useState("Energy Management Company");
  const [unreadCount] = useState(3); // Dummy unread count

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{companyName}</span>
        <ChevronUp className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex items-center gap-4">
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
