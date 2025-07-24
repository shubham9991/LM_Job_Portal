import JobCard from "../Job/JobCard";
import SchoolDashboardStats from "../schoolDashboardStats/DashboardStatsUI";
import { useEffect, useState } from "react";
import { jobPostings } from "@/api/school";

const Dashboard = () => {
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

  const [role, setRole] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || "guest");
  }, []);

  if (!role) return null; // prevent flickering before role loads

  return (
    <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex flex-wrap -mx-2">
              {jobs.map((job) => (
                <div key={job.id} className="w-full md:w-1/3 px-2 mb-4">
                  <JobCard job={job} />
                </div>
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

      </div>
    </div>
  );
};

export default Dashboard;
