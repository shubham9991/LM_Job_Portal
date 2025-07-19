import { createJob, fetchCategories } from "@/api/school";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { jobSchema } from "@/schema/JobSchema";
import Select from "react-select";
import CreatableMultiSelect from "../select/SubjectSelect";
const JobPostForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(jobSchema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects],
    };
    try {
      const res = await createJob(formattedData);
      if (res.success) {
        toast.success("Job Posted Successfully!");
        navigate("/school/dashboard");
      } else {
        toast.error("Error posting job.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    try {
      const res = await fetchCategories();
      const options = res?.data?.categories?.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));
      setCategories(options);
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const subjectOptions = [
    { value: "Math", label: "Math" },
    { value: "Physics", label: "Physics" },
    { value: "English", label: "English" },
    { value: "Chemistry", label: "Chemistry" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w mx-auto p-6 space-y-6 bg-gray-50"
    >
      {/* Basic Information */}
      <div className="relative border border-gray-300 rounded-[0.63rem] p-4 pt-6 bg-white shadow">
        <h2 className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-gray-700">
          Basic Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Job Title *</label>
            <input
              {...register("title")}
              placeholder="Enter job title"
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Job Type *</label>
            <select
              {...register("type")}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Job Type</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Application End Date *
            </label>
            <input
              type="date"
              {...register("application_end_date")}
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.application_end_date && (
              <p className="text-red-500 text-sm">
                {errors.application_end_date.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subjects & Compensation */}
      <div className="relative border border-gray-300 rounded-[0.63rem] p-4 pt-6 bg-white shadow">
        <h2 className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-gray-700">
          Subjects & Compensation
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <CreatableMultiSelect
              label="Subjects *"
              name="subjects"
              options={subjectOptions}
              value={watch("subjects")}
              onChange={(name, value) =>
                setValue(name, value, { shouldValidate: true })
              }
              error={errors.subjects?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Min Salary (LPA) *
            </label>
            <input
              type="number"
              {...register("salary_min")}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="e.g., 3"
            />
            {errors.salary_min && (
              <p className="text-red-500 text-sm">
                {errors.salary_min.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Max Salary(LPA)</label>
            <input
              type="number"
              {...register("salary_max")}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="e.g., 7"
            />
            {errors.salary_max && (
              <p className="text-red-500 text-sm">
                {errors.salary_max.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="relative border border-gray-300 rounded-[0.63rem] p-4 pt-6 bg-white shadow">
        <h2 className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-gray-700">
          Job Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              {...register("description")}
              rows="3"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Describe the job"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Requirements *</label>
            <textarea
              {...register("requirements")}
              rows="2"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Enter key requirements"
            ></textarea>
            {errors.requirements && (
              <p className="text-red-500 text-sm">
                {errors.requirements.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Responsibilities *
            </label>
            <textarea
              {...register("responsibilities")}
              rows="2"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Enter main responsibilities"
            ></textarea>
            {errors.responsibilities && (
              <p className="text-red-500 text-sm">
                {errors.responsibilities.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-end">
        <button
          type="submit"
          className="border border-green-600 text-green-700 px-5 py-1 rounded mx-1 text-sm hover:bg-green-50"
        >
          Create
        </button>
        <button
          type="button"
          className="border border-red-600 text-red-700 px-5 py-1 rounded text-sm hover:bg-red-50"
          onClick={() => reset()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
