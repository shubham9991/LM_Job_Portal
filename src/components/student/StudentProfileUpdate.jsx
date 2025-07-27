import React, { useState, useEffect } from "react";
import { updateStudentProfile, getStudentProfile } from "@/api/student";
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

  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const MAX_BIO_LENGTH = 250;
  const MAX_SKILLS = 5;

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        if (response) {
          const profileData = response;

          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            mobile: profileData.mobile || "",
            about: profileData.about || "",
            skills:
              Array.isArray(profileData.skills) && profileData.skills.length
                ? profileData.skills
                : [""],
            education:
              Array.isArray(profileData.education) && profileData.education.length
                ? profileData.education.map((edu) => ({
                    collegeName: edu.collegeName || "",
                    universityName: edu.universityName || "",
                    courseName: edu.courseName || "",
                    startYear: edu.startYear || "",
                    endYear: edu.endYear || "",
                    gpa: edu.gpa || "",
                  }))
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
              Array.isArray(profileData.certifications) && profileData.certifications.length
                ? profileData.certifications.map((cert) => ({
                    name: cert.name || "",
                    issuedBy: cert.issuedBy || "",
                    description: cert.description || "",
                    dateReceived: cert.dateReceived || "",
                    hasExpiry: cert.hasExpiry || false,
                    expiryDate: cert.expiryDate || "",
                    certificateLink: cert.certificateLink || "",
                  }))
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
            image: null,
          });

          setExistingImageUrl(profileData.imageUrl || null);
        } else {
          toast.error("No profile data found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "about") {
      if (value.length > MAX_BIO_LENGTH) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const updated = [...formData.skills];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    const nonEmptySkills = formData.skills.filter((skill) => skill.trim());
    if (nonEmptySkills.length >= MAX_SKILLS) {
      toast.error(`Maximum ${MAX_SKILLS} skills allowed`);
      return;
    }

    const lastSkill = formData.skills[formData.skills.length - 1];
    if (lastSkill && lastSkill.trim()) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
    }
  };

  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    if (updated.length === 0 || updated[updated.length - 1].trim() !== "") {
      updated.push("");
    }
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

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

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const updated = formData.education.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, education: updated }));
    }
  };

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

  const removeCertification = (index) => {
    if (formData.certifications.length > 1) {
      const updated = formData.certifications.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, certifications: updated }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB. Please select a smaller image.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setExistingImageUrl(null);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageUrl(null);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName.trim());
      payload.append("lastName", formData.lastName.trim());
      payload.append("mobile", formData.mobile.trim());
      payload.append("about", formData.about.trim());

      const cleanSkills = formData.skills.filter((s) => s?.trim());
      if (!cleanSkills.length) throw new Error("At least one skill is required.");
      payload.append("skills", JSON.stringify(cleanSkills));

      const cleanEducation = formData.education
        .filter(
          (edu) =>
            edu.collegeName?.trim() ||
            edu.universityName?.trim() ||
            edu.courseName?.trim()
        )
        .map((edu) => {
          if (
            !edu.collegeName?.trim() ||
            !edu.universityName?.trim() ||
            !edu.courseName?.trim()
          ) {
            throw new Error(
              "Education entry is incomplete. Please fill all required fields (College Name, University Name, Course Name)."
            );
          }
          return {
            collegeName: edu.collegeName.trim(),
            universityName: edu.universityName.trim(),
            courseName: edu.courseName.trim(),
            startYear: edu.startYear ? Number(edu.startYear) : null,
            endYear: edu.endYear ? Number(edu.endYear) : null,
            gpa: edu.gpa?.trim() || "",
          };
        });

      if (cleanEducation.length > 0) {
        payload.append("education", JSON.stringify(cleanEducation));
      }

      const cleanCerts = formData.certifications
        .filter(
          (cert) =>
            cert.name?.trim() || cert.issuedBy?.trim() || cert.dateReceived
        )
        .map((cert) => {
          if (
            !cert.name?.trim() ||
            !cert.issuedBy?.trim() ||
            !cert.dateReceived
          ) {
            throw new Error(
              "Certification entry is incomplete. Please fill all required fields (Name, Issued By, Date Received)."
            );
          }
          return {
            name: cert.name.trim(),
            issuedBy: cert.issuedBy.trim(),
            description: cert.description?.trim() || "",
            dateReceived: cert.dateReceived,
            hasExpiry: cert.hasExpiry || false,
            expiryDate:
              cert.hasExpiry && cert.expiryDate ? cert.expiryDate : null,
            certificateLink: cert.certificateLink?.trim() || "",
          };
        });

      if (cleanCerts.length > 0) {
        payload.append("certifications", JSON.stringify(cleanCerts));
      }

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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Image Upload - moved to top */}
      <div>
        <label className="block font-semibold mb-2">Profile Image</label>

        <div className="flex items-center gap-4">
          {(formData.image || existingImageUrl) && (
            <div className="relative">
              <img
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image)
                    : existingImageUrl
                }
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border-4 border-gray-300"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Choose Image
            </label>
          </div>

          <div className="text-xs text-gray-500">
            Max 1MB, JPG/PNG
            {formData.image && (
              <div className="mt-1">
                {formData.image.name} ({(formData.image.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name inputs */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Mobile */}
      <input
        name="mobile"
        value={formData.mobile}
        onChange={handleInputChange}
        placeholder="Mobile Number"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />

      {/* About */}
      <div className="relative">
        <label className="block font-semibold mb-2">About You</label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {MAX_BIO_LENGTH - formData.about.length} left
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block font-semibold mb-2">
          Skills (Max {MAX_SKILLS})
        </label>

        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.skills
            .filter((skill) => skill.trim())
            .map((skill, idx) => {
              const originalIndex = formData.skills.findIndex((s) => s === skill);
              return (
                <div
                  key={`${skill}-${idx}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(originalIndex)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          {formData.skills.filter((skill) => skill.trim()).length === 0 && (
            <p className="text-gray-400 text-sm">
              No skills added yet. Start typing to add skills.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={formData.skills[formData.skills.length - 1] || ""}
            onChange={(e) =>
              handleSkillChange(formData.skills.length - 1, e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.target.value.trim()) {
                  addSkill();
                }
              }
            }}
            placeholder="Enter a skill and press Enter"
            className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={
              formData.skills.filter((skill) => skill.trim()).length >= MAX_SKILLS
            }
          />
          <button
            type="button"
            onClick={() => {
              if (formData.skills[formData.skills.length - 1]?.trim()) {
                addSkill();
              }
            }}
            disabled={
              formData.skills.filter((skill) => skill.trim()).length >= MAX_SKILLS
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        {formData.skills.filter((skill) => skill.trim()).length >= MAX_SKILLS && (
          <p className="text-red-500 text-sm mt-1">
            Maximum {MAX_SKILLS} skills reached
          </p>
        )}
      </div>

      {/* Education */}
      <div>
        <label className="block font-semibold mb-2">Education</label>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="border p-4 mb-3 rounded-lg space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Education #{idx + 1}</h4>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              value={edu.collegeName}
              onChange={(e) => handleEducationChange(idx, "collegeName", e.target.value)}
              placeholder="College Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              value={edu.universityName}
              onChange={(e) => handleEducationChange(idx, "universityName", e.target.value)}
              placeholder="University Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              value={edu.courseName}
              onChange={(e) => handleEducationChange(idx, "courseName", e.target.value)}
              placeholder="Course Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={edu.startYear}
                onChange={(e) => handleEducationChange(idx, "startYear", e.target.value)}
                placeholder="Start Year"
                type="number"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                value={edu.endYear}
                onChange={(e) => handleEducationChange(idx, "endYear", e.target.value)}
                placeholder="End Year"
                type="number"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              value={edu.gpa}
              onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)}
              placeholder="GPA"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="text-blue-600 text-sm hover:text-blue-800 font-medium"
        >
          + Add Education
        </button>
      </div>

      {/* Certifications */}
      <div>
        <label className="block font-semibold mb-2">Certifications</label>
        {formData.certifications.map((cert, idx) => (
          <div key={idx} className="border p-4 mb-3 rounded-lg space-y-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">Certification #{idx + 1}</h4>
              {formData.certifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCertification(idx)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              value={cert.name}
              onChange={(e) => handleCertificationChange(idx, "name", e.target.value)}
              placeholder="Certification Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              value={cert.issuedBy}
              onChange={(e) => handleCertificationChange(idx, "issuedBy", e.target.value)}
              placeholder="Issued By"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              value={cert.description}
              onChange={(e) => handleCertificationChange(idx, "description", e.target.value)}
              placeholder="Description"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
            <input
              type="date"
              value={cert.dateReceived}
              onChange={(e) => handleCertificationChange(idx, "dateReceived", e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={cert.hasExpiry}
                onChange={(e) => handleCertificationChange(idx, "hasExpiry", e.target.checked)}
                className="w-4 h-4"
              />
              <span>Has Expiry Date</span>
            </label>
            {cert.hasExpiry && (
              <input
                type="date"
                value={cert.expiryDate}
                onChange={(e) => handleCertificationChange(idx, "expiryDate", e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Expiry Date"
              />
            )}
            <input
              value={cert.certificateLink}
              onChange={(e) => handleCertificationChange(idx, "certificateLink", e.target.value)}
              placeholder="Certificate Link (optional)"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addCertification}
          className="text-blue-600 text-sm hover:text-blue-800 font-medium"
        >
          + Add Certification
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
      >
        Update Profile
      </button>
    </form>
  );
};

export default StudentProfileUpdate;
