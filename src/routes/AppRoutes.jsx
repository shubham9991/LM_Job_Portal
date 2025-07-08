import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Dashboard from "@/components/dashboard/Dashboard";
import SkillsSection from "@/components/skills/SkillsSection";
import MainLayout from "@/layouts/MainLayout";
import JobDetails from "@/components/JobDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/teacher/dashboard" element={<Dashboard />} />
        <Route path="/teacher/jobs" element={<JobDetails />} />
        <Route path="/teacher/skills" element={<SkillsSection />} />
        {/* more teacher routes... */}
      </Route>
    </Routes>
  );
}
