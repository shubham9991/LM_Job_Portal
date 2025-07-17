import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });

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




  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

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
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-1 rounded"
          onClick={createUser}
        >
          Create User
        </button>
      </div>

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
