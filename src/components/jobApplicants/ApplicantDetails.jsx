import React, { useEffect, useState } from "react";
import { getStudentProfile } from "@/api/student";
import { fetchApplicant, shortListApplicant } from "@/api/school";
import { useParams, useLocation } from "react-router-dom";
import ScheduleModal from "../scheduleInterview/ScheduleModal";
import { toast } from "react-toastify";
import profileImg from "../../assets/image1.png";
import { Mail } from "lucide-react";

const normalizeApplicant = (app) => ({
  firstName: app.firstName ?? app.first_name ?? "",
  lastName: app.lastName ?? app.last_name ?? "",
  email: app.email ?? "",
  mobile: app.mobile ?? "",
  about: app.about ?? "",
  imageUrl: app.imageUrl ?? app.image_url ?? "",
  skills: app.skills || [],
  education: app.allEducations ?? app.education ?? [],
  certifications: app.certifications ?? [],
  coreSkills: app.coreSkills ?? app.core_skills ?? [],
});

const ApplicantDetails = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const { applicantId } = useParams();
  const location = useLocation();

  // Support both: state & query param
  const searchParams = new URLSearchParams(location.search);
  const applicationId =
    location.state?.applicationId || searchParams.get("applicationId");
  const initialStatus = location.state?.status;
  const [isShortlisted, setIsShortlisted] = useState(
    initialStatus && initialStatus !== "New Candidates"
  );

  const toggleSkill = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const fetchStudent = async () => {
    try {
      if (applicantId) {
        const res = await fetchApplicant(applicantId);
        if (res?.success) {
          setProfile(normalizeApplicant(res.data.applicant || {}));
        } else {
          setError(res?.message || "Failed to fetch applicant.");
        }
      } else {
        const res = await getStudentProfile();
        setProfile(normalizeApplicant(res || {}));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!applicationId) return toast.error("Application ID is missing!");
    try {
      const res = await shortListApplicant(applicationId, { status: "shortlisted" });
      if (res?.success) {
        toast.success("Applicant shortlisted");
        setIsShortlisted(true);
      } else {
        toast.error(res?.message || "Failed to shortlist");
      }
    } catch {
      toast.error("Failed to shortlist");
    }
  };

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!profile) return null;

  const {
    firstName,
    lastName,
    email,
    mobile,
    about,
    imageUrl,
    education = [],
    certifications = [],
    coreSkills = [],
    skills = [],
  } = profile;

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      {/* Header */}
      <div className="rounded-lg shadow border bg-white">
        <div className="bg-gradient-to-r from-[#000000] to-[#89ef89e2] px-32 py-3">
          <h1 className="text-white text-xl font-semibold">{firstName} {lastName}</h1>
        </div>

        {/* Profile Body */}
        <div className="px-6 pt-10 pb-2 relative">
          <div className="absolute top-0 left-6 transform -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
            <img
              src={imageUrl || profileImg}
              alt={firstName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="ml-24 -mt-8">
            <div className="flex flex-wrap gap-4 text-xs text-black">
              <div className="flex items-center gap-1">
                <Mail className="text-xs" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📞</span> <span>{mobile}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills?.map((tag, idx) => (
                <span
                  key={tag + idx}
                  className="bg-green-100 text-green-800 text-xs px-2 rounded-lg py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="px-6 pb-6">
          <h2 className="text-gray-800 text-base font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {about || "No bio provided."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Education */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Education</h2>
          {Array.isArray(education) && education.length > 0 ? (
            education.map((edu, idx) => (
              <div key={edu.id || idx} className="mb-4">
                <p className="text-sm font-medium">{edu.courseName ?? edu.course_name}</p>
                <p className="text-xs text-gray-500">
                  {edu.collegeName ?? edu.college_name}, {edu.universityName ?? edu.university_name}
                </p>
                <p className="text-sm mt-2 text-gray-700">
                  {edu.startYear ?? edu.start_year} - {edu.endYear ?? edu.end_year} • GPA: {edu.gpa}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No education listed</p>
          )}
        </div>

        {/* Certifications */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Certifications</h2>
          {Array.isArray(certifications) && certifications.length > 0 ? (
            certifications.map((c, idx) => (
              <div key={c.id || idx} className="mb-3">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {c.issuedBy ?? c.issued_by} • {c.dateReceived ?? c.date_received}
                </p>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                  {c.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No certifications listed</p>
          )}
        </div>

        {/* Core Skills */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-1 text-gray-800">
            <span className="text-green-500">🟢</span>Core Skills
          </h2>
          {coreSkills.map((skill, idx) => {
            const total = skill.score?.total || 0;
            const obtained = skill.score?.obtained || 0;
            return (
              <div
                key={skill.name}
                className="mb-3 border rounded-md cursor-pointer hover:shadow"
                onClick={() => toggleSkill(idx)}
              >
                <div className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium text-gray-800">{skill.name}</p>
                    <p className="text-sm text-yellow-600">
                      {openIndex === idx
                        ? "Hide Sub Skills"
                        : "View Sub Skills"}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {obtained}/{total}
                  </span>
                </div>
                {openIndex === idx && (
                  <div className="border-t p-4 space-y-3">
                    {skill.subSkills?.map((sub, i) => (
                      <div
                        key={sub.name + i}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>{sub.name}</span>
                        <span className="font-semibold">
                          {sub.score?.obtained}/{sub.score?.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {applicationId && (
        <div className="flex justify-end gap-2 mt-4">
          {!isShortlisted && (
            <button
              onClick={handleShortlist}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Shortlist Application
            </button>
          )}
          <button
            onClick={() => setShowSchedule(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Schedule Interview
          </button>
        </div>
      )}

      <ScheduleModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        applicantId={applicationId}
      />
    </div>
  );
};

export default ApplicantDetails;
