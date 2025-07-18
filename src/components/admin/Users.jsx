import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });
  const [bulkRole, setBulkRole] = useState("student");
  const [viewMode, setViewMode] = useState("individual");

  const fetchUsers = async () => {
    try {
      const res = await apiClient("/admin/users?limit=1000&offset=0", {}, true);
      setUsers(res?.data?.users || []);
    } catch {
      toast.error("Error loading users");
    }
  };

  const createUser = async () => {
    const { name, email, role } = newUser;

    let endpoint = "";
    if (role === "student") endpoint = "/auth/register/student";
    else if (role === "school") endpoint = "/auth/register/school";
    else {
      toast.error("Only student or school registration is supported.");
      return;
    }

    try {
      await apiClient(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify({ name, email }),
        },
        true
      );

      toast.success(`${role === "student" ? "Student" : "School"} created successfully!`);
      setNewUser({ name: "", email: "", role: "student" });
      fetchUsers();
    } catch (err) {
      toast.error("Failed to create user: " + err.message);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("bulkFileInput");
    const selectedFile = fileInput?.files?.[0];

    if (!selectedFile) {
      toast.error("❌ No file selected");
      return;
    }

    if (!bulkRole) {
      toast.error("❌ Please select a role");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("role", bulkRole);

    try {
      const response = await apiClient("/admin/users/bulk-create", {
        method: "POST",
        body: formData,
        isFormData: true,
      });

      const { success, message, data } = response;

      if (success) {
        const uploaded = data.uploaded_count || 0;
        const failed = data.failed_count || 0;
        toast.success(`✅ Uploaded: ${uploaded}, ❌ Failed: ${failed}`);
        fetchUsers();
      } else {
        toast.error(message || "Bulk upload failed");
      }
    } catch (err) {
      toast.error("🚨 Bulk upload failed: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">User Management</h1>

      {/* Mode Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-5 py-2 rounded font-medium shadow-sm ${
            viewMode === "individual"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewMode("individual")}
        >
          Create Individual
        </button>
        <button
          className={`px-5 py-2 rounded font-medium shadow-sm ${
            viewMode === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => setViewMode("bulk")}
        >
          Bulk Upload
        </button>
      </div>

      {/* Individual User Form */}
      {viewMode === "individual" ? (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Add New User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="school">School</option>
            </select>
          </div>
          <button
            onClick={createUser}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
          >
            Create User
          </button>
        </div>
      ) : (
        // Bulk Upload Form
        <form
          onSubmit={handleBulkUpload}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bulk Upload (.xlsx)</h2>
          <input
            type="file"
            id="bulkFileInput"
            accept=".xlsx"
            className="border border-gray-300 px-3 py-2 rounded"
          />
          <select
            value={bulkRole}
            onChange={(e) => setBulkRole(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="student">Student</option>
            <option value="school">School</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
          >
            Upload Users
          </button>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">All Users ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Email</th>
                <th className="px-4 py-2 text-left text-gray-700 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === "student"
                          ? "bg-blue-100 text-blue-800"
                          : u.role === "school"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
