import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getStudentJobs } from "@/api/student"; // ✅ You'll create this in your API layer
import { Link } from "react-router-dom";

const StudentJobOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await getStudentJobs();
      setJobs(res?.availableJobs || []);
    } catch (err) {
      toast.error("Failed to load job opportunities.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Job Opportunities</h2>

      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600">No job opportunities available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-indigo-700">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Type:</strong> {job.type?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Subjects:</strong> {job.subjects?.join(", ") || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Salary:</strong> ₹{job.salary_min}L - ₹{job.salary_max}L
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Last Date:</strong> {job.application_end_date}
              </p>

              <Link
                to={`/student/job/${job.id}`}
                className="inline-block mt-2 px-4 py-1 border border-indigo-600 text-indigo-600 text-sm rounded hover:bg-indigo-50 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentJobOpportunities;
