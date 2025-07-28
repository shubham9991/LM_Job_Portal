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
  const [currentSkillInput, setCurrentSkillInput] = useState('');
  
  const MAX_SKILLS = 5;
  const MAX_BIO_LENGTH = 250;

  // Generate year options for dropdowns (from 1980 to current year + 10)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear + 10; y >= 1980; y--) {
    yearOptions.push(String(y));
  }

  // Fetch profile data on mount
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
            skills: Array.isArray(profileData.skills) && profileData.skills.length
              ? [...profileData.skills, ""]
              : [""],
            education: Array.isArray(profileData.education) && profileData.education.length
              ? profileData.education.map((edu) => ({
                  collegeName: edu.collegeName || "",
                  universityName: edu.universityName || "",
                  courseName: edu.courseName || "",
                  startYear: edu.startYear ? String(edu.startYear) : "",
                  endYear: edu.endYear ? String(edu.endYear) : "",
                  gpa: edu.gpa || "",
                }))
              : [{
                  collegeName: "",
                  universityName: "",
                  courseName: "",
                  startYear: "",
                  endYear: "",
                  gpa: "",
                }],
            certifications: Array.isArray(profileData.certifications) && profileData.certifications.length
              ? profileData.certifications.map((cert) => ({
                  name: cert.name || "",
                  issuedBy: cert.issuedBy || "",
                  description: cert.description || "",
                  dateReceived: cert.dateReceived || "",
                  hasExpiry: cert.hasExpiry || false,
                  expiryDate: cert.expiryDate || "",
                  certificateLink: cert.certificateLink || "",
                }))
              : [],
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

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "about" && value.length > MAX_BIO_LENGTH) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    const filledSkills = formData.skills.filter(s => s.trim());
    if (filledSkills.length >= MAX_SKILLS) {
      toast.error(`Maximum ${MAX_SKILLS} skills allowed`);
      return;
    }
    
    if (currentSkillInput.trim()) {
      const newSkills = [...filledSkills, currentSkillInput.trim()];
      if (newSkills.length < MAX_SKILLS) {
        newSkills.push(""); // Add empty slot for next input
      }
      setFormData(prev => ({ ...prev, skills: newSkills }));
      setCurrentSkillInput('');
    }
  };

  const removeSkill = (index) => {
    const filledSkills = formData.skills.filter(s => s.trim());
    filledSkills.splice(index, 1);
    
    // Always ensure there's an empty slot for input if under max
    const newSkills = filledSkills.length < MAX_SKILLS ? [...filledSkills, ""] : filledSkills;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { collegeName: "", universityName: "", courseName: "", startYear: "", endYear: "", gpa: "" }],
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const newEducation = formData.education.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, education: newEducation }));
    }
  };

  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...formData.certifications];
    newCerts[index][field] = value;
    setFormData(prev => ({ ...prev, certifications: newCerts }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuedBy: "", description: "", dateReceived: "", hasExpiry: false, expiryDate: "", certificateLink: "" }],
    }));
  };

  const removeCertification = (index) => {
    const newCerts = [...formData.certifications];
    newCerts.splice(index, 1);
    setFormData(prev => ({ ...prev, certifications: newCerts }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      toast.error("Image must be less than 1MB.");
      e.target.value = "";
      return;
    }
    setFormData(prev => ({ ...prev, image: file }));
    setExistingImageUrl(null);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setExistingImageUrl(null);
    const input = document.getElementById("image-upload");
    if (input) input.value = "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName.trim());
      payload.append("lastName", formData.lastName.trim());
      payload.append("mobile", formData.mobile.trim());
      payload.append("about", formData.about.trim());

      const cleanedSkills = formData.skills.filter(s => s.trim());
      if (cleanedSkills.length === 0) throw new Error("At least 1 skill required");
      payload.append("skills", JSON.stringify(cleanedSkills));

      const cleanedEducation = formData.education.filter(edu => edu.collegeName.trim() || edu.universityName.trim() || edu.courseName.trim())
        .map((edu, i) => {
          if (!edu.collegeName.trim() || !edu.universityName.trim() || !edu.courseName.trim()) {
            throw new Error(`Education #${i + 1} is incomplete.`);
          }
          return {
            collegeName: edu.collegeName.trim(),
            universityName: edu.universityName.trim(),
            courseName: edu.courseName.trim(),
            startYear: edu.startYear ? Number(edu.startYear) : null,
            endYear: edu.endYear ? Number(edu.endYear) : null,
            gpa: edu.gpa.trim() || "",
          };
        });
      if (cleanedEducation.length > 0) payload.append("education", JSON.stringify(cleanedEducation));

      // Handle certifications - ALWAYS send certifications array, even if empty
      const cleanedCerts = formData.certifications.filter(cert => cert.name.trim() || cert.issuedBy.trim() || cert.dateReceived)
        .map((cert, i) => {
          if (!cert.name.trim() || !cert.issuedBy.trim() || !cert.dateReceived) {
            throw new Error(`Certification #${i + 1} is incomplete.`);
          }
          return {
            name: cert.name.trim(),
            issuedBy: cert.issuedBy.trim(),
            description: cert.description.trim() || "",
            dateReceived: cert.dateReceived,
            hasExpiry: cert.hasExpiry || false,
            expiryDate: cert.hasExpiry ? cert.expiryDate : null,
            certificateLink: cert.certificateLink.trim() || "",
          };
        });
      
      // ALWAYS send certifications, even if empty array
      payload.append("certifications", JSON.stringify(cleanedCerts));
      
      // Debug log to see what's being sent
      console.log("Certifications being sent:", cleanedCerts);
      console.log("Original certifications array:", formData.certifications);

      if (formData.image) payload.append("image", formData.image);

      const res = await updateStudentProfile(payload);
      if (res?.success) {
        toast.success("Profile updated successfully!");
        // Optionally refresh the data to verify the changes
        // You might want to uncomment this to see if the data was actually updated
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        toast.error(res?.message || "Update failed.");
      }
    } catch (err) {
      toast.error(err.message || "Validation failed.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const nonEmptySkillsCount = formData.skills.filter(s => s.trim()).length;
  const isMaxSkillsReached = nonEmptySkillsCount >= MAX_SKILLS;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Image Upload Section (top) */}
      <div>
        <label className="block font-semibold mb-2">Profile Image</label>
        <div className="flex items-center gap-4">
          {(formData.image || existingImageUrl) && (
            <div className="relative">
              <img
                src={formData.image ? URL.createObjectURL(formData.image) : existingImageUrl}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border-4 border-gray-300"
              />
              <button type="button" onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                ×
              </button>
            </div>
          )}

          <div className="relative">
            <input type="file" accept="image/*" onChange={handleImageChange} id="image-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <label htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Choose
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Max 1MB, JPG/PNG
            {formData.image && (
              <div className="mt-1">{formData.image.name} ({(formData.image.size / 1024).toFixed(1)} KB)</div>
            )}
          </div>
        </div>
      </div>

      {/* Name inputs */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text" name="firstName" value={formData.firstName} required
          onChange={handleInputChange}
          placeholder="First Name"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
        <input
          type="text" name="lastName" value={formData.lastName} required
          onChange={handleInputChange}
          placeholder="Last Name"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
      </div>

      {/* Mobile */}
      <input
        type="tel" name="mobile" value={formData.mobile} required
        onChange={handleInputChange}
        placeholder="Mobile Number"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />

      {/* About */}
      <div className="relative">
        <label className="block font-semibold mb-2">About You</label>
        <textarea name="about" value={formData.about} required rows={4}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
        <div className="absolute bottom-2 right-3 text-xs text-gray-500">{MAX_BIO_LENGTH - formData.about.length} left</div>
      </div>

      {/* Skills */}
      <div>
        <label className="block font-semibold mb-2">Skills (Max {MAX_SKILLS})</label>

        <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
          {formData.skills.filter(s => s.trim()).map((skill, idx) => (
            <div key={idx} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 flex items-center gap-2 text-sm">
              <span>{skill}</span>
              <button type="button" onClick={() => removeSkill(idx)}
                className="text-blue-600 hover:text-blue-800 font-bold leading-none">×</button>
            </div>
          ))}
          {formData.skills.filter(s => s.trim()).length === 0 && (
            <p className="text-gray-400 text-sm">No skills added yet.</p>
          )}
        </div>

        {/* Show input only if less than max */}
        {formData.skills.filter(s => s.trim()).length < MAX_SKILLS && (
          <div className="flex gap-2">
            <input type="text"
              value={currentSkillInput}
              onChange={e => setCurrentSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (currentSkillInput.trim()) addSkill();
                }
              }}
              placeholder="Enter a skill and press Enter"
              className="flex-grow border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <button type="button" onClick={addSkill}
              disabled={!currentSkillInput.trim() || formData.skills.filter(s => s.trim()).length >= MAX_SKILLS}
              className="bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:cursor-not-allowed">
              Add
            </button>
          </div>
        )}
        {formData.skills.filter(s => s.trim()).length >= MAX_SKILLS && (
          <p className="text-red-600 mt-1">Maximum {MAX_SKILLS} skills reached</p>
        )}
      </div>

      {/* Education */}
      <div>
        <label className="block font-semibold mb-2">Education</label>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="border rounded p-4 mb-3 space-y-3">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Education #{idx + 1}</h3>
              {formData.education.length > 1 && (
                <button type="button" onClick={() => removeEducation(idx)}
                  className="text-red-600 hover:text-red-800 font-semibold">Remove</button>
              )}
            </div>
            <input type="text" placeholder="College Name" value={edu.collegeName}
              onChange={e => handleEducationChange(idx, "collegeName", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="University Name" value={edu.universityName}
              onChange={e => handleEducationChange(idx, "universityName", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="Course Name" value={edu.courseName}
              onChange={e => handleEducationChange(idx, "courseName", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <div className="grid grid-cols-2 gap-3">
              <select value={edu.startYear}
                onChange={e => handleEducationChange(idx, "startYear", e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">Start Year</option>
                {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <select value={edu.endYear}
                onChange={e => handleEducationChange(idx, "endYear", e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">End Year</option>
                {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <input type="text" placeholder="GPA" value={edu.gpa}
              onChange={e => handleEducationChange(idx, "gpa", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
        ))}
        <button type="button" onClick={addEducation} className="text-blue-600 hover:text-blue-800 font-semibold">
          + Add Education
        </button>
      </div>

      {/* Certifications */}
      <div>
        <label className="block font-semibold mb-2">Certifications</label>
        {formData.certifications.length === 0 && (
          <p className="text-gray-500 mb-2">No certifications added yet.</p>
        )}
        {formData.certifications.map((cert, idx) => (
          <div key={idx} className="border rounded p-4 mb-3 space-y-3">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Certification #{idx + 1}</h3>
              <button type="button" onClick={() => removeCertification(idx)}
                className="text-red-600 hover:text-red-800 font-semibold">Remove</button>
            </div>
            <input type="text" placeholder="Certification Name" value={cert.name}
              onChange={e => handleCertificationChange(idx, "name", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="Issued By" value={cert.issuedBy}
              onChange={e => handleCertificationChange(idx, "issuedBy", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <textarea placeholder="Description" value={cert.description} rows={2}
              onChange={e => handleCertificationChange(idx, "description", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="date" value={cert.dateReceived}
              onChange={e => handleCertificationChange(idx, "dateReceived", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={cert.hasExpiry}
                onChange={e => handleCertificationChange(idx, "hasExpiry", e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600" /> Has Expiry Date
            </label>
            {cert.hasExpiry && (
              <input type="date" value={cert.expiryDate}
                onChange={e => handleCertificationChange(idx, "expiryDate", e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            )}
            <input type="text" placeholder="Certificate Link (optional)" value={cert.certificateLink}
              onChange={e => handleCertificationChange(idx, "certificateLink", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
        ))}
        <button type="button" onClick={addCertification} className="text-blue-600 hover:text-blue-800 font-semibold">
          + Add Certification
        </button>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded">
        Update Profile
      </button>
    </form>
  );
};

export default StudentProfileUpdate;
