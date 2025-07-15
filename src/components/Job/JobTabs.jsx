import { useState } from "react";

const JobTabs = () => {
  const [activeTab, setActiveTab] = useState("Open");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center border-b pb-2">
        {/* Tabs */}
        <div className="flex space-x-6">
          {["Open", "Closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-400"
              } pb-1`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Side Button */}
        <button className="px-4 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-md hover:bg-green-50">
          Create Job Post
        </button>
      </div>

      {/* Dropdown */}
      <div className="flex items-center space-x-4">
        <label className="font-semibold text-sm">Select Category</label>
        <select className="border px-3 py-2 rounded-md text-sm text-gray-600 w-60 focus:outline-none">
          <option value="">Select Category</option>
          <option value="tech">Technology</option>
          <option value="hr">Human Resources</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      {/* TAB CONTENT BELOW */}
      <div className="mt-4">
        {activeTab === "Open" ? (
          <div className="text-sm text-gray-700">
            <p>Showing all <strong>Open</strong> job posts...</p>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            <p>Showing all <strong>Closed</strong> job posts...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTabs;
