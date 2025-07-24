import { useNavigate } from "react-router";
import cardicon from "../../assets/card-icon.png";

const JobCard = ({ job, link }) => {
  const navigate = useNavigate();
  const viewJobDetails = () => {
    if (link) {
      navigate(link);
    } else {
      navigate(`/school/job-applicants/${job?.id}`);
    }
  };
  const getShortDescription = (desc) => {
    if (!desc) return "Job description not available.";
    const words = desc.trim().split(" ");
    return words.length > 12 ? words.slice(0, 12).join(" ") + "..." : desc;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 border rounded-xl shadow-sm bg-white max-w-3xl w-full min-h-[250px] overflow-hidden">
      {/* Logo */}
      <div className="w-14 h-14 flex-shrink-0">
        <img
          src={job?.logo || cardicon}
          alt="Logo"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow gap-2 overflow-hidden">
        {/* Top Section */}
        <div>
          <p
            className="text-sm text-gray-500 truncate"
            title={job?.school}
          >
            {job?.school || "Unknown School"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="text-lg font-semibold text-gray-900 truncate max-w-[220px]"
              title={job?.title}
            >
              {job?.title || "Job Title"}
            </h2>
            <span
              className={`text-xs text-green-800 ${
                job?.status === "Active" ? "bg-green-100" : "bg-gray-200"
              } px-2 py-0.5 rounded-full`}
            >
              {job?.status || "Active"}
            </span>
          </div>
        </div>

        {/* Info Tags */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span
            className="flex items-center gap-1 truncate max-w-[120px]"
            title={job?.location}
          >
            📍 {job?.location || "Location"}
          </span>
          <span
            className="flex items-center gap-1 truncate max-w-[90px]"
            title={job?.jobType}
          >
            ⏱ {job?.jobType || "Type"}
          </span>
          <span className="flex items-center gap-1">
            ₹ {job?.salary || "0"}
          </span>
          <span className="flex items-center gap-1">
            📅 {job?.postedAgo || "Just now"}
          </span>
        </div>

        {/* Description with tooltip */}
        <p
          className="text-sm text-gray-700 mt-1 truncate overflow-hidden whitespace-nowrap"
          title={job?.description}
        >
          {getShortDescription(job?.description)}
        </p>

        {/* Button */}
        <div className="mt-2">
          <button
            onClick={viewJobDetails}
            className="text-sm px-4 py-1 border border-gray-300 rounded-md bg-black text-white ml-auto block cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
