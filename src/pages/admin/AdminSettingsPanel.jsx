import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminSettingsPanel() {
  const [profileSettings, setProfileSettings] = useState({
    name: "Admin Name",
    email: "ujwal@gamil.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [tokenThreshold, setTokenThreshold] = useState(100);
  const [notificationRules, setNotificationRules] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveChanges = () => {
    alert("Settings saved successfully!");
  };

  const handlePsswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const handleReset = () => {
    setProfileSettings({
      name: "Admin Name",
      email: "ujwal@gamil.com",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTheme("light");
    setNotifications({ email: true, sms: false });
    setTokenThreshold(100);
    setNotificationRules("");
    alert("Settings reset to default!");
  };

  return (
    <div className={`${theme === 'light' ? "bg-gray-100 text-black" : "bg-gray-800"} min-h-screen p-8`}>
      <h2 className={`text-3xl font-bold text-center mb-10 ${theme === 'light' ? "text-black" : "text-white"}`}>Admin Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
        <div className="space-y-4">
            {[
            { label: "Name", type: "text", name: "name", value: profileSettings.name },
            { label: "Email", type: "email", name: "email", value: profileSettings.email },
            { label: "Current Password", type: passwordVisibility.currentPassword ? "text" : "password", name: "currentPassword", value: profileSettings.currentPassword },
            { label: "New Password", type: passwordVisibility.newPassword ? "text" : "password", name: "newPassword", value: profileSettings.newPassword },
            { label: "Confirm Password", type: passwordVisibility.confirmPassword ? "text" : "password", name: "confirmPassword", value: profileSettings.confirmPassword },
            ].map(({ label, type, name, value }, index) => (
            <div key={index}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleProfileChange}
                    className="w-full p-3 border-2 border-black bg-gray-100 rounded-md focus:outline-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                {["currentPassword", "newPassword", "confirmPassword"].includes(name) && (
                    <button
                    type="button"
                    onClick={() => togglePasswordVisibility(name)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                    {passwordVisibility[name] ? <FaEye /> : <FaEyeSlash />}
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold">Theme Settings</h3>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Theme</label>
            <button
              onClick={handleThemeChange}
              className={`px-6 py-2 rounded-md transition ${
                theme === "light"
                  ? "bg-gray-300 text-black hover:bg-gray-400"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

        <hr className="text-black w-[90%] my-4 mx-auto" />

          <h3 className="text-xl font-semibold mb-4">App-Wide Settings</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Notification Rules</label>
            <textarea
              value={notificationRules}
              onChange={(e) => setNotificationRules(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Define app-wide notification rules..."
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">App-Wide Settings</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Notification Rules</label>
            <textarea
              value={notificationRules}
              onChange={(e) => setNotificationRules(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Define app-wide notification rules..."
              rows={4}
            ></textarea>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { label: "Email Notifications", type: "email" },
              { label: "SMS Notifications", type: "sms" },
            ].map(({ label, type }, index) => (
              <div key={index} className="flex items-center justify-between">
                <label className="block text-sm font-medium">{label}</label>
                <button
                  onClick={() => handleNotificationChange(type)}
                  className={`px-6 py-2 rounded-md transition ${
                    notifications[type]
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  {notifications[type] ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* App-Wide Settings */}
        

        {/* Token Conversion Rates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Token Conversion Rates</h3>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Threshold</label>
            <input
              type="number"
              min={1}
              value={tokenThreshold}
              onChange={(e) => setTokenThreshold(e.target.value)}
              className="w-1/4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Save and Reset Buttons */}
      <div className="flex justify-end gap-6 mt-10">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
        >
          Reset
        </button>
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
