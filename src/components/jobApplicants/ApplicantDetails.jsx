import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchApplicant, shortListApplicant } from "@/api/school";
import { getStudentProfile } from "@/api/student";
import profileImg from "../../assets/image1.png";
import ScheduleModal from "../scheduleInterview/ScheduleModal";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";

const ApplicantDetails = () => {
  const { applicantId } = useParams();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isSchool = user?.role === "school";
  const isStudent = user?.role === "student";
  const { id } = location.state || {};

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSkill = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const getApplicantDetail = async () => {
    try {
      if (isSchool) {
        if (!applicantId) throw new Error("No applicant ID in URL");
        const res = await fetchApplicant(applicantId);
        if (res?.success) {
          setApplicant({
            ...res.data.applicant,
            education: res.data.applicant.allEducations || [],
            certifications: res.data.applicant.certifications || [],
            coreSkills: res.data.applicant.coreSkills || [],
          });
        } else {
          throw new Error(res?.message || "Failed to fetch applicant.");
        }
      } else if (isStudent) {
        const profile = await getStudentProfile();
        setApplicant({
          ...profile,
          education: profile?.education || [],
          certifications: profile?.certifications || [],
          coreSkills: profile?.core_skills || [],
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const shortList = async () => {
    if (!id) {
      toast.error("Missing applicant ID");
      return;
    }
    setLoading(true);
    try {
      const payload = { status: "shortlisted" };
      const res = await shortListApplicant(id, payload);
      res?.success
        ? toast.success("Applicant shortlisted successfully!")
        : toast.error(res?.message || "Shortlisting failed");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplicantDetail();
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
    tags = [],
    imageUrl,
    education = [],
    certifications = [],
    coreSkills = [],
    about,
  } = applicant;

  const displayName = name || `${firstName || ""} ${lastName || ""}`.trim();
  const displayPhone = phone || mobile;

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      <div className="rounded-lg shadow border bg-white">
        <div className="bg-gradient-to-r from-[#000000] to-[#89ef89e2] px-32 py-3">
          <h1 className="text-white text-xl font-semibold">
            {displayName || "Unnamed Applicant"}
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
                <Mail className="text-xs" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📞</span> <span>{displayPhone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-800 text-xs px-2 rounded-lg py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {isSchool && (
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-green-700 font-medium border border-green-700 px-4 py-1.5 rounded text-sm hover:bg-green-50"
                  >
                    Schedule Interview
                  </button>
                  <button
                    className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-900"
                    onClick={shortList}
                  >
                    Short List
                  </button>
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
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Education</h2>
          {education.length > 0 ? (
            education.map((edu, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm font-medium">
                  {edu.courseName || edu.degree}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.collegeName || edu.institution}, {edu.universityName || ""}
                </p>
                <p className="text-sm mt-1 text-gray-700">
                  {(edu.startYear && edu.endYear) ? `${edu.startYear} - ${edu.endYear}` :
                    edu.graduationYear || ""}
                  {edu.gpa ? ` \u2022 GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No education data</p>
          )}
        </div>

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Certifications</h2>
          {certifications.length > 0 ? (
            certifications.map((c, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm font-medium">{c.name || c.title}</p>
                <p className="text-xs text-gray-500">
                  {c.issuedBy || c.issuer} \u2022 {new Date(c.dateReceived || `${c.year || 0}-01-01`).getFullYear()}
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
            <span className="text-green-500">\uD83D\uDFE2</span>Core Skills
          </h2>
          {coreSkills.length > 0 ? (
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
        <ScheduleModal
          isOpen={isModalOpen}
          applicantId={id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ApplicantDetails;
