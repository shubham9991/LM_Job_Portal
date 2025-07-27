import React, { useEffect, useState } from "react";
import CandidateProfilePanel from "@/components/profileCard/CandidateProfilePanel";
import JobCard from "../Job/JobCard";
import { toast } from "react-toastify";
import { getStudentDashboard } from "@/api/student";

const StudentDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getStudentDashboard();
        setProfileData(res);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!profileData) return <div className="text-center mt-10 text-red-500">No data found</div>;

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6">
      {/* Left Side: Candidate Panel */}
      <CandidateProfilePanel profile={profileData.profile} />

      {/* Right Side: Shortlisted Jobs */}
      <div className="flex-1">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Shortlisted Job Opportunities</h2>
          <p className="text-sm text-gray-600">🎉 Browse through the positions for which you’ve been shortlisted</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.shortlistedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
