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
  name: "",
  issued_by: "",
  description: "",
  date_received: "",
  has_expiry: false,
  expiry_date: "",
  file: null,
  certificate_link: "",
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
    profilePreview: "",
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
      const file = files[0];
      setFormData((p) => ({ ...p, profileImage: file, profilePreview: URL.createObjectURL(file) }));
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

  const handleCertChange = async (idx, field, value) => {
    if (field === "file") {
      const uploadRes = await uploadCertificate(value);
      console.log("Certificate uploaded", uploadRes);
      setFormData((p) => {
        const certs = [...p.certifications];
        certs[idx] = {
          ...certs[idx],
          file: value,
          certificate_link: uploadRes?.data?.filePath || "",
        };
        return { ...p, certifications: certs };
      });
    } else {
      setFormData((p) => {
        const certs = [...p.certifications];
        certs[idx] = { ...certs[idx], [field]: value };
        return { ...p, certifications: certs };
      });
    }
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
      console.log("Submitting onboarding data");
      let profileImagePath = "";
      if (formData.profileImage) {
        const up = await uploadProfileImage(formData.profileImage);
        if (up?.success) {
          profileImagePath = up.data.filePath;
        }
      }

      const certPayload = [];
      for (const cert of formData.certifications) {
        if (!cert.name || !cert.issued_by || !cert.date_received || !cert.certificate_link) {
          toast.error("Please fill all certificate details and upload files");
          return;
        }
        certPayload.push({
          name: cert.name,
          issued_by: cert.issued_by,
          description: cert.description,
          date_received: cert.date_received,
          has_expiry: cert.has_expiry,
          expiry_date: cert.expiry_date,
          certificate_link: cert.certificate_link,
        });
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        about: formData.about,
        image: profileImagePath,
        education: [formData.education],
        certifications: certPayload,
        skills,
      };

      const fd = new FormData();
      fd.append("profileData", JSON.stringify(payload));
      console.log("Payload", payload);
      const res = await authOnboarding(fd);
      console.log("Onboarding response", res);
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
          {formData.profilePreview && (
            <div className="w-24 h-24 mb-2 rounded-full overflow-hidden">
              <img
                src={formData.profilePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
                  <label className="block text-sm">Name</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={cert.name}
                    onChange={(e) => handleCertChange(idx, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm">Issued By</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={cert.issued_by}
                    onChange={(e) =>
                      handleCertChange(idx, "issued_by", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="block text-sm">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={2}
                  value={cert.description}
                  onChange={(e) => handleCertChange(idx, "description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm">Issue Date</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={cert.date_received}
                    onChange={(e) =>
                      handleCertChange(idx, "date_received", e.target.value)
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
                  {cert.certificate_link && (
                    <p className="text-xs mt-1 break-all">{cert.certificate_link}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2 items-center">
                <div className="flex items-center gap-2">
                  <input
                    id={`expiry-${idx}`}
                    type="checkbox"
                    checked={cert.has_expiry}
                    onChange={(e) => handleCertChange(idx, "has_expiry", e.target.checked)}
                  />
                  <label htmlFor={`expiry-${idx}`} className="text-sm">
                    Has Expiry
                  </label>
                </div>
                {cert.has_expiry && (
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={cert.expiry_date}
                    onChange={(e) =>
                      handleCertChange(idx, "expiry_date", e.target.value)
                    }
                  />
                )}
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

