import Login from "@/components/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import PublicRoute from "@/routes/PublicRoute"; // import your new wrapper
import { Route, Routes } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "@/components/dashboard/Dashboard";
import JobDetails from "@/components/JobDetails";
import SkillsSection from "@/components/skills/SkillsSection";
import AcademicPortfolioPage from "@/components/myPortfolio/AcademicPortfolioPage";
import JobTabs from "@/components/Job/JobTabs";
import MyFullCalendar from "@/components/calendar/MyCalendar";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public (Login) Route - only accessible if not logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Protected Routes - same as before */}
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>{/* Admin routes here */}</Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={["school"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/school/dashboard" element={<Dashboard />} />
          <Route path="/school/jobs" element={<JobDetails />} />
          <Route path="/school/skills" element={<SkillsSection />} />
          <Route path="/school/schedule" element={<MyFullCalendar />} />
          <Route
            path="/school/portfolio"
            element={<AcademicPortfolioPage />}
          />
          <Route path="/school/job-posting" element={<JobTabs />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
