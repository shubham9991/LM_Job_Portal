import React, { useEffect, useState } from "react";
import { fetchSchoolProfile } from "@/api/school";
import { toast } from "react-toastify";

const SchoolProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchSchoolProfile();
        if (res.success) {
          setProfile(res.data.profile);
        } else {
          toast.error(res.message || "Failed to load profile");
        }
      } catch {
        toast.error("An error occurred while fetching profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading...</div>
    );
  if (!profile)
    return (
      <div className="text-center mt-10 text-red-500">Profile not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow border border-green-700">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <img
          src={profile.logoUrl}
          alt="School Logo"
          className="w-28 h-28 rounded-full border-4 border-green-600 object-cover"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{profile.email}</h2>
          <p className="text-sm text-gray-500">School Profile Overview</p>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
        <div className="space-y-2">
          <h4 className="text-gray-600 font-semibold">Bio</h4>
          <p className="text-gray-800">{profile.bio}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-gray-600 font-semibold">Website</h4>
          <a
            href={profile.websiteLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {profile.websiteLink}
          </a>
        </div>

        <div className="md:col-span-2 space-y-2">
          <h4 className="text-gray-600 font-semibold">Address</h4>
          <p className="text-gray-800">
            {profile.address}, {profile.city}, {profile.state} -{" "}
            {profile.pincode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;
