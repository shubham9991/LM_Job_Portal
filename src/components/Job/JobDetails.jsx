import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaMoneyBillAlt,
} from "react-icons/fa";
import cardicon from "../../assets/card-icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  jobDetailById as jobDetailStudent,
  applyToJob,
  checkApplicationStatus,
  getStudentDashboard,
} from "@/api/student";
import { jobDetailById as jobDetailSchool } from "@/api/school";
import { toast } from "react-toastify";

export default function JobDetails() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [appStatus, setAppStatus] = useState("none");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const getJobDetails = async () => {
    try {
      const response =
        role === "student"
          ? await jobDetailStudent(jobId)
          : await jobDetailSchool(jobId);

      if (response?.success) {
        setJobData(response.data.job);
      } else {
        console.error("API responded with error or false success");
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  const fetchStatus = async () => {
    if (role !== "student") return;
    try {
      const res = await checkApplicationStatus(jobId);
      let status = res?.data?.applied ? "applied" : "none";
      if (res?.data?.applied) {
        const dash = await getStudentDashboard();
        const match = dash?.shortlistedJobs?.find(
          (j) => j.id === Number(jobId)
        );
        if (match) {
          status =
            match.status === "Interview Scheduled"
              ? "interview_scheduled"
              : "shortlisted";
        }
      }
      setAppStatus(status);
    } catch (err) {
      console.error("Status fetch failed", err);
    }
  };

const handleApply = async () => {
  if (jobData?.applied) {
    toast.info("You have already applied for this job.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();
  formData.append("firstName", user?.firstName || "Student");
  formData.append("lastName", user?.lastName || "Applicant");
  formData.append("email", user?.email || "student@example.com");
  formData.append("phone", user?.phone || "9988776655");
  formData.append("coverLetter", "I am eager to apply for this position...");
  formData.append("experience", "3 years");
  formData.append("availability", "Immediately");

  try {
    const res = await applyToJob(jobId, formData);
    if (res.success) {
      toast.success("Applied successfully!");
      setJobData({ ...jobData, applied: true });
      setAppStatus("applied");
    } else {
      toast.error(res.message || "Failed to apply.");
    }
  } catch (err) {
    toast.error(err.message || "Something went wrong.");
  }
};



  useEffect(() => {
    getJobDetails();
    fetchStatus();
  }, [jobId]);

  if (!jobData) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading job details...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold ml-2">Job Description</h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex gap-4">
              <img
                src={jobData?.logo || cardicon}
                alt="cardIcon"
                className="w-[80px] h-[70px] rounded-sm"
              />
              <div>
                <h3 className="text-2xl font-bold text-black">
                  {jobData.title}
                </h3>
                <p className="text-gray-500">{jobData.institution}</p>
                <div className="mt-2 flex gap-2 text-sm text-green-600 flex-wrap">
                  <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaMapMarkerAlt /> {jobData.location}
                  </span>
                  <span className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaClock /> {jobData.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Overview</h4>
            <p className="text-gray-700 whitespace-pre-line">
              {jobData.overview}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Key Responsibilities</h4>
            <div className="space-y-1 text-gray-700">
              {jobData.responsibilities.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Requirements</h4>
            <h5 className="font-medium text-md mt-2">Education</h5>
            <div className="space-y-1 text-gray-700 mb-4">
              {jobData.education.map((item, idx) => (
                <p key={idx}>{item}</p>
              ))}
            </div>

            <h5 className="font-medium text-md mt-2">Experience & Skills</h5>
            <div className="space-y-1 text-gray-700">
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
              <div>
                <FaCalendarAlt className="inline mr-1 text-green-600" />
                <span className="font-medium">Job Post Date:</span>
                <br />
                {jobData.postedDate}
              </div>
              <div>
                <FaCalendarAlt className="inline mr-1 text-green-600" />
                <span className="font-medium">Application ends on:</span>
                <br />
                {jobData.endDate}
              </div>
              <div>
                <FaClock className="inline mr-1 text-green-600" />
                <span className="font-medium">Job Type:</span>
                <br />
                {jobData.type}
              </div>
              <div>
                <FaMoneyBillAlt className="inline mr-1 text-green-600" />
                <span className="font-medium">CTC:</span>
                <br />
                {jobData.salary}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold mb-4">About School</h4>
            <p className="text-sm text-gray-700 mb-2">{jobData.about}</p>
            <a
              href={jobData.aboutLink}
              className="text-blue-600 underline text-sm"
              target="_blank"
              rel="noreferrer"
            >
              Know more about us
            </a>
          </div>

          {/* Apply Now Button for Students */}
{role === "student" && (
  (() => {
    let label = "Apply Now";
    let disabled = false;
    let onClick = handleApply;

    if (appStatus === "applied") {
      label = "Applied";
      disabled = true;
    } else if (appStatus === "shortlisted") {
      label = "Shortlisted";
      disabled = true;
    } else if (appStatus === "interview_scheduled") {
      label = "View Interview Schedule";
      onClick = () => navigate("/student/calendar");
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-2 px-4 rounded-xl text-lg font-semibold transition ${
          disabled
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {label}
      </button>
    );
  })()
)}


        </div>
      </div>
    </>
  );
}
