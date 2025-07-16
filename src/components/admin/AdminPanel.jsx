import React, { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

const TABS = ["Dashboard", "Users", "Skills", "Categories"];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // STATE
  const [dashboard, setDashboard] = useState({});
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newSkill, setNewSkill] = useState({ name: "", subskills: "" });
  const [newCategory, setNewCategory] = useState({ name: "", skills: [] });
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });

  // FETCH DATA
  useEffect(() => {
    if (activeTab === "Dashboard") fetchDashboard();
    if (activeTab === "Users") fetchUsers();
    if (activeTab === "Skills") fetchSkills();
    if (activeTab === "Categories") fetchCategories();
  }, [activeTab]);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient("/admin/dashboard", {}, true);
      setDashboard(res);
    } catch (err) {
      toast.error("Failed to fetch dashboard");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient("/admin/users", {}, true);
      setUsers(res?.users || []);
    } catch {
      toast.error("Error loading users");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await apiClient("/admin/skills", {}, true);
      setSkills(res);
    } catch {
      toast.error("Error loading skills");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient("/admin/categories", {}, true);
      setCategories(res);
    } catch {
      toast.error("Error loading categories");
    }
  };

  // HANDLERS
  const createSkill = async () => {
    const payload = {
      name: newSkill.name,
      subskills: newSkill.subskills.split(",").map(s => s.trim()),
    };
    try {
      await apiClient("/admin/skills", {
        method: "POST",
        body: JSON.stringify(payload),
      }, true);
      toast.success("Skill created!");
      setNewSkill({ name: "", subskills: "" });
      fetchSkills();
    } catch {
      toast.error("Failed to create skill");
    }
  };

  const createCategory = async () => {
    try {
      await apiClient("/admin/categories", {
        method: "POST",
        body: JSON.stringify(newCategory),
      }, true);
      toast.success("Category created!");
      setNewCategory({ name: "", skills: [] });
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const createUser = async () => {
    try {
      await apiClient("/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      }, true);
      toast.success("User created!");
      setNewUser({ name: "", email: "", role: "student" });
      fetchUsers();
    } catch {
      toast.error("Failed to create user");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === "Dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Total Users" value={dashboard.totalUsers} />
            <Stat label="Total Schools" value={dashboard.totalSchools} />
            <Stat label="Total Students" value={dashboard.totalStudents} />
            <Stat label="Pending Help Requests" value={dashboard.pendingHelpRequests} />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
            <ul className="text-sm text-gray-700 list-disc ml-6">
              {(dashboard.recentActivity || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="space-y-6">
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
                <option value="admin">Admin</option>
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
                  <tr key={i}>
                    <td className="py-1">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Skills" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Core Skill</h2>
            <input
              className="border w-full mb-2 px-2 py-1 rounded"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <input
              className="border w-full mb-2 px-2 py-1 rounded"
              placeholder="Comma-separated subskills"
              value={newSkill.subskills}
              onChange={(e) => setNewSkill({ ...newSkill, subskills: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={createSkill}
            >
              Create Skill
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Core Skills</h2>
            <ul className="list-disc ml-6">
              {skills.map((s, i) => (
                <li key={i}>
                  <strong>{s.name}</strong>: {s.subskills.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Categories" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create Category</h2>
            <input
              className="border w-full mb-2 px-2 py-1 rounded"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={createCategory}
            >
              Create Category
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Job Categories</h2>
            <ul className="list-disc ml-6">
              {categories.map((cat, i) => (
                <li key={i}>
                  <strong>{cat.name}</strong> {cat.skills?.length > 0 && `— linked to ${cat.skills.length} skills`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Stat Component
const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-2xl font-bold text-blue-600">{value || 0}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);
