import React, { useState, useEffect } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaEye } from "react-icons/fa";
import { usersData } from "../../../assets/dummyDatas/Data";

export default function AdminUserControlPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredData, setFilteredData] = useState(usersData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor((_, index) => index + 1, {
      id: "no",
      header: "No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("registrationDate", {
      header: "Registration Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="text-orange-600"
          onClick={() => handleModalOpen(row.original)}
        >
          <FaEye />
        </button>
      ),
    }),
  ];

  // Filter logic based on role and search query
  useEffect(() => {
    let filtered = usersData;

    // Apply role filter
    if (selectedRole) {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedRole]);

  // React Table configuration
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

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
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-2xl font-semibold text-center mb-6">User Managemetnt</h2>
      <hr className="text-black mb-3 w-[90%] mx-auto" />

      <div className="flex justify-center gap-4 mb-4">
        {["Seeker", "Provider", "Freelancer"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(selectedRole === role ? "" : role)}
            className={`px-4 py-2 rounded-md ${
              selectedRole === role ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
            } hover:bg-gray-800 hover:text-white`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full p-2 border rounded-md focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-100 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {cell.column.columnDef.cell(cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          ← Prev
        </button>
        <p className="text-gray-500">
          Page <span>{table.getState().pagination.pageIndex + 1}</span> of{" "}
          {table.getPageCount()}
        </p>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Profile Verification Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-90 flex justify-center items-center z-20">
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Verify Profile - {selectedUser.name}</h3>
            <img
              src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
              alt="User Profile"
              className="rounded-lg w-32 h-32 object-cover mx-auto mb-4"
            />
            <a className="text-gray-600 block text-center mb-4">Uploaded Documents: Document1.pdf</a>
            <div className="flex justify-between">
              <button className="bg-green-500 text-white py-2 px-4 rounded-md" onClick={handleApproveVerification}>
                Approve
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded-md" onClick={handleRejectVerification}>
                Reject
              </button>
              <button className="bg-gray-500 text-white py-2 px-4 rounded-md" onClick={handleModalClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
