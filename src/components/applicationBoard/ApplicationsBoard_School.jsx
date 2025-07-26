import { jobApplicants } from "@/api/school";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import icon from "../../assets/image1.png";

const statusOrder = ["New Candidates", "In Progress", "Completed"];
const statusColors = {
  "New Candidates": "border-l-gray-400",
  "In Progress": "border-l-orange-400",
  Completed: "border-l-green-400",
  // "On Hold": "border-l-red-400",
};

const ApplicationsBoard = () => {
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const getApplicants = async () => {
    try {
      const response = await jobApplicants(jobId);
      setApplications(response?.data?.tabs?.all || []);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    }
  };

  useEffect(() => {
    if (jobId) {
      getApplicants();
    }
  }, [jobId]);

  const groupedApplications = statusOrder.map((status) => ({
    status,
    items: applications.filter((app) => app.status === status),
  }));

  return (
    <div className="p-6 bg-white">
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Applications</h2>
        <select className="border rounded px-3 py-1 text-sm">
          <option>Select Category</option>
        </select>
      </div> */}
      
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 overflow-x-auto">
        {groupedApplications.map((group, index) => (
          <div key={index} className="bg-gray-50 rounded border p-2">
            <h3 className="text-center font-medium text-gray-700 mb-2 border-b pb-2">
              {group.status}
            </h3>
            <div className="space-y-4">
              {group.items.map((app) => (
                <div
                  key={app.id}
                  className={`bg-white border rounded shadow-sm p-4 space-y-2 border-l-4 ${
                    statusColors[app.status]
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.avatar ? app.avatar : icon}
                      alt={app.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{app.name}</h4>
                      <p className="text-xs text-gray-500">{app.date}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Email Id</p>
                    <p className="text-sm text-gray-700">{app.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium">Contact Number</p>
                    <p className="text-sm text-gray-700">{app.phone}</p>
                  </div>

                  {/* <a
                    href={app.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-sm border border-blue-500 text-blue-500 rounded py-1 hover:bg-blue-50 transition"
                  >
                    View LinkedIn
                  </a> */}

                  <div className="flex justify-end">
                    <Link
                      to={`/school/applicantDetails/${app?.applicantUserId}`}
                      state={{ id: app?.id, status: app?.status }}
                      className="text-sm bg-gray-100 rounded p-2 hover:bg-gray-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsBoard;
