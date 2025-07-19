import React, { useEffect, useState } from "react";
import ApplicationsBoard from "../applicationBoard/ApplicationsBoard_School";
import { Link, useParams } from "react-router";
import { jobDetailById } from "@/api/school";

const JobPostingDetails = () => {
  const [jobData, setJobData] = useState(null);
  const { jobId } = useParams();

  const getJobDetails = async () => {
    try {
      const response = await jobDetailById(jobId);
      if (response?.success) {
        setJobData(response.data.job);
      } else {
        console.error("API responded with error or false success");
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  useEffect(() => {
    getJobDetails();
  }, [jobId]);

  return (
    <>
      <div className="flex justify-between items-start gap-6 p-6 bg-white rounded-lg">
        <div className="flex gap-4 items-start">
          <img
            src="/src/assets/card-icon.png"
            alt="School Logo"
            className="w-[76px] h-[76px] rounded object-cover"
          />
          <div>
            <h2 className="text-lg font-bold nunito-text">{jobData?.title}</h2>
            <p className="text-sm text-gray-600">{jobData?.institution}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                {jobData?.location}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-base font-semibold nunito-text mb-1">
              Overview
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {jobData?.overview}
            </p>
          </div>
          <div className="mt-4 text-right">
            <Link
              to={`/school/job-description/${jobId}`}
              className="text-sm font-semibold text-green-400 border px-4 py-2 rounded"
            >
              View Job Description
            </Link>
          </div>
        </div>
      </div>
      <ApplicationsBoard />
    </>
  );
};

export default JobPostingDetails;
