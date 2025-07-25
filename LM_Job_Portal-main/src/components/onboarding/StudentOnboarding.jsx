import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authOnboarding, uploadCertificate } from "@/api/auth";
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
    education: [{ ...emptyEducation }],
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
      setFormData((p) => ({
        ...p,
        profileImage: file,
        profilePreview: URL.createObjectURL(file),
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

  const handleEducationChange = (idx, field, value) => {
    setFormData((p) => {
      const eds = [...p.education];
      eds[idx] = { ...eds[idx], [field]: value };
      return { ...p, education: eds };
    });
  };

  const addEducation = () => {
    setFormData((p) => ({
      ...p,
      education: [...p.education, { ...emptyEducation }],
    }));
  };

  const removeEducation = (idx) => {
    setFormData((p) => ({
      ...p,
      education: p.education.filter((_, i) => i !== idx),
    }));
  };

  const handleCertChange = async (idx, field, value) => {
    if (field === "file") {
      const uploadRes = await uploadCertificate(value);
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
        education: formData.education,
        certifications: certPayload,
        skills,
      };

      const fd = new FormData();
      fd.append("profileData", JSON.stringify(payload));
      if (formData.profileImage) fd.append("image", formData.profileImage);
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
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" className="border p-2 rounded" value={formData.firstName} onChange={handleFieldChange} required />
          <input name="lastName" placeholder="Last Name" className="border p-2 rounded" value={formData.lastName} onChange={handleFieldChange} required />
        </div>
        <input name="mobile" placeholder="Mobile" className="w-full border p-2 rounded" value={formData.mobile} onChange={handleFieldChange} required />
        <textarea name="about" placeholder="About" className="w-full border p-2 rounded" value={formData.about} onChange={handleFieldChange} rows={3} required />

        {/* Profile Image */}
        <div>
          {formData.profilePreview && (
            <img src={formData.profilePreview} alt="Preview" className="w-24 h-24 mb-2 rounded-full object-cover" />
          )}
          <input type="file" name="profileImage" accept="image/*" onChange={handleFieldChange} className="w-full" />
        </div>

        {/* Education */}
        <div className="border p-3 rounded space-y-4">
          <h3 className="font-medium">Education</h3>
          {formData.education.map((edu, idx) => (
            <div key={idx} className="border p-3 rounded">
              <input
                placeholder="College Name"
                className="border p-2 rounded w-full mb-2"
                value={edu.college_name}
                onChange={(e) => handleEducationChange(idx, "college_name", e.target.value)}
              />
              <input
                placeholder="University"
                className="border p-2 rounded w-full mb-2"
                value={edu.university_name}
                onChange={(e) => handleEducationChange(idx, "university_name", e.target.value)}
              />
              <input
                placeholder="Course"
                className="border p-2 rounded w-full mb-2"
                value={edu.course_name}
                onChange={(e) => handleEducationChange(idx, "course_name", e.target.value)}
              />
              <input
                placeholder="Start Year"
                type="number"
                className="border p-2 rounded w-full mb-2"
                value={edu.start_year}
                onChange={(e) => handleEducationChange(idx, "start_year", e.target.value)}
              />
              <input
                placeholder="End Year"
                type="number"
                className="border p-2 rounded w-full mb-2"
                value={edu.end_year}
                onChange={(e) => handleEducationChange(idx, "end_year", e.target.value)}
              />
              <input
                placeholder="GPA"
                className="border p-2 rounded w-full"
                value={edu.gpa}
                onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)}
              />
              {formData.education.length > 1 && (
                <Button type="button" variant="ghost" onClick={() => removeEducation(idx)} className="mt-2">
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={addEducation} variant="secondary">
            Add Education
          </Button>
        </div>

        {/* Certificates */}
        <div className="space-y-4">
          <h3 className="font-medium">Certificates</h3>
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="border p-3 rounded">
              <input placeholder="Name" className="border p-2 rounded w-full mb-2" value={cert.name} onChange={(e) => handleCertChange(idx, "name", e.target.value)} />
              <input placeholder="Issued By" className="border p-2 rounded w-full mb-2" value={cert.issued_by} onChange={(e) => handleCertChange(idx, "issued_by", e.target.value)} />
              <textarea placeholder="Description" className="border p-2 rounded w-full mb-2" value={cert.description} onChange={(e) => handleCertChange(idx, "description", e.target.value)} />
              <input type="date" className="border p-2 rounded w-full mb-2" value={cert.date_received} onChange={(e) => handleCertChange(idx, "date_received", e.target.value)} />
              <input type="file" accept="application/pdf,image/*" className="w-full" onChange={(e) => handleCertChange(idx, "file", e.target.files[0])} />
              {cert.certificate_link && <p className="text-xs mt-1 break-all">{cert.certificate_link}</p>}
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" checked={cert.has_expiry} onChange={(e) => handleCertChange(idx, "has_expiry", e.target.checked)} />
                <label className="text-sm">Has Expiry</label>
              </div>
              {cert.has_expiry && (
                <input type="date" className="border p-2 rounded w-full mt-2" value={cert.expiry_date} onChange={(e) => handleCertChange(idx, "expiry_date", e.target.value)} />
              )}
              <Button type="button" variant="ghost" onClick={() => removeCertificate(idx)} className="mt-2">
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCertificate} variant="secondary">
            Add Certificate
          </Button>
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium mb-1">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, idx) => (
              <Badge key={idx} className="flex items-center gap-1">
                {skill}
                <button type="button" className="ml-1 text-xs" onClick={() => removeSkill(idx)}>
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
