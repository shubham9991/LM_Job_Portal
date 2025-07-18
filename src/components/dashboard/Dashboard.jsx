import CandidateProfilePanel from "../profileCard/CandidateProfilePanel";
import JobCard from "../Job/JobCard";
import SchoolDashboardStats from "../schoolDashboardStats/DashboardStatsUI";
import { useEffect, useState } from "react";
import { jobPostings } from "@/api/school";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobPostings();
        setJobs(res?.data?.jobs || []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || "guest");
  }, []);

  if (!role) return null; // prevent flickering before role loads

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {role === "student" && (
        <div className="w-full lg:w-1/4">
          <CandidateProfilePanel />
        </div>
      )}

      <div className="flex-1">
        {role === "school" && (
          <>
            <div className="mb-5">
              <SchoolDashboardStats />
            </div>
            <h3 className="text-lg font-semibold mb-2">Recent Job Postings </h3>
            <p className="text-gray-500 text-sm mb-4">
              Track and manage your active job listings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((item) => (
                <JobCard key={item?.id} job={item} />
              ))}
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
            <p className="text-gray-500">Manage users, jobs, analytics, etc.</p>
            {/* Add components relevant to admin here */}
          </>
        )}

        {role === "student" && (
          <>
            <h3 className="text-lg font-semibold mb-2">Your Opportunities</h3>
            <p className="text-gray-500 text-sm mb-4">
              Jobs you're shortlisted for and applications
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(3)].map((_, i) => (
                <JobCard key={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
