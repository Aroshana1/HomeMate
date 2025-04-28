import React, { useState } from "react";
import { useDashboardContext } from "../pages/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FiBell, FiUser } from "react-icons/fi"; // Icons from react-icons
import logo from "../assets/logo.png";

const NavBar = () => {
  const { toggleSidebar, user, notifications } = useDashboardContext();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);

  const logoutUser = () => {
    navigate("/");
  };

  return (
    <div className="flex w-full justify-between items-center p-4">
      {/* Left Section */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-green-500 md:hidden p-2"
        >
          ☰
        </button>
        <img src={logo} alt="HomeMate" className="w-48 ml-2" />
        <span className="ml-4 text-white text-xl font-semibold">MyHome</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 relative">
        {/* Notification Button */}
        <div className="relative">
          <button
            onClick={() =>
              setShowNotificationsDropdown(!showNotificationsDropdown)
            }
            className="text-green-500 p-2 relative"
          >
            <FiBell size={24} />
            {notifications?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3">
              <p className="text-gray-700 font-semibold">Notifications</p>
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <li key={index} className="py-1 text-gray-600 border-b">
                      {notif.message}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No new notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center text-white"
          >
            <img
              src={
                user?.profileImage ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
              }
              alt="User"
              className="w-10 h-10 rounded-full border border-green-500"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-3">
              <p className="text-gray-700 font-semibold">
                {user?.name || "User"}
              </p>
              <button
                onClick={() => navigate("/settings")}
                className="block w-full text-left text- py-1 mt-2 hover:bg-green-200 px-2 rounded"
              >
                Settings
              </button>
              <button
                onClick={logoutUser}
                className="block w-full text-left text-gray-600 py-1 mt-2 hover:bg-green-200 px-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
