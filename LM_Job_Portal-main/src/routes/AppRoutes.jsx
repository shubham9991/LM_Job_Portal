import { Route, Routes } from "react-router";
import Login from "@/components/auth/Login";
import MainLayout from "@/layouts/MainLayout";
import PublicRoute from "@/routes/PublicRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Dashboard from "@/components/dashboard/Dashboard";
import StudentDashboard from "@/components/student/StudentDashboard";
import StudentJobs from "@/components/student/Jobs";
import StudentProfile from "@/components/student/StudentProfile";
import SkillsSection from "@/components/skills/SkillsSection";
import JobTabs from "@/components/Job/JobTabs";
import MyFullCalendar from "@/components/calendar/MyCalendar";
import AdminDashboard from "@/components/admin/Dashboard";
import AdminCategories from "@/components/admin/Categories";
import AdminSkills from "@/components/admin/Skills";
import AdminUsers from "@/components/admin/Users";
import AdminHelpTickets from "@/components/help/AdminHelpTickets";
import JobPostForm from "@/components/Job/JobPostForm";
import JobDetails from "@/components/Job/JobDetails";
import ApplicationsBoard from "@/components/applicationBoard/ApplicationsBoard_School";
import JobPostingDetails from "@/components/Job/JobPostingDetails";
import ApplicantDetails from "@/components/jobApplicants/ApplicantDetails";
import AdminSkillMarks from "@/components/admin/AdminSkillMarks";
import Onboarding from "@/components/onboarding/Onboarding";
import StudentOnboarding from "@/components/onboarding/StudentOnboarding";
import OnboardingRoute from "./OnboardingRoute";
import SchoolProfile from "@/schoolProfile/SchoolProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Protected */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/skill-marks" element={<AdminSkillMarks />} />
          <Route path="/admin/help-tickets" element={<AdminHelpTickets />} />
        </Route>
      </Route>

      {/* School Protected */}
      <Route element={<ProtectedRoute allowedRoles={["school"]} />}>
        <Route element={<OnboardingRoute />}>
          <Route path="/school/onboarding" element={<Onboarding />} />
          <Route element={<MainLayout />}>
            <Route path="/school/dashboard" element={<Dashboard />} />
            <Route path="/school/skills" element={<SkillsSection />} />
            <Route path="/school/schedule" element={<MyFullCalendar />} />
            <Route path="/school/job-posting" element={<JobTabs />} />
            <Route path="/school/create-job" element={<JobPostForm />} />
            <Route path="/school/profile" element={<SchoolProfile />} />

            <Route
              path="/school/job-description/:jobId"
              element={<JobDetails />}
            />
            <Route
              path="/school/applicantDetails/:applicantId"
              element={<ApplicantDetails />}
            />
            <Route
              path="/school/applications/:jobId"
              element={<ApplicationsBoard />}
            />
            <Route
              path="/school/job-applicants/:jobId"
              element={<JobPostingDetails />}
            />
          </Route>
        </Route>
      </Route>

      {/* Student Protected */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<OnboardingRoute />}>
          <Route path="/student/onboarding" element={<StudentOnboarding />} />
          <Route element={<MainLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/jobs" element={<StudentJobs />} />
            <Route path="/jobs/:jobId" element={<JobDetails />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
