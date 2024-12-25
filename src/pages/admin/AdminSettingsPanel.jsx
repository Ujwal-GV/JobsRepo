import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { axiosInstance } from "../../utils/axiosInstance";
import { IoHourglass } from "react-icons/io5";

export default function AdminSettingsPanel() {
  const [adminData, setAdminData] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [tokenThreshold, setTokenThreshold] = useState(100);
  const [notificationRules, setNotificationRules] = useState("");

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const resetSettings = () => {
    setTheme("dark");
    setNotifications({ email: true, sms: false });
    setTokenThreshold(100);
    setNotificationRules("");
    alert("Settings reset to default!");
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  const fetchAdminDetails = async () => {
    try {
      const res = await axiosInstance.get("/admin/get-admin");
      const { admin_name, email, lastActive } = res.data || {};
      setAdminData([
        { label: "Name", type: "text", name: "name", value: admin_name || "" },
        { label: "Email", type: "email", name: "email", value: email || "" },
        { label: "Last Active", type: "text", name: "lastActive", value: new Date(lastActive).toLocaleString() },
      ]);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const {
    isLoading: adminDataLoading,
    isFetching: adminDataFetching,
  } = useQuery({
    queryKey: ["admin-details"],
    queryFn: fetchAdminDetails,
    staleTime: 0,
    cacheTime: 0,
  });

  const getBackgroundClass = () => (theme === "light" ? "bg-gray-100 text-black" : "bg-gray-900 text-white");
  const getCardClass = () => (theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white");
  const getInputBg = () => (theme === "light" ? "bg-gray-300" : "bg-gray-200 text-black");
  const getButtonClass = (enabled) =>
    enabled
      ? "bg-green-500 text-white hover:bg-green-700"
      : theme === "light"
      ? "bg-gray-300 text-black hover:bg-gray-100"
      : "bg-gray-900 text-white hover:bg-gray-200 hover:text-black";

  const getSaveButtonClass = () =>
      (theme === "dark"
      ? "bg-gray-300 text-black hover:bg-gray-500 hover:text-white"
      : "bg-gray-900 text-white hover:bg-gray-600 hover:text-white");

  return (
    <div className={`${getBackgroundClass()} min-h-screen`}>
      <h1 className={`p-4 my-4 mx-4 underline center font-black text-[1.8rem] rounded-lg uppercase shadow-lg ${getBackgroundClass()}`}>
        Admin Settings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className={`${getCardClass()} rounded-lg shadow-md p-6`}>
          <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
          {adminDataLoading || adminDataFetching ? (
            <div className="min-h-[14.5rem] flex justify-center items-center">
              <IoHourglass className="animate-spin-slow text-4xl" />
            </div>
          ) : (
            adminData.map(({ label, type, name, value }, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  disabled
                  type={type}
                  name={name}
                  value={value}
                  className={`w-full p-3 border rounded-md ${getInputBg()} focus:outline-none cursor-not-allowed`}
                />
              </div>
            ))
          )}

          <hr className="text-white my-10" />

          <h3 className="text-xl font-semibold mb-4">Theme Settings</h3>
            <button
              onClick={toggleTheme}
              className={`px-6 py-2 rounded-md transition ${
                theme === "light" ? "bg-gray-300 text-black hover:bg-gray-700 hover:text-white" : "bg-gray-800 text-white hover:bg-gray-100 hover:text-black"
              }`}
            >
              {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>
        </div>

        {/* Notification Settings */}
        <div className={`${getCardClass()} rounded-lg shadow-md p-6 mb-1`}>
          <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
          {Object.entries(notifications).map(([type, enabled], index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <span>{type.charAt(0).toUpperCase() + type.slice(1)} Notifications</span>
              <button
                onClick={() => toggleNotification(type)}
                className={`px-6 py-2 rounded-md transition ${getButtonClass(enabled)}`}
              >
                {enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}

          <hr className="text-white my-10" />

          <h3 className="text-xl font-semibold mt-20">Token Settings</h3>
          <label className="block text-sm font-medium mb-2">Threshold</label>
          <input
            type="number"
            min={1}
            value={tokenThreshold}
            onChange={(e) => setTokenThreshold(e.target.value)}
            className={`w-full p-3 border ${getInputBg()} rounded-md focus:outline-none`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 mx-5">
        <button
          onClick={resetSettings}
          className={`px-6 py-2 bg-gray-300 ${getSaveButtonClass()} rounded-md hover:bg-gray-400 transition`}
        >
          Reset
        </button>
        <button
          onClick={saveSettings}
          className={`px-6 py-2 ${getSaveButtonClass()} rounded-md transition`}
        >
          Save
        </button>
      </div>
    </div>
  );
}
