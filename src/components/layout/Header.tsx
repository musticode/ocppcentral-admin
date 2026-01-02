import { ChevronUp, User, Upload } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Company Name</span>
        <ChevronUp className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {user?.name || "Geraldine"}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};
