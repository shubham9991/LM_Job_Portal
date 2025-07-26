import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold text-blue-600">{value || 0}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
const fetchDashboard = async () => {
  try {
    const res = await apiClient("/admin/dashboard", {}, true);

    // ✅ Extract only required parts
    const metrics = res?.data?.metrics || {};
    const recent = res?.data?.recentActivity || [];

    setDashboard({ metrics, recentActivity: recent });
  } catch {
    toast.error("Failed to fetch dashboard");
  }
};


    fetchDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<Stat label="Total Users" value={dashboard.metrics?.totalUsers} />
<Stat label="Total Schools" value={dashboard.metrics?.totalSchools} />
<Stat label="Total Students" value={dashboard.metrics?.totalStudents} />
<Stat label="Active Jobs" value={dashboard.metrics?.activeJobs} />
<Stat label="Pending Help Requests" value={dashboard.metrics?.pendingHelpRequests} />

      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
<ul className="text-sm text-gray-700 list-disc ml-6">
  {(dashboard.recentActivity || []).map((a, i) => (
    <li key={i}>
      <a href={a.link} className="text-blue-600 hover:underline">
        {a.text}
      </a>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}
