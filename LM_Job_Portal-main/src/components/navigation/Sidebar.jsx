import { useState } from "react";
import {
  FaPowerOff,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaUser,
  FaThLarge,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../../assets/SidebarMenu/logo.svg";
import { Mail, HelpCircle } from "lucide-react";
import HelpRequestModal from "../help/HelpRequestModal";
import useLogout from "@/hooks/useLogout";

const Sidebar = ({ mobile = false, className = "" }) => {
  const [hovered, setHovered] = useState(mobile);
  const logout = useLogout();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const menuConfig = {
    admin: [
      { label: "Dashboard", icon: <FaThLarge />, link: "/admin/dashboard" },
      { label: "Users", icon: <FaUser />, link: "/admin/users" },
      { label: "Skills", icon: <FaGraduationCap />, link: "/admin/skills" },
      { label: "Categories", icon: <FaBriefcase />, link: "/admin/categories" },
      { label: "Upload Skill Marks", icon: <FaGraduationCap />, link: "/admin/skill-marks" },
      { label: "Help Tickets", icon: <HelpCircle />, link: "/admin/help-tickets" },
    ],
    school: [
      { label: "Dashboard", icon: <FaThLarge />, link: "/school/dashboard" },
      // { label: "Job Opportunities", icon: <FaBriefcase />, link: "/school/jobs" },
      // { label: "Skills & Qualifications", icon: <FaGraduationCap />, link: "/school/skills" },
      // { label: "Schedule", icon: <FaCalendarAlt />, link: "/school/schedule" },
      // { label: "My Portfolio", icon: <FaUser />, link: "/school/portfolio" },
      { label: "Job Posting", icon: <Mail />, link: "/school/job-posting" },
      { label: "My Profile", icon: <FaUser />, link: "/school/profile" },
      { label: "Levelmind Support", icon: <HelpCircle />, modal: true },

    ],
    student: [
      { label: "Dashboard", icon: <FaThLarge />, link: "/student/dashboard" },
      { label: "Skills", icon: <FaGraduationCap />, link: "/student/skills" },
      { label: "Levelmind Support", icon: <HelpCircle />, modal: true },
    ],
  };

  const navItems = menuConfig[role] || [];

  return (
    <div
      className={`h-screen bg-gradient-to-b from-white to-gray-100 border-r shadow-md flex flex-col justify-between transition-all duration-300 ${
        hovered ? "w-64" : "w-20"
      } ${className}`}
      {...(!mobile && {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      })}
    >
      {/* Top Logo Section */}
      <div>
        <div
          className={`flex items-center ${
            hovered ? "justify-start gap-2 px-4" : "justify-center"
          } py-4`}
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          {hovered && (
            <span className="text-lg font-bold text-gray-800 tracking-wide">
              LevelMinds
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <ul className="mt-6 space-y-1 px-2">
          {navItems.map((item, idx) => (
            <li key={idx}>
              {item.modal ? (
                <HelpRequestModal>
                  <div
                    className={`flex items-center transition-all rounded-md px-3 py-3 cursor-pointer ${
                      hovered ? "justify-start gap-4" : "justify-center"
                    } text-gray-700 hover:bg-blue-100`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {hovered && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                </HelpRequestModal>
              ) : (
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `flex items-center transition-all rounded-md px-3 py-3 ${
                      isActive
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-700 hover:bg-blue-100"
                    } ${hovered ? "justify-start gap-4" : "justify-center"}`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {hovered && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <div
          onClick={logout}
          className={`flex items-center rounded-md px-3 py-3 cursor-pointer transition group ${
            hovered
              ? "justify-start gap-4 text-gray-700 hover:bg-red-100 hover:text-red-600"
              : "justify-center text-gray-700 hover:text-red-600"
          }`}
        >
          <FaPowerOff className="text-xl" />
          {hovered && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
