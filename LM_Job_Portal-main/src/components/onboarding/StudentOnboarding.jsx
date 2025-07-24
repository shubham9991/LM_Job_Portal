import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authOnboarding } from "@/api/auth";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    about: "",
    education: {
      college_name: "",
      university_name: "",
      course_name: "",
      start_year: "",
      end_year: "",
      gpa: "",
    },
    certification: {
      name: "",
      issued_by: "",
      description: "",
      date_received: "",
      has_expiry: false,
      expiry_date: "",
      certificate_link: "",
    },
    skills: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isOnboardingComplete) {
      navigate("/student/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("education.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, [key]: value },
      }));
    } else if (name.startsWith("certification.")) {
      const key = name.split(".")[1];
      const val = type === "checkbox" ? checked : value;
      setFormData((prev) => ({
        ...prev,
        certification: { ...prev.certification, [key]: val },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("User not found in localStorage!");
      return;
    }
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        about: formData.about,
        education: [formData.education],
        certifications: [formData.certification],
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const fd = new FormData();
      fd.append("profileData", JSON.stringify(payload));
      const res = await authOnboarding(fd);
      if (res?.success) {
        const updatedUser = { ...user, isOnboardingComplete: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
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
                onChange={handleChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">University</label>
              <input
                name="education.university_name"
                value={formData.education.university_name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
                  type="number"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm">End Year</label>
                <input
                  name="education.end_year"
                  value={formData.education.end_year}
                  onChange={handleChange}
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
              onChange={handleChange}
              type="text"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div className="border p-3 rounded">
          <h3 className="font-medium mb-2">Certification</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Name</label>
              <input
                name="certification.name"
                value={formData.certification.name}
                onChange={handleChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Issued By</label>
              <input
                name="certification.issued_by"
                value={formData.certification.issued_by}
                onChange={handleChange}
                type="text"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm">Description</label>
            <textarea
              name="certification.description"
              value={formData.certification.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm">Date Received</label>
              <input
                name="certification.date_received"
                value={formData.certification.date_received}
                onChange={handleChange}
                type="date"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Has Expiry</label>
              <input
                name="certification.has_expiry"
                checked={formData.certification.has_expiry}
                onChange={handleChange}
                type="checkbox"
                className="ml-2"
              />
            </div>
          </div>
          {formData.certification.has_expiry && (
            <div className="mt-2">
              <label className="block text-sm">Expiry Date</label>
              <input
                name="certification.expiry_date"
                value={formData.certification.expiry_date}
                onChange={handleChange}
                type="date"
                className="w-full border p-2 rounded"
              />
            </div>
          )}
          <div className="mt-2">
            <label className="block text-sm">Certificate Link</label>
            <input
              name="certification.certificate_link"
              value={formData.certification.certificate_link}
              onChange={handleChange}
              type="url"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Skills (comma separated)</label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            type="text"
            className="w-full border p-2 rounded"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default StudentOnboarding;

