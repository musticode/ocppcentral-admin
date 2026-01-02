import { User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export const UserDetail = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">
        {user?.name || "Geraldine"}
      </span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
        <User className="h-4 w-4 text-gray-600" />
      </div>
    </div>
  );
};

export default UserDetail;
