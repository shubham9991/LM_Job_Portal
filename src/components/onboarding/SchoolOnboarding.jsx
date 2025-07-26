import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authOnboarding } from "@/api/auth"; // adjust this path if needed

const SchoolOnboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: "",
    website_link: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    image: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "school") {
      toast.error("Unauthorized access to school onboarding!");
      navigate("/login");
    } else if (user.isOnboardingComplete) {
      navigate("/school/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        toast.error("Logo must be less than 1MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return toast.error("User not found!");

const profile = {
  bio: formData.bio?.trim(),
  website_link: formData.website_link?.trim(),
  address: {
    address: formData.address?.trim(),
    city: formData.city?.trim(),
    state: formData.state?.trim(),
    pincode: String(formData.pincode?.trim()),
  },
};


    const payload = new FormData();
    payload.append("role", "school");
    payload.append("profileData", JSON.stringify(profile));
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const res = await authOnboarding(payload);
      if (res?.success) {
        toast.success("Onboarding completed successfully!");
        localStorage.setItem("user", JSON.stringify({ ...user, isOnboardingComplete: true }));
        navigate("/school/dashboard");
      } else {
        toast.error(res?.message || "Failed to complete onboarding.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border shadow rounded bg-white">
      <h2 className="text-2xl font-bold mb-6">School Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="School Bio"
          className="w-full border p-2 rounded"
          rows={3}
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

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
            required
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="border p-2 rounded"
            required
          />
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload School Logo (≤ 1MB)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SchoolOnboarding;
