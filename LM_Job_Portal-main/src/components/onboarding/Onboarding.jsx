import { authOnboarding } from "@/api/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Onboarding = () => {
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
    if (user?.isOnboardingComplete) {
      navigate(`${user?.role}/dashboard`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("User not found in localStorage!");
      return;
    }

    if (!/^https?:\/\/.+/.test(formData.website_link)) {
      toast.error("Please enter a valid website link");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    try {
      const profile = {
        bio: formData.bio,
        website_link: formData.website_link,
        address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };
      const form = new FormData();
      form.append("profileData", JSON.stringify(profile));
      if (formData.image) {
        form.append("image", formData.image);
      }

      const res = await authOnboarding(form);
      console.log("Onboarding success:", res);
      const updatedUser = { ...user, isOnboardingComplete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Onboarding completed!");
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete onboarding");
    }
  };


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">School Onboarding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Website</label>
          <input
            name="website_link"
            value={formData.website_link}
            onChange={handleChange}
            type="url"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            type="text"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="text"
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              type="text"
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            type="text"
            pattern="\d{6}"
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Image</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
