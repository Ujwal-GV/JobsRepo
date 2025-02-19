import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminControlNavbar from './AdminControlNavbar';

const AdminWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem("location", location.pathname);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gray-900 relative max-w-[1800px] mx-auto">
      <div className="w-[2rem] lg:w-[1rem] md:w-[1rem] ">
        <AdminControlNavbar />
      </div>

      <div className="flex-1 pl-6 sm:ml-[1rem] md:ml-[3rem] lg:ml-[2rem]">
        <Outlet />
      </div>

      <div className="lg:hidden fixed inset-0 bg-gray-100 flex justify-center items-center z-50">
        <p className="text-center text-red-600 font-semibold text-md p-4 font-outfit">
          This application is only compatible with large devices. Please switch to a larger screen.
        </p>
      </div>
    </div>
  );
};

export default AdminWrapper;
