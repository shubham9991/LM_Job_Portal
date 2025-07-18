import { useNavigate } from "react-router";
import cardicon from "../../assets/card-icon.png";
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const viewJobDetails = () => {
    navigate(`/school/job-applicants/${job?.id}`);
  };
  return (
    <div className="flex gap-4 p-5 border rounded-xl shadow-sm bg-white max-w-3xl">
      <div className="w-14 h-14 flex-shrink-0">
        <img
          // src={job?.logo || cardicon}
          src={cardicon}
          alt="Logo"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-gray-500">
            {job?.school || "Unknown School"}
          </p>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {job?.title || "Job Title"}
            </h2>
            <span className="text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded-full">
              {job?.status || "Active"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            📍 {job?.location || "Location"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            ⏱ {job?.jobType || "Type"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            ₹ {job?.salary || "0"} LPA
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            📅 {job?.postedAgo || "Just now"}
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-snug mt-1">
          {job?.description || "Job description not available."}
        </p>

        <div className="mt-2">
          <button
            className="text-sm px-4 py-1 border border-gray-300 rounded-md transition cursor-pointer float-right bg-black text-white"
            onClick={viewJobDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
