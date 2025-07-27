import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchApplicant, shortListApplicant, getInterviewDetails } from "@/api/school";
import { getStudentProfile } from "@/api/student";
import profileImg from "../../assets/image1.png";
import ScheduleModal from "../scheduleInterview/ScheduleModal";
import InterviewDetailsModal from "../interview/InterviewDetailsModal";
import { Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";

const normalizeApplicant = (app) => ({
  firstName: app.firstName ?? app.first_name ?? "",
  lastName: app.lastName ?? app.last_name ?? "",
  name: app.name ?? "",
  email: app.email ?? "",
  phone: app.phone ?? "",
  mobile: app.mobile ?? "",
  about: app.about ?? "",
  imageUrl: app.imageUrl ?? app.image_url ?? "",
  skills: app.skills ?? app.tags ?? [],
  education: app.allEducations ?? app.education ?? [],
  certifications: app.certifications ?? [],
  coreSkills: app.coreSkills ?? app.core_skills ?? [],
});

const ApplicantDetails = () => {
  const { applicantId } = useParams();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isSchool = user?.role === "school";
  const isStudent = user?.role === "student";
  const searchParams = new URLSearchParams(location.search);
  const applicationId =
    location.state?.applicationId || searchParams.get("applicationId");
  const initialStatus = location.state?.status;
  const initialInterview = location.state?.interview;

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [isShortlisted, setIsShortlisted] = useState(
    initialStatus && initialStatus !== "New Candidates"
  );
  const [hasInterview, setHasInterview] = useState(!!initialInterview);

  const toggleSkill = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const getApplicantDetail = async () => {
    try {
      if (isSchool) {
        if (!applicantId) throw new Error("No applicant ID in URL");
        const res = await fetchApplicant(applicantId);
        if (res?.success) {
          setApplicant(normalizeApplicant(res.data.applicant || {}));
        } else {
          throw new Error(res?.message || "Failed to fetch applicant.");
        }
      } else if (isStudent) {
        const profile = await getStudentProfile();
        setApplicant(normalizeApplicant(profile || {}));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const shortList = async () => {
    if (!applicationId) {
      toast.error("Missing application ID");
      return;
    }
    setLoading(true);
    try {
      const payload = { status: "shortlisted" };
      const res = await shortListApplicant(applicationId, payload);
      if (res?.success) {
        toast.success("Applicant shortlisted successfully!");
        setIsShortlisted(true);
      } else {
        toast.error(res?.message || "Shortlisting failed");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const viewInterview = async () => {
    if (!applicationId) {
      toast.error("Missing application ID");
      return;
    }
    try {
      const res = await getInterviewDetails(applicationId);
      if (res?.success) {
        setInterviewDetails(res.data.interview);
        setInterviewModalOpen(true);
      } else {
        toast.error(res?.message || "Failed to fetch interview details");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };


  useEffect(() => {
    getApplicantDetail();
    // eslint-disable-next-line
  }, [applicantId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!applicant) return null;

  const {
    name,
    firstName,
    lastName,
    email,
    phone,
    mobile,
    about,
    imageUrl,
    education = [],
    certifications = [],
    coreSkills = [],
    skills = [],
  } = applicant;

  const displayName =
    name || `${firstName || ""} ${lastName || ""}`.trim() || "Unnamed Applicant";
  const displayPhone = phone || mobile || "";

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      <div className="rounded-lg shadow border bg-white">
        <div className="bg-gradient-to-r from-[#000000] to-[#89ef89e2] px-32 py-3 rounded-t-lg">
          <h1 className="text-white text-xl font-semibold">
            {displayName}
          </h1>
        </div>

        <div className="px-6 pt-10 pb-2 relative">
          <div className="absolute top-0 left-6 transform -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
            <img
              src={imageUrl || profileImg}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-24 -mt-8">
            <div className="flex flex-wrap gap-4 text-xs text-black">
              <div className="flex items-center gap-1">
                <Mail size={14} />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={14} /> <span>{displayPhone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isSchool && (
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => {
                      if (hasInterview) {
                        viewInterview();
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                    className="text-green-700 font-medium border border-green-700 px-4 py-1.5 rounded text-sm hover:bg-green-50"
                  >
                    {hasInterview ? "View Schedule" : "Schedule Interview"}
                  </button>
                  {!isShortlisted && (
                    <button
                      className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-900"
                      onClick={shortList}
                    >
                      Shortlist
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-gray-800 text-base font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {about || "No bio provided."}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-md p-4 md:col-span-2">
          <h2 className="font-semibold mb-2">Skills</h2>
          {Array.isArray(skills) && skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((tag, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-800 text-xs px-2 rounded-lg py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No skills</p>
          )}
        </div>
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Education</h2>
          {Array.isArray(education) && education.length > 0 ? (
            education.map((edu, idx) => (
              <div key={edu.id || idx} className="mb-4">
                <p className="text-sm font-medium">
                  {edu.courseName ?? edu.course_name ?? edu.degree}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.collegeName ?? edu.college_name ?? edu.institution},{" "}
                  {edu.universityName ?? edu.university_name ?? ""}
                </p>
                <p className="text-sm mt-2 text-gray-700">
                  {(edu.startYear ?? edu.start_year ?? "")} - {(edu.endYear ?? edu.end_year ?? edu.graduationYear ?? "")}
                  {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No education data</p>
          )}
        </div>

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Certifications</h2>
          {Array.isArray(certifications) && certifications.length > 0 ? (
            certifications.map((c, i) => (
              <div key={c.id || i} className="mb-2">
                <p className="text-sm font-medium">{c.name || c.title}</p>
                <p className="text-xs text-gray-500">
                  {c.issuedBy ?? c.issuer ?? c.issued_by}{" "}
                  {c.dateReceived || c.date_received
                    ? `• ${c.dateReceived || c.date_received}`
                    : ""}
                </p>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                  {c.status || "Active"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No certifications</p>
          )}
        </div>

        <div className="border rounded-md p-4 md:col-span-2">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-1 text-gray-800">
            <span className="text-green-500">🟢</span>Core Skills
          </h2>
          {Array.isArray(coreSkills) && coreSkills.length > 0 ? (
            coreSkills.map((skill, idx) => {
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
                        {openIndex === idx ? "Hide Sub Skills" : "View Sub Skills"}
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
            })
          ) : (
            <p className="text-sm text-gray-500 italic">No core skills</p>
          )}
        </div>
      </div>

      {isSchool && (
        <>
          <ScheduleModal
            isOpen={isModalOpen}
            applicationId={applicationId}
            shortlisted={isShortlisted}
            onClose={() => setIsModalOpen(false)}
            onScheduled={() => {
              setHasInterview(true);
              setIsShortlisted(true);
            }}
          />
          <InterviewDetailsModal
            open={interviewModalOpen}
            onClose={() => setInterviewModalOpen(false)}
            interview={interviewDetails}
          />
        </>
      )}
    </div>
  );
};

export default ApplicantDetails;
