import React, { useState } from "react";
import { updateStudentProfile } from "@/api/student";
import { toast } from "react-toastify";

const StudentProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    about: "",
    skills: [""],
    education: [
      {
        collegeName: "",
        universityName: "",
        courseName: "",
        startYear: "",
        endYear: "",
        gpa: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuedBy: "",
        description: "",
        dateReceived: "",
        hasExpiry: false,
        expiryDate: "",
        certificateLink: "",
      },
    ],
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () =>
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, education: updated }));
  };

  const addEducation = () =>
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          collegeName: "",
          universityName: "",
          courseName: "",
          startYear: "",
          endYear: "",
          gpa: "",
        },
      ],
    }));

  const handleCertificationChange = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, certifications: updated }));
  };

  const addCertification = () =>
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          issuedBy: "",
          description: "",
          dateReceived: "",
          hasExpiry: false,
          expiryDate: "",
          certificateLink: "",
        },
      ],
    }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB.");
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName.trim());
      payload.append("lastName", formData.lastName.trim());
      payload.append("mobile", formData.mobile.trim());
      payload.append("about", formData.about.trim());

      // Validate and sanitize skills
      const cleanSkills = formData.skills.filter((s) => s.trim());
      if (!cleanSkills.length) throw new Error("At least one skill is required.");
      payload.append("skills", JSON.stringify(cleanSkills));

      // Validate and sanitize education
      const cleanEducation = formData.education.map((edu, i) => {
        if (!edu.collegeName || !edu.universityName || !edu.courseName) {
          throw new Error(`Education #${i + 1} is incomplete.`);
        }
        return {
          collegeName: edu.collegeName.trim(),
          universityName: edu.universityName.trim(),
          courseName: edu.courseName.trim(),
          startYear: Number(edu.startYear),
          endYear: Number(edu.endYear),
          gpa: edu.gpa || "",
        };
      });
      payload.append("education", JSON.stringify(cleanEducation));

      // Validate and sanitize certifications
      const cleanCerts = formData.certifications.map((cert, i) => {
        if (!cert.name || !cert.issuedBy || !cert.dateReceived) {
          throw new Error(`Certification #${i + 1} is incomplete.`);
        }
        return {
          name: cert.name.trim(),
          issuedBy: cert.issuedBy.trim(),
          description: cert.description?.trim() || "",
          dateReceived: cert.dateReceived,
          hasExpiry: cert.hasExpiry,
          expiryDate: cert.hasExpiry ? cert.expiryDate : null,
          certificateLink: cert.certificateLink?.trim() || "",
        };
      });
      payload.append("certifications", JSON.stringify(cleanCerts));

      if (formData.image) payload.append("image", formData.image);

      const res = await updateStudentProfile(payload);
      if (res?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res?.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.message || "Validation failed. Please check your input.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full border p-2" required />
      <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full border p-2" required />
      <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" className="w-full border p-2" required />
      <textarea name="about" value={formData.about} onChange={handleInputChange} placeholder="About You" className="w-full border p-2" rows={3} required />

      {/* Skills */}
      <div>
        <label className="block font-semibold mb-1">Skills</label>
        {formData.skills.map((skill, idx) => (
          <input
            key={idx}
            value={skill}
            onChange={(e) => handleSkillChange(idx, e.target.value)}
            placeholder={`Skill #${idx + 1}`}
            className="w-full border p-2 mb-2"
          />
        ))}
        <button type="button" onClick={addSkill} className="text-blue-600 text-sm">
          + Add Skill
        </button>
      </div>

      {/* Education */}
      <div>
        <label className="block font-semibold mb-1">Education</label>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="border p-2 mb-3 space-y-1">
            <input value={edu.collegeName} onChange={(e) => handleEducationChange(idx, "collegeName", e.target.value)} placeholder="College Name" className="w-full border p-2" required />
            <input value={edu.universityName} onChange={(e) => handleEducationChange(idx, "universityName", e.target.value)} placeholder="University Name" className="w-full border p-2" required />
            <input value={edu.courseName} onChange={(e) => handleEducationChange(idx, "courseName", e.target.value)} placeholder="Course Name" className="w-full border p-2" required />
            <input value={edu.startYear} onChange={(e) => handleEducationChange(idx, "startYear", e.target.value)} placeholder="Start Year" type="number" className="w-full border p-2" />
            <input value={edu.endYear} onChange={(e) => handleEducationChange(idx, "endYear", e.target.value)} placeholder="End Year" type="number" className="w-full border p-2" />
            <input value={edu.gpa} onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)} placeholder="GPA" className="w-full border p-2" />
          </div>
        ))}
        <button type="button" onClick={addEducation} className="text-blue-600 text-sm">+ Add Education</button>
      </div>

      {/* Certifications */}
      <div>
        <label className="block font-semibold mb-1">Certifications</label>
        {formData.certifications.map((cert, idx) => (
          <div key={idx} className="border p-2 mb-3 space-y-1">
            <input value={cert.name} onChange={(e) => handleCertificationChange(idx, "name", e.target.value)} placeholder="Name" className="w-full border p-2" required />
            <input value={cert.issuedBy} onChange={(e) => handleCertificationChange(idx, "issuedBy", e.target.value)} placeholder="Issued By" className="w-full border p-2" required />
            <input value={cert.description} onChange={(e) => handleCertificationChange(idx, "description", e.target.value)} placeholder="Description" className="w-full border p-2" />
            <input type="date" value={cert.dateReceived} onChange={(e) => handleCertificationChange(idx, "dateReceived", e.target.value)} className="w-full border p-2" required />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={cert.hasExpiry} onChange={(e) => handleCertificationChange(idx, "hasExpiry", e.target.checked)} />
              Has Expiry
            </label>
            {cert.hasExpiry && (
              <input type="date" value={cert.expiryDate} onChange={(e) => handleCertificationChange(idx, "expiryDate", e.target.value)} className="w-full border p-2" />
            )}
            <input value={cert.certificateLink} onChange={(e) => handleCertificationChange(idx, "certificateLink", e.target.value)} placeholder="Certificate Link" className="w-full border p-2" />
          </div>
        ))}
        <button type="button" onClick={addCertification} className="text-blue-600 text-sm">+ Add Certification</button>
      </div>

      {/* Image */}
      <div>
        <label className="block font-medium mb-1">Upload Profile Image (≤ 1MB)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Profile</button>
    </form>
  );
};

export default StudentProfileUpdate;
