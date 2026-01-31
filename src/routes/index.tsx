import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { SignupPage } from "@/features/auth/components/SignupPage";
import { LocationDetail } from "@/features/locations/LocationDetail";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { ChargePointsList } from "@/features/charge-points/components/ChargePointsList";
import { ChargePointDetail } from "@/features/charge-points/components/ChargePointDetail";
import { ProtectedRoute } from "./ProtectedRoute";
import { RFIDOverview } from "@/features/rfidtags/RFIDOverview";
import { TariffOverview } from "@/features/tariff/TariffOverview";
import { SessionOverview } from "@/features/sessions/SessionOverview";
import { UserOverview } from "@/features/user/UserOverview";
import { NotificationsPage } from "@/features/notifications/NotificationsPage";
import { CompanySettingsPage } from "@/features/settings/CompanySettingsPage";
import { ReservationOverview } from "@/features/reservations/ReservationOverview";
import { ActivityOverview } from "@/features/activity/ActivityOverview";
import { ReportsOverview } from "@/features/reports/ReportsOverview";
import { LocationsOverview } from "@/features/locations/LocationsOverview";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
            path: "locations",
            element: <LocationsOverview />,
          },
          {
            path: "locations/:locationId",
            element: <LocationDetail />,
          },
          {
            path: "activity",
            element: <ActivityOverview />,
          },
          {
            path: "sessions",
            element: <SessionOverview />,
          },
          {
            path: "reservation",
            element: <ReservationOverview />,
          },
          {
            path: "users",
            element: <UserOverview />,
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
            element: <TariffOverview />,
          },
          {
            path: "reports",
            element: <ReportsOverview />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "settings",
            element: <CompanySettingsPage />,
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
