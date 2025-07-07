import { useState } from "react";
import {
  FaPowerOff,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaUser,
  FaThLarge,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", icon: <FaThLarge /> },
  { label: "Job Opportunities", icon: <FaBriefcase /> },
  { label: "Skills & Qualifications", icon: <FaGraduationCap /> },
  { label: "Schedule", icon: <FaCalendarAlt /> },
  { label: "My Portfolio", icon: <FaUser /> },
];

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r shadow-sm flex flex-col justify-between transition-all duration-300 ${
        hovered ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Logo Section */}
      <div>
        <div className="flex items-center gap-2 p-4">
          <img
            src="src\assets\Sidebar Menu\image 1.svg"
            alt="Logo"
            className="w-8 h-8"
          />
          {hovered && (
            <span className="text-lg font-semibold text-gray-800">LevelMinds</span>
          )}
        </div>

        {/* Nav Items */}
          <ul className="mt-4 space-y-2">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 hover:bg-gray-100 text-gray-700 p-3 cursor-pointer transition rounded-md"
              >
                <span className="text-xl">{item.icon}</span>
                {hovered && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </li>
            ))}
          </ul>

      </div>

      {/* Logout Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
          <FaPowerOff className="text-xl" />
          {hovered && <span className="text-sm">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
