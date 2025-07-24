import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  authOnboarding,
  uploadProfileImage,
  uploadCertificate,
} from "@/api/auth";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import useLogout from "@/hooks/useLogout";

const emptyEducation = {
  college_name: "",
  university_name: "",
  course_name: "",
  start_year: "",
  end_year: "",
  gpa: "",
};

const emptyCertificate = {
  title: "",
  issuingOrganization: "",
  issueDate: "",
  file: null,
};

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    about: "",
    profileImage: null,
    education: { ...emptyEducation },
    certifications: [],
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isOnboardingComplete) {
      navigate("/student/dashboard");
    }
  }, [navigate]);

  const handleFieldChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((p) => ({ ...p, profileImage: files[0] }));
    } else if (name.startsWith("education.")) {
      const key = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        education: { ...p.education, [key]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const addCertificate = () => {
    setFormData((p) => ({
      ...p,
      certifications: [...p.certifications, { ...emptyCertificate }],
    }));
  };

  const removeCertificate = (idx) => {
    setFormData((p) => ({
      ...p,
      certifications: p.certifications.filter((_, i) => i !== idx),
    }));
  };

  const handleCertChange = (idx, field, value) => {
    setFormData((p) => {
      const certs = [...p.certifications];
      certs[idx] = { ...certs[idx], [field]: value };
      return { ...p, certifications: certs };
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (idx) => {
    setSkills((s) => s.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("User not found in localStorage!");
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile must be 10 digits");
      return;
    }

    try {
      let profileImagePath = "";
      if (formData.profileImage) {
        const up = await uploadProfileImage(formData.profileImage);
        if (up?.success) {
          profileImagePath = up.data.filePath;
        }
      }

      const certPayload = [];
      for (const cert of formData.certifications) {
        if (!cert.title || !cert.issuingOrganization || !cert.issueDate || !cert.file) {
          toast.error("Please fill all certificate details");
          return;
        }
        const up = await uploadCertificate(cert.file);
        if (up?.success) {
          certPayload.push({
            title: cert.title,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate,
            filePath: up.data.filePath,
          });
        }
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.mobile,
        about: formData.about,
        profileImagePath,
        educations: [formData.education],
        certifications: certPayload,
        skills,
      };

      const fd = new FormData();
      fd.append("profileData", JSON.stringify(payload));
      const res = await authOnboarding(fd);
      if (res?.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isOnboardingComplete: true })
        );
        toast.success("Onboarding completed!");
        navigate("/student/dashboard");
      } else {
        toast.error(res?.message || "Failed to complete onboarding");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete onboarding");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow relative">
      <Button
        variant="ghost"
        className="absolute top-2 right-2 text-sm"
        onClick={logout}
      >
        Logout
      </Button>
      <h2 className="text-2xl font-semibold mb-4">Student Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleFieldChange}
              type="text"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleFieldChange}
              type="text"
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Mobile</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleFieldChange}
            type="text"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleFieldChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleFieldChange}
            className="w-full"
          />
        </div>
        <div className="border p-3 rounded">
          <h3 className="font-medium mb-2">Education</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">College Name</label>
              <input
                name="education.college_name"
                value={formData.education.college_name}
                onChange={handleFieldChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">University</label>
              <input
                name="education.university_name"
                value={formData.education.university_name}
                onChange={handleFieldChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm">Course</label>
              <input
                name="education.course_name"
                value={formData.education.course_name}
                onChange={handleFieldChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm">Start Year</label>
                <input
                  name="education.start_year"
                  value={formData.education.start_year}
                  onChange={handleFieldChange}
                  type="number"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm">End Year</label>
                <input
                  name="education.end_year"
                  value={formData.education.end_year}
                  onChange={handleFieldChange}
                  type="number"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm">GPA</label>
            <input
              name="education.gpa"
              value={formData.education.gpa}
              onChange={handleFieldChange}
              type="text"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Certificates</h3>
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="border p-3 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Title</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={cert.title}
                    onChange={(e) => handleCertChange(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm">Issued By</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={cert.issuingOrganization}
                    onChange={(e) =>
                      handleCertChange(idx, "issuingOrganization", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm">Issue Date</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={cert.issueDate}
                    onChange={(e) =>
                      handleCertChange(idx, "issueDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm">Upload File</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="w-full"
                    onChange={(e) =>
                      handleCertChange(idx, "file", e.target.files[0])
                    }
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={() => removeCertificate(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCertificate} variant="secondary">
            Add Certificate
          </Button>
        </div>
        <div>
          <label className="block font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, idx) => (
              <Badge key={idx} className="flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  className="ml-1 text-xs"
                  onClick={() => removeSkill(idx)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default StudentOnboarding;

