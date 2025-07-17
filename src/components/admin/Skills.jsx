import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", subskills: "" });

  const fetchSkills = async () => {
    try {
      const res = await apiClient("/admin/skills", {}, true);
      setSkills(res?.data?.skills || []); // ✅ fix here
    } catch {
      toast.error("Error loading skills");
    }
  };

  const createSkill = async () => {
    const payload = {
      name: newSkill.name,
      subskills: newSkill.subskills.split(",").map((s) => s.trim()),
    };

    try {
      await apiClient(
        "/admin/skills",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );
      toast.success("Skill created!");
      setNewSkill({ name: "", subskills: "" });
      fetchSkills(); // refresh
    } catch {
      toast.error("Failed to create skill");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Core Skill Management</h1>

      {/* Create Skill */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Create Core Skill</h2>
        <input
          className="border w-full mb-2 px-2 py-1 rounded"
          placeholder="Skill Name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
        />
        <input
          className="border w-full mb-2 px-2 py-1 rounded"
          placeholder="Comma-separated subskills"
          value={newSkill.subskills}
          onChange={(e) =>
            setNewSkill({ ...newSkill, subskills: e.target.value })
          }
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={createSkill}
        >
          Create Skill
        </button>
      </div>

      {/* List Skills */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">All Core Skills</h2>
        <ul className="list-disc ml-6 space-y-1">
          {skills.length === 0 ? (
            <p className="text-sm text-gray-500">No skills found.</p>
          ) : (
            skills.map((skill, i) => (
              <li key={i}>
                <strong>{skill.name}</strong>:{" "}
                {skill.subskills?.join(", ") || "No subskills"}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
