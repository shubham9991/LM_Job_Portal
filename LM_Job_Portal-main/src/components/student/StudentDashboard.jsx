import React, { useEffect, useState } from "react";
import CandidateProfilePanel from "../profileCard/CandidateProfilePanel";
import JobCard from "../Job/JobCard";
import { fetchStudentDashboard } from "@/api/student";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchStudentDashboard();
        if (res?.success) {
          setData(res.data);
        } else {
          toast.error(res?.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const jobs = data?.requests || data?.shortlistedJobs || [];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-1/4">
        <CandidateProfilePanel profile={data?.profile} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">Shortlisted Jobs</h3>
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <div className="space-y-2">
            <p>No shortlisted jobs. Apply to jobs to get shortlisted.</p>
            <Link to="/student/jobs" className="text-blue-600 underline">
              Apply for Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-2">
            {jobs.map((job) => (
              <div key={job.id} className="w-full md:w-1/3 px-2 mb-4">
                <JobCard job={job} link={`/jobs/${job.id}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
