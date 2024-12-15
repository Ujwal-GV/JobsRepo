import React, { useState } from "react";
import { FaSearch, FaUser, FaLock, FaCheckCircle, FaEye } from "react-icons/fa";
import DashboardCard from './components/DashboardCard';
import DashboardActionCards from './components/DashboardActionCards';
import { usersData, userActionsData } from '../../../assets/dummyDatas/Data';

export default function AdminUserManagementPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleModalOpen = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleApproveVerification = () => {
    alert(`Approved verification for ${selectedUser.name}`);
    handleModalClose();
  };

  const handleRejectVerification = () => {
    alert(`Rejected verification for ${selectedUser.name}`);
    handleModalClose();
  };

  return (
    <>
      {/* Search Bar */}
      <div className="p-4 bg-gray-200 rounded-lg shadow-lg my-5 mx-4 flex items-center gap-4">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded-md focus:outline-none"
        />
      </div>

      {/* User Stats */}
        {/* <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 md:p-6 max-h-[50rem] w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">User Management</h2>
          <hr className='text-black mb-3 w-[90%] mx-auto' />
          <div className="overflow-x-auto w-full custom-scroll">
            <table className="w-full table-auto text-sm border-collapse">
                <thead className="bg-gray-200">
                <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Registration Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {usersData.filter(user =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.registrationDate.toString().toLowerCase().includes(searchQuery.toLowerCase())
                ).map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100 transition">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.registrationDate}</td>
                    <td className="px-4 py-2">{user.status}</td>
                    <td className="px-4 py-2 flex justify-center items-center">
                        <button className="text-orange-600" onClick={() => handleModalOpen(user)}><FaEye /></button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div> */}

      {/* User Actions and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <section className="bg-gray-200 rounded-lg shadow-lg p-2 lg:p-4 md:p-4">
          <h2 className="text-2xl mt-2 font-semibold text-center mb-4">User Actions</h2>
          <hr className="border-white mb-4 w-[90%] mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userActionsData.map((item, index) => (
              <DashboardActionCards
                key={index}
                title={item.title}
                count={item.count}
                description={item.description}
              />
            ))}
          </div>
        </section>

        <section className="bg-gray-200 rounded-lg shadow-lg p-2 lg:p-4 md:p-4">
          <h2 className="text-2xl mt-2 font-semibold text-center mb-4">User Statistics</h2>
          <hr className="border-white mb-4 w-[90%] mx-auto" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DashboardCard title="Active Users" icon={<FaUser />} count={10250} />
            <DashboardCard title="Blocked Users" icon={<FaLock />} count={320} />
            <DashboardCard title="Verified Users" icon={<FaCheckCircle />} count={5600} />
          </div>
        </section>
      </div>
    </>
  );
}
