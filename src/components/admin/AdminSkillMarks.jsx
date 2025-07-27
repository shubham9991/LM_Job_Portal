import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

export default function AdminSkillMarks() {
  const [students, setStudents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedTab, setSelectedTab] = useState("individual");

  // Individual Upload State
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [subskillMarks, setSubskillMarks] = useState([]);

  // Bulk Upload State
  const [bulkSkillId, setBulkSkillId] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchSkills();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiClient(
        "/admin/users?role=student&limit=50&offset=0",
        {},
        true
      );
      setStudents(res?.data?.users || []);
    } catch {
      toast.error("Failed to load students");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await apiClient("/admin/skills", {}, true);
      setSkills(res?.data?.skills || []);
    } catch {
      toast.error("Failed to load skills");
    }
  };

  useEffect(() => {
    const selected = skills.find((skill) => skill.id === selectedSkillId);
    if (selected) {
      setSubskillMarks(
        selected.subskills.map((name) => ({ name, mark: 0 }))
      );
    }
  }, [selectedSkillId, skills]);

  const handleMarkChange = (index, value) => {
    const updated = [...subskillMarks];
    updated[index].mark = Number(value);
    setSubskillMarks(updated);
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedSkillId || subskillMarks.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        skill_id: selectedSkillId,
        subskills: subskillMarks,
      };

      await apiClient(
        `/admin/skills/${selectedStudent}/marks`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );

      toast.success("✅ Core skill marks uploaded successfully");

      // Reset
      setSelectedStudent("");
      setSelectedSkillId("");
      setSubskillMarks([]);
    } catch (err) {
      toast.error("Failed to upload marks: " + err.message);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!bulkSkillId || !bulkFile) {
      toast.error("Please select a core skill and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const res = await apiClient(
        `/admin/skills/${bulkSkillId}/bulk-marks-upload`,
        {
          method: "POST",
          body: formData,
          isFormData: true,
        },
        true
      );

      if (typeof res === "string") {
        toast.success("✅ Bulk upload successful");
        setUploadSummary(null);
      } else if (res?.success) {
        const updated = res?.data?.successful_updates || [];
        const failed = res?.data?.failed_details || [];

        toast.success(
          `✅ Uploaded: ${updated.length}, ❌ Failed: ${failed.length}`
        );

        setUploadSummary({
          success: updated,
          failed: failed,
        });
      } else {
        toast.warn("Upload completed but no details returned");
      }

      setBulkFile(null);
      setBulkSkillId("");
    } catch (err) {
      toast.error("Bulk upload error: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Upload Student Core Skill Marks</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "individual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("individual")}
        >
          Individual Upload
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("bulk")}
        >
          Bulk Upload
        </button>
      </div>

      {/* Individual Upload Form */}
      {selectedTab === "individual" && (
        <form onSubmit={handleIndividualSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Student:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Select Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Select Core Skill:</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Select Core Skill --</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subskill Inputs */}
          {subskillMarks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Enter Marks:</h3>
              {subskillMarks.map((sub, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center"
                >
                  <label className="w-1/2">{sub.name}</label>
                  <input
                    type="number"
                    value={sub.mark}
                    onChange={(e) =>
                      handleMarkChange(index, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-[80px]"
                    min={0}
                    max={25}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Upload Marks
          </button>
        </form>
      )}

      {/* Bulk Upload Form */}
      {selectedTab === "bulk" && (
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Select Core Skill:
            </label>
            <select
              value={bulkSkillId}
              onChange={(e) => setBulkSkillId(e.target.value)}
              className="border w-full px-3 py-2 rounded"
              required
            >
              <option value="">-- Select Core Skill --</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Excel (.xlsx)</label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setBulkFile(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload Bulk Marks
          </button>
        </form>
      )}

      {/* Upload Summary */}
      {uploadSummary && (
        <div className="bg-gray-100 p-4 mt-4 rounded space-y-2">
          <h4 className="font-semibold text-green-700">✅ Successful Uploads:</h4>
          <ul className="text-sm text-green-700 list-disc ml-5">
            {uploadSummary.success.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {uploadSummary.failed.length > 0 && (
            <>
              <h4 className="font-semibold text-red-700 mt-3">❌ Failed Uploads:</h4>
<ul className="text-sm text-red-700 list-disc ml-5">
  {uploadSummary.failed.map((s, i) => (
    <li key={i}>
      {s.email} - {s.reason}
    </li>
  ))}
</ul>

            </>
          )}
        </div>
      )}
    </div>
  );
}
