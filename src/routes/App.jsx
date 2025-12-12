import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../features/auth/pages/Login";
import SidebarLayout from "../components/SidebarLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Employees from "../features/employees/pages/Employees";
import Retirements from "../features/retirement/pages/Retirements";
import SchoolCalendar from "../features/school_calendar/pages/SchoolCalendar";
import EmployeeOverview from "@/features/employees/pages/EmployeeOverview";
import EmployeeEdit from "@/features/employees/pages/EmployeeEdit";
import PositionManagement from "../features/position/pages/PositionManagement";
import Position from "@/features/position/pages/Position";
import Items from "@/features/position/pages/Items";
import Salary from "@/features/position/pages/Salary";
import UserDashboard from "@/features/user/pages/UserDashboard";
import AppointmentDetails from "@/features/appointment/pages/AppointmentDetails";
import Contract from "@/features/employees/pages/service-record/Contract";
import EmpServiceRecord from "@/features/employees/pages/service-record/EmpServiceRecord";
import Contracts from "@/features/appointment/pages/Contracts";
import Appointments from "@/features/appointment/pages/Appoinments";
import LeaveCredits from "@/features/employees/pages/leave-credits/LeaveCredits";
import MainLayout from "@/features/user/components/MainLayout";
import Eligibility from "@/features/user/pages/Eligibility";
import Leave from "@/features/user/pages/Leave";
import Profile from "@/features/user/pages/Profile";
import RepubrishItems from "@/features/position/pages/repubrish_items";
import ServiceRecord from "@/features/service_records/pages/ServiceRecords";
import UserManagement from "@/features/admin/pages/UserManagement";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* PROTECTED (ADMIN SIDE) */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees">
            <Route index element={<Employees />} />
            <Route path=":employee_id" element={<EmployeeOverview />} />
            <Route path=":employee_id/edit" element={<EmployeeEdit />} />
            <Route path=":employee_id/contract" element={<Contract />} />
            <Route
              path=":employee_id/empservice_record"
              element={<EmpServiceRecord />}
            />
            <Route
              path=":employee_id/leave-credits"
              element={<LeaveCredits />}
            />
          </Route>

          <Route path="position-management">
            <Route index element={<PositionManagement />} />
            <Route path="position" element={<Position />} />
            <Route path="items/item1" element={<Items />} />
            <Route path="items/item2" element={<RepubrishItems />} />
            <Route path="salary" element={<Salary />} />
          </Route>

          <Route path="retirement" element={<Retirements />} />
           <Route path="user-management" element={<UserManagement />} />
          <Route path="school-calendar" element={<SchoolCalendar />} />
          <Route path="service-records" element={<ServiceRecord />} />

          <Route path="appointment-details">
            <Route index element={<AppointmentDetails />} />
            <Route path="appointment" element={<Appointments />} />
            <Route path="contract" element={<Contracts />} />
          </Route>
        </Route>

        {/* PROTECTED (USER SIDE) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/leave" element={<Leave />} />
          <Route path="/user/eligibility" element={<Eligibility />} />
          <Route path="/user/profile" element={<Profile />} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
