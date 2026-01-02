import { Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Authentication check can be added here when needed
  return <Outlet />;
};
