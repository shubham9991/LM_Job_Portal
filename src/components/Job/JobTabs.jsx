import { useState, useEffect } from "react";
import { Link } from "react-router";
import { schoolJobPostings } from "@/api/school";
import JobCard from "./JobCard";

const JobTabs = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await schoolJobPostings({
          status: activeTab.toLowerCase(),
          category,
          limit: 5,
          offset: 0,
          search: "",
        });

        if (res.success) {
          setJobs(res.data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeTab, category]);

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs and Create Job Button */}
      <div className="flex justify-between items-center border-b pb-2">
        <div className="flex space-x-6">
          {["Open", "Closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-400"
              } pb-1`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          to="/school/create-job"
          className="px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-md hover:bg-green-50"
        >
          Create Job Post
        </Link>
      </div>

      {/* Category Dropdown */}
      <div className="flex items-center space-x-4">
        <label className="font-semibold text-sm">Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm text-gray-600 w-60 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="tech">Technology</option>
          <option value="hr">Human Resources</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      {/* Job List */}
      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : jobs.length > 0 ? (
          <div className="flex flex-wrap -mx-2">
            {jobs.map((job) => (
              <div key={job.id} className="w-full md:w-1/3 px-2 mb-4">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default JobTabs;
