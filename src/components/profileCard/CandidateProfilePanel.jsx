import React from "react";
import { FaLightbulb, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CandidateProfilePanel = ({ profile }) => {
  const {
    name,
    email,
    photo,
    recentActivities,
    coreSkillsSummary = [],
    topSkills = [],
  } = profile;

  // Determine top skills from core skill assessments if available
  const computedSkills = Array.isArray(coreSkillsSummary)
    ? [...coreSkillsSummary]
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3)
        .map((s) => s.name)
    : topSkills;
  const skillsToShow = computedSkills.length ? computedSkills : topSkills;

  return (
    <div className="bg-white rounded-xl shadow p-5 w-80">
      {/* Profile Info */}
      <div className="flex flex-col items-center">
        <div className="w-44 h-44 rounded-full border-4 border-green-400 overflow-hidden mb-3">
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      {/* Top Skills */}
      {skillsToShow.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Top Skills</h3>
          <div className="space-y-2">
            {skillsToShow.map((skill, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border"
              >
                <FaLightbulb className="text-yellow-500" />
                <span className="text-sm text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Activities</h3>
        <div className="space-y-2">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded border">
              {activity.type === "success" ? (
                <FaCheckCircle className="text-green-500 mt-0.5" />
              ) : (
                <FaTimesCircle className="text-red-500 mt-0.5" />
              )}
              <p className="text-sm text-gray-800 leading-snug">{activity.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default CandidateProfilePanel;
