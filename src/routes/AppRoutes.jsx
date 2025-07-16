// src/routes/AppRoutes.jsx
import { Route, Routes } from "react-router";
import Login from "@/components/auth/Login";
import MainLayout from "@/layouts/MainLayout";

import PublicRoute from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

import Dashboard from "@/components/dashboard/Dashboard";
import JobDetails from "@/components/JobDetails";
import SkillsSection from "@/components/skills/SkillsSection";
import JobTabs from "@/components/Job/JobTabs";
import MyFullCalendar from "@/components/calendar/MyCalendar";

import AdminPanel from "@/components/admin/AdminPanel";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* ---------- ADMIN ---------- */}
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route element={<MainLayout />}>
    <Route path="/admin/dashboard" element={<AdminPanel />} />
  </Route>
</Route>

      {/* ---------- SCHOOL ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["school"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/school/dashboard" element={<Dashboard />} />
          <Route path="/school/jobs" element={<JobDetails />} />
          <Route path="/school/skills" element={<SkillsSection />} />
          <Route path="/school/schedule" element={<MyFullCalendar />} />
          <Route path="/school/job-posting" element={<JobTabs />} />
          {/* 👆  portfolio route removed */}
        </Route>
      </Route>

      {/* ---------- STUDENT ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
