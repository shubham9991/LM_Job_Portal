import React, { useEffect, useState } from "react";
import { fetchStudentProfile, updateStudentProfile } from "@/api/student";
import { uploadCertificate } from "@/api/auth";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const emptyEducation = {
  id: undefined,
  college_name: "",
  university_name: "",
  course_name: "",
  start_year: "",
  end_year: "",
  gpa: "",
};

const emptyCertificate = {
  id: undefined,
  name: "",
  issuedBy: "",
  description: "",
  dateReceived: "",
  hasExpiry: false,
  expiryDate: "",
  file: null,
  certificateLink: "",
};

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
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
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchStudentProfile();
        if (res?.success) {
          const p = res.data.profile || {};
          setFormData({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            mobile: p.mobile || "",
            about: p.about || "",
            profileImage: null,
            profilePreview: p.imageUrl || "",
            education:
              p.education && p.education.length
                ? p.education.map((e) => ({
                    id: e.id,
                    college_name: e.college_name,
                    university_name: e.university_name,
                    course_name: e.course_name,
                    start_year: e.start_year,
                    end_year: e.end_year,
                    gpa: e.gpa,
                  }))
                : [{ ...emptyEducation }],
            certifications:
              p.certifications?.map((c) => ({
                id: c.id,
                name: c.name,
                issuedBy: c.issuedBy,
                description: c.description,
                dateReceived: c.dateReceived,
                hasExpiry: c.hasExpiry,
                expiryDate: c.expiryDate,
                certificateLink: c.certificateLink,
                file: null,
              })) || [],
          });
          setSkills(p.skills || []);
        } else {
          toast.error(res?.message || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const handleEducationChange = (idx, field, value) => {
    setFormData((p) => {
      const eds = [...p.education];
      eds[idx] = { ...eds[idx], [field]: value };
      return { ...p, education: eds };
    });
  };

  const addEducation = () => {
    setFormData((p) => ({ ...p, education: [...p.education, { ...emptyEducation }] }));
  };

  const removeEducation = (idx) => {
    setFormData((p) => ({ ...p, education: p.education.filter((_, i) => i !== idx) }));
  };

  const handleCertChange = async (idx, field, value) => {
    if (field === "file") {
      const uploadRes = await uploadCertificate(value);
      setFormData((p) => {
        const certs = [...p.certifications];
        certs[idx] = {
          ...certs[idx],
          file: value,
          certificateLink: uploadRes?.data?.filePath || "",
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
    try {
      const certPayload = formData.certifications.map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        name: c.name,
        issuedBy: c.issuedBy,
        description: c.description,
        dateReceived: c.dateReceived,
        hasExpiry: c.hasExpiry,
        expiryDate: c.expiryDate,
        certificateLink: c.certificateLink,
      }));

      const eduPayload = formData.education.map((ed) => ({
        ...(ed.id ? { id: ed.id } : {}),
        college_name: ed.college_name,
        university_name: ed.university_name,
        course_name: ed.course_name,
        start_year: ed.start_year ? Number(ed.start_year) : undefined,
        end_year: ed.end_year ? Number(ed.end_year) : undefined,
        gpa: ed.gpa,
      }));

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        about: formData.about,
        education: eduPayload,
        certifications: certPayload,
        skills,
      };

      const fd = new FormData();
      fd.append("profileData", JSON.stringify(payload));
      if (formData.profileImage) {
        fd.append("image", formData.profileImage);
      }

      const res = await updateStudentProfile(fd);
      if (res?.success) {
        toast.success("Profile updated successfully");
        navigate("/student/dashboard");
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            className="border p-2 rounded"
            value={formData.firstName}
            onChange={handleFieldChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="border p-2 rounded"
            value={formData.lastName}
            onChange={handleFieldChange}
            required
          />
        </div>
        <input
          name="mobile"
          placeholder="Mobile"
          className="w-full border p-2 rounded"
          value={formData.mobile}
          onChange={handleFieldChange}
          required
        />
        <textarea
          name="about"
          placeholder="About"
          className="w-full border p-2 rounded"
          value={formData.about}
          onChange={handleFieldChange}
          rows={3}
        />
        <div>
          {formData.profilePreview && (
            <img
              src={formData.profilePreview}
              alt="Preview"
              className="w-24 h-24 mb-2 rounded-full object-cover"
            />
          )}
          <input type="file" name="profileImage" accept="image/*" onChange={handleFieldChange} className="w-full" />
        </div>
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
        <div className="space-y-4">
          <h3 className="font-medium">Certificates</h3>
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="border p-3 rounded">
              <input
                placeholder="Name"
                className="border p-2 rounded w-full mb-2"
                value={cert.name}
                onChange={(e) => handleCertChange(idx, "name", e.target.value)}
              />
              <input
                placeholder="Issued By"
                className="border p-2 rounded w-full mb-2"
                value={cert.issuedBy}
                onChange={(e) => handleCertChange(idx, "issuedBy", e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded w-full mb-2"
                value={cert.description}
                onChange={(e) => handleCertChange(idx, "description", e.target.value)}
              />
              <input
                type="date"
                className="border p-2 rounded w-full mb-2"
                value={cert.dateReceived}
                onChange={(e) => handleCertChange(idx, "dateReceived", e.target.value)}
              />
              <input
                type="file"
                accept="application/pdf,image/*"
                className="w-full"
                onChange={(e) => handleCertChange(idx, "file", e.target.files[0])}
              />
              {cert.certificateLink && <p className="text-xs mt-1 break-all">{cert.certificateLink}</p>}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cert.hasExpiry}
                  onChange={(e) => handleCertChange(idx, "hasExpiry", e.target.checked)}
                />
                <label className="text-sm">Has Expiry</label>
              </div>
              {cert.hasExpiry && (
                <input
                  type="date"
                  className="border p-2 rounded w-full mt-2"
                  value={cert.expiryDate}
                  onChange={(e) => handleCertChange(idx, "expiryDate", e.target.value)}
                />
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
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
};

export default StudentProfile;
