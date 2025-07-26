import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import JobCard from "@/components/Job/JobCard";
import { getStudentJobs } from "@/api/student";

const StudentJobOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await getStudentJobs();
      console.log("✅ Raw API response:", res);

      const rawJobs = res?.availableJobs || [];
      console.log("✅ Raw jobs array:", rawJobs);

      if (!Array.isArray(rawJobs)) {
        toast.error("Job data is not in expected format.");
        return;
      }

      const formatted = rawJobs.map((job) => ({
        id: job.id,
        title: job.title,
        logo: job.school_logo,
        school: job.school_name,
        location: job.school_address,
        jobType: job.job_type,
        salary: job.salary_range,
        postedAgo: job.application_end_date,
        description: job.job_description,
        status: "Active",
        applied: job.applied, // ⬅️ ensure this is passed to JobCard
      }));

      console.log("✅ Formatted jobs:", formatted);
      setJobs(formatted);
    } catch (err) {
      console.error("❌ Job fetch error:", err);
      toast.error("Failed to load job opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Job Opportunities</h2>

      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">
            Total jobs fetched: {jobs.length}
          </p>

          {jobs.length === 0 ? (
            <p className="text-gray-600">
              No job opportunities available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentJobOpportunities;
