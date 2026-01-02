import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { LocationDetail } from "@/features/dashboard/components/LocationDetail";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { ChargePointsList } from "@/features/charge-points/components/ChargePointsList";
import { ChargePointDetail } from "@/features/charge-points/components/ChargePointDetail";
import { ProtectedRoute } from "./ProtectedRoute";
import { RFIDOverview } from "@/features/rfidtags/RFIDOverview";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardOverview />,
          },
          {
            path: "chargers",
            element: <ChargePointsList />,
          },
          {
            path: "chargers/:chargerId",
            element: <ChargePointDetail />,
          },
          {
            path: "locations/:locationId",
            element: <LocationDetail />,
          },
          {
            path: "activity",
            element: <div className="p-6">Activity</div>,
          },
          {
            path: "sessions",
            element: <div className="p-6">Sessions</div>,
          },
          {
            path: "reservation",
            element: <div className="p-6">Reservation</div>,
          },
          {
            path: "users",
            element: <div className="p-6">Users</div>,
          },
          {
            path: "user-groups",
            element: <div className="p-6">User Groups</div>,
          },
          {
            path: "rfid-tags",
            element: <RFIDOverview />,
          },
          {
            path: "tariff",
            element: <div className="p-6">Tariff</div>,
          },
          {
            path: "reports",
            element: <div className="p-6">Reports</div>,
          },
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
        ],
      },
    ],
  },
]);
