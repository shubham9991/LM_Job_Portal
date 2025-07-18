import { createJob } from "@/api/school";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const JobPostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await createJob(data);
      if (res.success) {
        toast.success("Job Posted Successfully!");
        navigate("/school/dashboard");
      } else {
        toast.error("Error posting job.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
              {...register("jobTitle", { required: "Job title is required" })}
              placeholder="Enter job title"
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">School Name *</label>
            <input
              {...register("schoolName", {
                required: "School name is required",
              })}
              placeholder="Enter School / University Name"
              className="w-full border px-3 py-2 rounded mt-1"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Location *</label>
            <select
              {...register("location", { required: "Location is required" })}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select
              {...register("jobType")}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Job Type</option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Grade Level</label>
            <select
              {...register("gradeLevel")}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Select Grade Level</option>
              <option value="Primary">Primary</option>
              <option value="Middle">Middle</option>
              <option value="High School">High School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full border px-3 py-2 rounded mt-1"
            />
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
            <label className="block text-sm font-medium">
              Subjects to Teach
            </label>
            <input
              {...register("subjects")}
              placeholder="Select Subjects"
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Salary</label>
            <input
              type="number"
              {...register("minSalary", {
                min: { value: 0, message: "Minimum salary cannot be negative" },
              })}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Enter minimum salary"
            />
            {errors.minSalary && (
              <p className="text-red-500 text-sm">{errors.minSalary.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Maximum Salary</label>
            <input
              type="number"
              {...register("maxSalary", {
                min: { value: 0, message: "Maximum salary cannot be negative" },
              })}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Enter maximum salary"
            />
            {errors.maxSalary && (
              <p className="text-red-500 text-sm">{errors.maxSalary.message}</p>
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
            <label className="block text-sm font-medium">Job Description</label>
            <textarea
              {...register("jobDescription")}
              rows="3"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Describe the role"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">Requirements</label>
            <textarea
              {...register("requirements")}
              rows="2"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="List the essential requirements"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Preferred Qualifications
            </label>
            <textarea
              {...register("preferredQualifications")}
              rows="2"
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="List preferred qualifications"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="relative border border-gray-300 rounded-[0.63rem] p-4 pt-6 bg-white shadow">
        <h2 className="absolute -top-3 left-4 bg-white px-2 text-sm font-bold text-gray-700">
          Application Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Application Deadline
            </label>
            <input
              type="date"
              {...register("deadline")}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Email</label>
            <input
              type="email"
              {...register("contactEmail", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="hr@school.edu"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm">
                {errors.contactEmail.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-end">
        <button
          type="submit"
          className=" border-1 text-[#00B101] px-5 rounded mx-1 text-sm"
        >
          Create
        </button>
        <button
          type="button"
          className=" border-1 text-[#A30000] px-5 rounded text-sm"
          onClick={() => reset()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
