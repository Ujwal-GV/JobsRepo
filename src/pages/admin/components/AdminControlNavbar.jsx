import React, { useState, useEffect } from "react";
import { FaHome, FaUser, FaAd, FaCogs, FaAppStore, FaPowerOff, FaUserCog, FaChartBar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "antd";
import { useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

const AdminControlNavbar = () => {
  const queryClient = useQueryClient();

  const menuItems = [
    { title: "Dashboard", nav: "/admin", icon: <FaHome />, label: "dashboard" },
    { title: "User Management", nav: "/admin/user-management", icon: <FaUser />, label: "userManagement" },
    { title: "Statistics", nav: "/admin/statistics", icon: <FaChartBar />, label: "statistics" },
    { title: "User Verification Control", nav: "/admin/user-control", icon: <FaUserCog />, label: "userControl" },
    { title: "Ads Management", nav: "/admin/ads-management", icon: <FaAd />, label: "adsManagement" },
    { title: "Application Management", nav: "/admin/app-management", icon: <FaAppStore />, label: "appManagement" },
    { title: "Settings", nav: "/admin/settings", icon: <FaCogs />, label: "settings" },
  ];

  const [selectedMenu, setSelectedMenu] = useState(
    sessionStorage.getItem("location") || "dashboard"
  );
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find((item) => item.nav === currentPath);
    if (currentMenuItem) {
      setSelectedMenu(currentMenuItem.label);
    }
  }, [location.pathname]);

  const handleNavigate = (nav, label) => {
    sessionStorage.setItem("location", label);
    setSelectedMenu(label);
    setIsCollapsed(true);
    navigate(nav);
  };

  return (
    <div className="flex min-h-screen ">
      <div
        className={`bg-gray-800   text-white font-outfit flex flex-col min-w-[3rem] ${
          isCollapsed ? "w-[4rem]" : "w-[16rem]"
        } z-10 absolute left-0 top-0 h-screen transition-all duration-500 ease-in-out`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >

        <div className="flex items-center justify-center h-16">
          <img
            src="/EmploezLogo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <nav className="flex-1">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleNavigate(item.nav, item.label)}
              className={`cursor-pointer flex items-center gap-4 p-4 hover:bg-gray-700 transition-all duration-300 ${
                selectedMenu === item.label ? "bg-gray-700" : ""
              }`}
            >
              <span className="text-sm lg:text-xl ml-2 lg:ml-0">{item.icon}</span>
              <span
                className={`text-md overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </nav>
        {authToken && (
          <div
            onClick={() => {
              setLogoutModalOpen(true);
            }}
            className="cursor-pointer flex items-center gap-4 p-4 hover:bg-gray-700 transition-all duration-300"
          >
            <span className="text-xl">
              <FaPowerOff />
            </span>
            <span
              className={`text-md overflow-hidden whitespace-nowrap transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              Logout
            </span>
          </div>
        )}
      </div>
      <Modal
        title="Confirm Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={
          <div className="flex justify-end items-start gap-2">
            <button
              className="border border-black rounded-lg px-2 py-1"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="border bg-gray-800 text-white rounded-lg px-2 py-1"
              onClick={() => {
                queryClient.clear();
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("location");
                toast.success("Logout Successfull!");
                navigate("/admin/login");
              }}
            >
              OK
            </button>
          </div>
        }
      >
        Are you sure you want to logout?
      </Modal>
    </div>
  );
};

export default AdminControlNavbar;
