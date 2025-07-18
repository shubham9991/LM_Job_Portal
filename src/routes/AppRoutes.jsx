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

import AdminDashboard from "@/components/admin/Dashboard";
import AdminCategories from "@/components/admin/Categories";
import AdminSkills from "@/components/admin/Skills";
import AdminUsers from "@/components/admin/Users";
import AdminSkillMarks from "@/components/admin/AdminSkillMarks";

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
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/skills" element={<AdminSkills />} />
    <Route path="/admin/categories" element={<AdminCategories />} />
    <Route path="/admin/skill-marks" element={<AdminSkillMarks />} />
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
