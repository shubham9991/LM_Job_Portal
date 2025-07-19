import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaUserCircle,
} from "react-icons/fa";
import cardicon from "../../assets/card-icon.png";
import { jobDetailById } from "@/api/school";
import { useParams } from "react-router-dom";

export default function JobDetails() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const user = localStorage.getItem("user");

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

  if (!jobData) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading job details...
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Job Descriptions</h2>
          {/* Header with Profile Picture */}
          <div className="flex items-start md:items-center justify-between mb-6 flex-col md:flex-row gap-4">
            <div className="items-center gap-4">
              <div className="flex">
                <img
                  src={cardicon}
                  alt="cardIcon"
                  className="w-[80px] h-[70px] rounded-sm"
                />

                <div className="gap-1 mx-2">
                  <h3 className="text-2xl font-bold text-black nunito-text ">
                    {jobData.title}
                  </h3>
                  <p className="text-gray-500">{jobData.institution}</p>
                </div>
              </div>

              <div className="mt-2 flex gap-2 text-sm text-green-600">
                <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <FaMapMarkerAlt /> {jobData.location}
                </span>
                <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <FaClock /> {jobData.type}
                </span>
              </div>
            </div>
          </div>
          {/* Overview */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Overview</h4>
            <p className="text-gray-700">{jobData.overview}</p>
          </div>
          {/* Key Responsibilities */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Key Responsibilities</h4>
            <div className="list-disc list-inside text-gray-700 space-y-1">
              {jobData.responsibilities.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>
          {/* Requirements Section */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Requirements</h4>
            <h5 className="font-medium text-md mt-2">Education</h5>
            <div className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              {jobData.education.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>

            <h5 className="font-medium text-md mt-2">Experience & Skills</h5>
            <div className="list-disc list-inside text-gray-700 space-y-1">
              {jobData.skills.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-4">Job Overview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className=" items-center gap-2 text-green-600">
                <FaCalendarAlt />
                <span className="text-gray-700">
                  <span className="font-medium">Job Post Date:</span>
                  <br />
                  {jobData.postedDate}
                </span>
              </div>
              <div className=" items-center gap-2 text-green-600">
                <FaCalendarAlt />
                <span className="text-gray-700">
                  <span className="font-medium">Application ends on:</span>
                  <br />
                  {jobData.endDate}
                </span>
              </div>
              <div className=" items-center gap-2 text-green-600">
                <FaClock />
                <span className="text-gray-700">
                  <span className="font-medium">Job Type:</span>
                  <br />
                  {jobData.jobLevel}
                </span>
              </div>
              <div className="items-center gap-2 text-green-600">
                <FaMoneyBillAlt />
                <span className="text-gray-700">
                  <span className="font-medium">CTC:</span>
                  <br />
                  {jobData.salary}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-4">About School</h4>
            <p className="text-sm text-gray-700 mb-2">{jobData.about}</p>
            <a
              href={jobData.aboutLink}
              className="text-blue-600 underline text-sm"
            >
              Know more about us
            </a>
          </div>
          {user?.role === "student" && (
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
