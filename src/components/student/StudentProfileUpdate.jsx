import React, { useEffect, useState } from "react";
import { updateStudentProfile, getStudentProfile } from "@/api/student";
import profileImg from "../../assets/image1.png";
import { toast } from "react-toastify";

export default function StudentProfileUpdate() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    mobile: user?.phone || "",
    about: "",
    skills: [],
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
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getStudentProfile();
        if (res) {
          setFormData({
            firstName: res.firstName || "",
            lastName: res.lastName || "",
            mobile: res.mobile || "",
            about: res.about || "",
            skills: res.skills || [],
            education:
              Array.isArray(res.education) && res.education.length > 0
                ? res.education
                : [
                    {
                      collegeName: "",
                      universityName: "",
                      courseName: "",
                      startYear: "",
                      endYear: "",
                      gpa: "",
                    },
                  ],
            certifications:
              Array.isArray(res.certifications) && res.certifications.length > 0
                ? res.certifications
                : [
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
            imageFile: null,
          });
          setImagePreview(res.imageUrl || "");
          setHasChanges(false);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        toast.error("Image must be less than 1MB.");
        return;
      }
      setFormData({ ...formData, imageFile: file });
      setHasChanges(true);
      setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
      setHasChanges(true);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(e.target.value.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, e.target.value.trim()],
        });
        setHasChanges(true);
      }
      e.target.value = "";
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
    setHasChanges(true);
  };

  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, education: updated });
    setHasChanges(true);
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          collegeName: "",
          universityName: "",
          courseName: "",
          startYear: "",
          endYear: "",
          gpa: "",
        },
      ],
    });
    setHasChanges(true);
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
    setHasChanges(true);
  };

  const handleCertificationChange = (index, e) => {
    const updated = [...formData.certifications];
    const { name, type, value, checked } = e.target;
    updated[index][name] = type === "checkbox" ? checked : value;
    setFormData({ ...formData, certifications: updated });
    setHasChanges(true);
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
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
    });
    setHasChanges(true);
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("mobile", formData.mobile);
    fd.append("about", formData.about);
    fd.append("skills", JSON.stringify(formData.skills));
    fd.append("education", JSON.stringify(formData.education));

    const cleanedCertifications = formData.certifications.map((cert) => ({
      ...cert,
      expiryDate: cert.hasExpiry ? cert.expiryDate : null,
    }));
    fd.append("certifications", JSON.stringify(cleanedCertifications));

    if (formData.imageFile) fd.append("image", formData.imageFile);

    try {
      const res = await updateStudentProfile(fd);
      if (res?.success) {
        toast.success("Profile updated successfully");
        setHasChanges(false);
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex items-center gap-4">
          <img
            src={imagePreview || profileImg}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <label className="cursor-pointer text-sm text-blue-600 border px-3 py-1 rounded">
            Change Image
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            disabled
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <input type="tel" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="about" placeholder="About You" value={formData.about} onChange={handleChange} className="w-full border p-2 rounded" />

        {/* Skills */}
        <div>
          <label className="block font-medium mb-1">Skills (press enter to add):</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                {skill}
                <button type="button" className="ml-1 text-red-500" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
          <input type="text" onKeyDown={handleSkillKeyDown} placeholder="Type skill and press enter" className="w-full border p-2 rounded" />
        </div>

        {/* Education */}
        <div>
          <label className="block font-medium mb-2">Education</label>
          {formData.education.map((edu, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-4 relative">
              <input name="collegeName" value={edu.collegeName || ""} placeholder="College Name" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <input name="universityName" value={edu.universityName || ""} placeholder="University Name" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <input name="courseName" value={edu.courseName || ""} placeholder="Course Name" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <input name="gpa" value={edu.gpa || ""} placeholder="GPA (optional)" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <input name="startYear" value={edu.startYear || ""} placeholder="Start Year" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <input name="endYear" value={edu.endYear || ""} placeholder="End Year" onChange={(e) => handleEducationChange(idx, e)} className="border p-2 rounded" />
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addEducation} className="text-blue-600 text-sm">+ Add another education</button>
        </div>

        {/* Certifications */}
        <div>
          <label className="block font-medium mb-2">Certifications</label>
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 mb-4 relative">
              <input name="name" value={cert.name || ""} placeholder="Certificate Name" onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded" />
              <input name="issuedBy" value={cert.issuedBy || ""} placeholder="Issued By" onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded" />
              <input name="description" value={cert.description || ""} placeholder="Description" onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded col-span-2" />
              <input type="date" name="dateReceived" value={cert.dateReceived || ""} onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded" />

              <div className="flex items-center space-x-2">
                <input type="checkbox" name="hasExpiry" checked={cert.hasExpiry || false} onChange={(e) => handleCertificationChange(idx, e)} />
                <label className="text-sm">Has Expiry</label>
              </div>

              {cert.hasExpiry && (
                <input type="date" name="expiryDate" value={cert.expiryDate || ""} onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded col-span-2" />
              )}

              <input name="certificateLink" value={cert.certificateLink || ""} placeholder="Certificate Link" onChange={(e) => handleCertificationChange(idx, e)} className="border p-2 rounded col-span-2" />
              <button
                type="button"
                onClick={() => removeCertification(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addCertification} className="text-blue-600 text-sm">+ Add another certificate</button>
        </div>

        <button
          type="submit"
          disabled={!hasChanges}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
            !hasChanges ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
