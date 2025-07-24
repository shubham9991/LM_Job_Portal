import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    skills: [],
  });

  const fetchCategories = async () => {
    try {
      const res = await apiClient("/admin/categories", {}, true);
      setCategories(res?.data?.categories || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await apiClient("/admin/skills", {}, true);
      setSkillsList(res?.data?.skills || []);
    } catch {
      toast.error("Failed to load core skills");
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      const payload = {
        name: newCategory.name,
        skills: newCategory.skills,
      };

      await apiClient(
        "/admin/categories",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );

      toast.success("Category created!");
      setNewCategory({ name: "", skills: [] });
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Job Category Management</h1>

      {/* Create Category Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Create Category</h2>

        <input
          className="border w-full mb-2 px-2 py-1 rounded"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />

        <select
          multiple
          className="border w-full mb-2 px-2 py-1 rounded h-40"
          value={newCategory.skills}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (opt) => opt.value
            );
            setNewCategory({ ...newCategory, skills: selectedOptions });
          }}
        >
          {skillsList.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={createCategory}
        >
          Create Category
        </button>
      </div>

      {/* List All Categories */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">All Categories</h2>
        <ul className="list-disc ml-6 space-y-2">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat, i) => (
              <li key={i}>
                <strong>{cat.name}</strong>{" "}
                {cat.skills?.length > 0 &&
                  `— linked to: ${cat.skills
                    .map((s) => s.name)
                    .join(", ")}`}
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No categories found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
