import React, { useEffect, useState } from "react";
import JobCard from "../Job/JobCard";
import { fetchStudentJobs } from "@/api/student";
import { toast } from "react-toastify";

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchStudentJobs();
        if (res?.success) {
          setJobs(res.data.jobs || []);
        } else {
          toast.error(res?.message || "Failed to load jobs");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Available Jobs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found</p>
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
  );
}
