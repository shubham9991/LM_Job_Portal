import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/apiClient";
import { Bell, Menu } from "lucide-react";
const SearchBar = ({ onMenuClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient("/notifications?status=unread", {}, true);
        setNotifications(res?.data?.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showDropdown]);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition"
          title="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-96 max-h-96 bg-white shadow-lg border border-gray-200 rounded-md z-50">
            <div className="p-4 border-b text-sm font-medium text-gray-700">
              Notifications
            </div>

            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No new notifications</p>
            ) : (
              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => {
                      setShowDropdown(false);
                      navigate(n.link);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-800">{n.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.timestamp).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default SearchBar;
