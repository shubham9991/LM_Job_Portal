import { authOnboarding } from "@/api/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Onboarding = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isSchool = user?.role === "school";

  const [formData, setFormData] = useState(
    isSchool
      ? {
          bio: "",
          website_link: "",
          address: {
            address: "",
            city: "",
            state: "",
            pincode: "",
          },
          image: null,
        }
      : {
          firstName: "",
          lastName: "",
          mobile: "",
          about: "",
          skills: [],
          education: [
            {
              college_name: "",
              university_name: "",
              course_name: "",
              start_year: "",
              end_year: "",
              gpa: "",
            },
          ],
          certifications: [
            {
              name: "",
              issued_by: "",
              description: "",
              date_received: "",
              has_expiry: false,
              expiry_date: "",
              certificate_link: "",
            },
          ],
          image: null,
        }
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isOnboardingComplete) {
      navigate(`/${user?.role}/dashboard`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        toast.error("Image must be less than 1MB.");
        return;
      }
      setFormData({ ...formData, image: file });
    } else if (!isSchool && name.startsWith("education")) {
      const [, index, field] = name.split(".");
      const updated = [...formData.education];
      updated[index][field] = value;
      setFormData({ ...formData, education: updated });
    } else if (!isSchool && name.startsWith("certifications")) {
      const [, index, field] = name.split(".");
      const updated = [...formData.certifications];
      updated[index][field] = type === "checkbox" ? checked : value;
      setFormData({ ...formData, certifications: updated });
    } else if (isSchool && name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSkillChange = (e) => {
    setFormData({ ...formData, skills: e.target.value.split(",") });
  };

  const addEducation = () =>
    setFormData({
      ...formData,
      education: [...formData.education, {
        college_name: "", university_name: "", course_name: "", start_year: "", end_year: "", gpa: ""
      }]
    });

  const addCertification = () =>
    setFormData({
      ...formData,
      certifications: [...formData.certifications, {
        name: "", issued_by: "", description: "", date_received: "", has_expiry: false, expiry_date: "", certificate_link: ""
      }]
    });

const handleSubmit = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return toast.error("User not found!");

  try {
    const profile = isSchool
      ? {
          bio: formData.bio?.trim(),
          website_link: formData.website_link?.trim(),
          address: {
            address: formData.address.address?.trim(),
            city: formData.address.city?.trim(),
            state: formData.address.state?.trim(),
            pincode: formData.address.pincode?.trim(),
          },
        }
      : {
          firstName: formData.firstName?.trim(),
          lastName: formData.lastName?.trim(),
          mobile: formData.mobile?.trim(),
          about: formData.about?.trim(),
          skills: formData.skills.filter(Boolean),
          education: formData.education.map((e) => ({
            college_name: e.college_name?.trim(),
            university_name: e.university_name?.trim(),
            course_name: e.course_name?.trim(),
            start_year: Number(e.start_year),
            end_year: Number(e.end_year),
            gpa: e.gpa?.trim(),
          })),
          certifications: formData.certifications.map((c) => ({
            name: c.name?.trim(),
            issued_by: c.issued_by?.trim(),
            description: c.description?.trim(),
            date_received: c.date_received,
            has_expiry: c.has_expiry,
            expiry_date: c.has_expiry ? c.expiry_date : null,
            ...(c.certificate_link?.trim() && {
              certificate_link: c.certificate_link?.trim(),
            }),
          })),
        };

    const payload = new FormData();
    payload.append("role", isSchool ? "school" : "student");
    payload.append("profileData", JSON.stringify(profile));
    if (formData.image) payload.append("image", formData.image);

    console.log("🚀 Final Payload:", profile); // DEBUG LOG

    const res = await authOnboarding(payload);

    if (res?.success) {
      toast.success("Onboarding completed!");
      localStorage.setItem("user", JSON.stringify({ ...user, isOnboardingComplete: true }));
      navigate(`/${user.role}/dashboard`);
    } else {
      toast.error(res?.message || "Failed to complete onboarding.");
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    toast.error("Failed to complete onboarding");
  }
};


  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        {isSchool ? "School Onboarding" : "Student Onboarding"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isSchool ? (
          <>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="website_link"
              value={formData.website_link}
              onChange={handleChange}
              placeholder="Website Link"
              className="w-full border p-2 rounded"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="address.address"
                value={formData.address.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
                required
              />
              <input
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="border p-2 rounded"
                required
              />
              <input
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="border p-2 rounded"
                required
              />
              <input
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="border p-2 rounded"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded"
                required
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border p-2 rounded"
                required
              />
            </div>

            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="About yourself"
              rows={3}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="skills"
              onChange={handleSkillChange}
              placeholder="Skills (comma-separated)"
              className="w-full border p-2 rounded"
            />

            <div>
              <h3 className="font-semibold">Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 my-2">
                  <input
                    name={`education.${index}.college_name`}
                    placeholder="College Name"
                    value={edu.college_name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name={`education.${index}.university_name`}
                    placeholder="University Name"
                    value={edu.university_name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name={`education.${index}.course_name`}
                    placeholder="Course"
                    value={edu.course_name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name={`education.${index}.gpa`}
                    placeholder="GPA"
                    value={edu.gpa}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name={`education.${index}.start_year`}
                    placeholder="Start Year"
                    value={edu.start_year}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name={`education.${index}.end_year`}
                    placeholder="End Year"
                    value={edu.end_year}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="text-blue-600 text-sm mt-1"
              >
                + Add Education
              </button>
            </div>

            <div>
              <h3 className="font-semibold">Certifications</h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="space-y-2 my-2">
                  <input
                    name={`certifications.${index}.name`}
                    placeholder="Certificate Name"
                    value={cert.name}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    name={`certifications.${index}.issued_by`}
                    placeholder="Issued By"
                    value={cert.issued_by}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    name={`certifications.${index}.description`}
                    placeholder="Description"
                    value={cert.description}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    name={`certifications.${index}.date_received`}
                    type="date"
                    value={cert.date_received}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  <label>
                    <input
                      type="checkbox"
                      name={`certifications.${index}.has_expiry`}
                      checked={cert.has_expiry}
                      onChange={handleChange}
                    />
                    Has Expiry
                  </label>
                  {cert.has_expiry && (
                    <input
                      name={`certifications.${index}.expiry_date`}
                      type="date"
                      value={cert.expiry_date}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                  )}
                  <input
                    name={`certifications.${index}.certificate_link`}
                    placeholder="Certificate Link"
                    value={cert.certificate_link}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addCertification}
                className="text-blue-600 text-sm"
              >
                + Add Certification
              </button>
            </div>
          </>
        )}

        <div>
          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
