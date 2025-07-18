import { fetchApplicant } from "@/api/school";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profileImg from "../../assets/image1.png";

const ApplicantDetails = () => {
  const { applicantId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);


  const toggleSkill = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const getApplicantDetailByID = async () => {
    try {
      const res = await fetchApplicant(applicantId);
      if (res?.success) {
        console.log(res, "resres");
        setApplicant(res?.data?.applicant);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApplicantDetailByID();
  }, [applicantId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!applicant) return null;

  const {
    name,
    email,
    phone,
    location,
    position,
    tags = [],
    education,
    certifications = [],
    coreSkills = [],
    academicSkills = [],
    experience = [],
    imageUrl,
    about,
  } = applicant;

  return (
    <div className="max-w-6xl w-full mx-auto p-6">
      {/* Header */}
      <div className="rounded-lg overflow-hidden shadow border bg-white">
        <div className="bg-gradient-to-r from-green-700 to-green-400 px-32 py-3">
          <h1 className="text-white text-xl font-semibold">{name}</h1>
          <p className="text-white text-sm">{position || "Not specified"}</p>
        </div>

        {/* Profile Body */}
        <div className="px-6 pt-10 pb-6 relative">
          {/* Profile Picture */}
          <div className="absolute top-0 left-6 transform -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
            <img
            //   src={imageUrl || profileImg}
              src={profileImg}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contact Info */}
          <div className="ml-28">
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <span>📧</span> <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📞</span> <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📍</span> <span>{location}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-100 text-green-800 text-xs px-2 rounded-lg py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button className="text-green-700 font-medium border border-green-700 px-4 py-1.5 rounded text-sm hover:bg-green-50">
                  Schedule Interview
                </button>
                <button className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-900">
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="px-6 pb-6">
          <h2 className="text-gray-800 text-base font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {about ||
              "No bio provided. Please add an About section to your profile."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-2">
        {/* Teaching Experience */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Teaching Experience</h2>
          {experience.length > 0 ? (
            experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <p className="text-sm font-medium">{exp.title}</p>
                <p className="text-xs text-gray-500">{exp.organization}</p>
                <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No experience listed</p>
          )}
        </div>

        {/* Education */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Education</h2>
          <p className="text-sm font-medium">{education.degree}</p>
          <p className="text-xs text-gray-500">{education.institution}</p>
          <p className="text-sm mt-2 text-gray-700">
            Graduated {education.graduationYear} • GPA: {education.gpa}
          </p>
        </div>

        {/* Certifications */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Certifications & Training</h2>
          {certifications.length > 0 ? (
            certifications.map((c, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-gray-500">
                  {c.issuer} • {c.year}
                </p>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                  {c.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No certifications</p>
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
                    {skill.subSkills.map((sub, i) => (
                      <div
                        key={sub.name + i}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>{sub.name}</span>
                        <span className="font-semibold">
                          {sub.score.obtained}/{sub.score.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Academic Skills */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Academic Skills</h2>
          <div className="flex flex-wrap gap-2">
            {academicSkills.map((tag, i) => (
              <span
                key={tag + i}
                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
