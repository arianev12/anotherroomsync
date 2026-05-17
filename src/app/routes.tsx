import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { StudentSignUp } from "./pages/StudentSignUp";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { ManageOwners } from "./pages/admin/ManageOwners";
import { DormitoryListings } from "./pages/admin/DormitoryListings";
import { AdminSettings } from "./pages/admin/Settings";
import { OwnerDashboard } from "./pages/owner/Dashboard";
import { MyDormitories } from "./pages/owner/MyDormitories";
import { AddDormitory } from "./pages/owner/AddDormitory";
import { TenantRequests } from "./pages/owner/TenantRequests";
import { OwnerMaintenanceRequests } from "./pages/owner/MaintenanceRequests";
import { OwnerPayments } from "./pages/owner/Payments";
import { OwnerProfile } from "./pages/owner/Profile";
import { OwnerSettings } from "./pages/owner/Settings";
import { StudentDashboard } from "./pages/student/Dashboard";
import { FindDormitory } from "./pages/student/FindDormitory";
import { StudentMaintenanceRequests } from "./pages/student/MaintenanceRequests";
import { StudentPayments } from "./pages/student/Payments";
import { StudentProfile } from "./pages/student/Profile";
import { StudentSettings } from "./pages/student/Settings";
import { DormitoryDetails } from "./pages/student/DormitoryDetails";
import { MyDorm } from "./pages/student/MyDorm";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { NotificationsPage } from "./pages/shared/NotificationsPage";
import { DatabaseTestPage } from "./pages/DatabaseTestPage";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a href="/roomsyncapp/" className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Landing,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/signup",
      Component: StudentSignUp,
    },
    {
      path: "/admin",
      Component: LayoutWrapper,
      children: [
        { index: true, Component: AdminDashboard },
        { path: "owners", Component: ManageOwners },
        { path: "dormitories", Component: DormitoryListings },
        { path: "settings", Component: AdminSettings },
        { path: "notifications", Component: NotificationsPage },
      ],
    },
    {
      path: "/owner",
      Component: LayoutWrapper,
      children: [
        { index: true, Component: OwnerDashboard },
        { path: "dormitories", Component: MyDormitories },
        { path: "dormitories/add", Component: AddDormitory },
        { path: "tenant-requests", Component: TenantRequests },
        { path: "maintenance", Component: OwnerMaintenanceRequests },
        { path: "payments", Component: OwnerPayments },
        { path: "profile", Component: OwnerProfile },
        { path: "settings", Component: OwnerSettings },
        { path: "notifications", Component: NotificationsPage },
      ],
    },
    {
      path: "/student",
      Component: LayoutWrapper,
      children: [
        { index: true, Component: StudentDashboard },
        { path: "find-dormitory", Component: FindDormitory },
        { path: "find", Component: FindDormitory },
        { path: "my-dorm", Component: MyDorm },
        { path: "maintenance", Component: StudentMaintenanceRequests },
        { path: "payments", Component: StudentPayments },
        { path: "profile", Component: StudentProfile },
        { path: "settings", Component: StudentSettings },
        { path: "dormitory/:id", Component: DormitoryDetails },
        { path: "notifications", Component: NotificationsPage },
      ],
    },
    {
      path: "/test-database",
      Component: DatabaseTestPage,
    },
    {
      path: "*",
      Component: NotFound,
    },
  ],
  { basename: "/roomsyncapp" }
);
