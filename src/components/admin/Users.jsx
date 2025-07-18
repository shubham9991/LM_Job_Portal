import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/constants";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkRole, setBulkRole] = useState("student");
  const [viewMode, setViewMode] = useState("individual");

  const fetchUsers = async () => {
    try {
      const res = await apiClient("/admin/users", {}, true);
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
      console.error("User creation error:", err);
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
    } else {
      toast.error(message || "Bulk upload failed");
    }
  } catch (err) {
    console.error("Bulk upload error:", err);
    toast.error("🚨 Bulk upload failed: " + err.message);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${viewMode === "individual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("individual")}
        >
          Individual User
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === "bulk" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("bulk")}
        >
          Bulk Upload
        </button>
      </div>

      {viewMode === "individual" ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Create New User</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              className="border px-2 py-1 rounded"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="border px-2 py-1 rounded"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              className="border px-2 py-1 rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="school">School</option>
            </select>
          </div>
          <button
            className="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
            onClick={createUser}
          >
            Create User
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleBulkUpload}
          className="bg-white p-4 rounded shadow space-y-4"
        >
          <h2 className="text-lg font-semibold mb-2">Bulk Upload Users (.xlsx)</h2>
          <div className="flex flex-col space-y-2">
<input
  type="file"
  id="bulkFileInput"
  accept=".xlsx"
/>

            <select
              value={bulkRole}
              onChange={(e) => setBulkRole(e.target.value)}
              className="border px-3 py-2 rounded-md"
            >
              <option value="student">Student</option>
              <option value="school">School</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">All Users</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-1">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={i}
                className={
                  u.role === "student"
                    ? "bg-blue-50"
                    : u.role === "school"
                    ? "bg-red-50"
                    : ""
                }
              >
                <td className="py-2 px-3">{u.name}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
