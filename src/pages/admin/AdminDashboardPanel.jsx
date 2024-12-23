import React, { useEffect, useState } from 'react';
import { FaUser, FaProjectDiagram, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { CiWarning } from "react-icons/ci";
import DashboardCard from './components/DashboardCard';
import DashboardActionCards from './components/DashboardActionCards';
import LineChart from './components/LineChart';
import CustomLineChart from './components/CustomLineChart';
import { axiosInstance } from '../../utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { LuLoader2 } from "react-icons/lu";
import { MdRefresh, MdWork } from 'react-icons/md';
import { IoHourglassOutline } from 'react-icons/io5';

export default function AdminDashboardPanel() {
  const handleUsersCount = async () => {
    const res = await axiosInstance.get("/admin/satistics/all-users");
    return [
      { title: 'Job Seekers', icon: FaUser, count: res.data.UsersCount, color: "#6366F1", percentage: 90 },
      { title: 'Job Providers', icon: FaBuildingUser, count: res.data.ProviderCount, color: "885CF6", percentage: 70 },
      { title: 'Freelancers', icon: FaUserTie, count: res.data.FreelancerCount, color: "#EC4899", percentage: 50 },
      { title: 'Posts', icon: MdWork, count: res.data.PostCount, color: "#10B981", percentage: 40 },
      { title: 'Projects', icon: FaProjectDiagram, count: res.data.ProjectCount, color: "red", percentage: 30 },
    ];
  };

  const { 
    data: usersCount = [], 
    isLoading: usersCountLoading, 
    isFetching: usersDataIsFetching, 
    refetch: refreshUsersCount 
  } = useQuery({
    queryKey: ['users-count'],
    queryFn: handleUsersCount,
    staleTime: 300000,
    cacheTime: 300000,
  });

  const handleVerificationData = async () => {
    const [reportsResponse, verificationResponse] = await Promise.all([
      axiosInstance.get("/reports"),
      axiosInstance.get("/admin/providers", {
        params: {
          isVerified: "false"
        },
      }),
    ]);

    return [
      { title: 'Verification Requests', count: verificationResponse.data.totalUsers, description: ' profiles pending verification', action: () => window.open('/admin/verification-pending') },
      { title: 'User Reports', count: reportsResponse.data.totalData, description: ' user reports', action: () => window.open('/admin/reports') },
      { title: 'Account Deletion Requests', count: 3, description: ' profiles deletion pending', action: () => alert('Deletion still pending') },
      { title: 'Some Other Requests', count: 419, description: ' other action pending', action: () => alert('Other action still pending') },
    ];
  };

  const { 
    data: verificationData = [], 
    isLoading: verificationDataLoading, 
    isFetching: verificationDataFetching ,
    refetch: refreshDataCounts
  } = useQuery({
    queryKey: ['dashboard-action-data'],
    queryFn: handleVerificationData,
    staleTime: 300000,
    cacheTime: 300000,
  });

  const handleRefresh = () => {
    refreshUsersCount();
    refreshDataCounts();
  }

  return (
    <div className="h-screen overflow-y-auto">
      <h1 className="p-4 my-4 mx-4 text-white underline center font-black text-[1.8rem] rounded-lg uppercase shadow-lg">
        Admin Dashboard
      </h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-4">
        <div className="bg-transparent rounded-lg p-2 lg:p-4 md:p-4 relative">
          <h2 className="text-2xl justify-start font-semibold text-white">Statistics</h2>
          <button
            onClick={handleRefresh}
            className="absolute top-4 py-2 px-2 justify-end right-6 rounded-full transition-all bg-gray-700 bg-opacity-50 text-white hover:bg-gray-500"
          >
            <MdRefresh className="text-xl" />
          </button>
          <div className="grid grid-cols-4 gap-6">
            {usersCountLoading || usersDataIsFetching ? 
              <>
                <DashboardCard isLoading={usersCountLoading || usersDataIsFetching}/>
                <DashboardCard isLoading={usersCountLoading || usersDataIsFetching}/>
                <DashboardCard isLoading={usersCountLoading || usersDataIsFetching}/>
                <DashboardCard isLoading={usersCountLoading || usersDataIsFetching}/>
                <DashboardCard isLoading={usersCountLoading || usersDataIsFetching}/>
              </>
              :
              usersCount.map((item, index) => (
                <DashboardCard
                  key={index}
                  title={item.title}
                  icon={React.createElement(item.icon)}
                  count={item.count}
                  isLoading={usersCountLoading}
                  color={item.color}
                  percentage={item.percentage}
                />
              ))
            }
          </div>
        </div>
      </div>

      {/* Pending Actions Section */}
      <div className="p-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg mt-6 p-2 md:p-4 lg:p-5">
          <h2 className="text-2xl mt-2 font-semibold text-center mb-6 text-gray-200">Pending Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verificationDataFetching || verificationDataLoading ?  
              <>
                <DashboardActionCards isLoading={verificationDataLoading || verificationDataFetching}/>
                <DashboardActionCards isLoading={verificationDataLoading || verificationDataFetching}/>
                <DashboardActionCards isLoading={verificationDataLoading || verificationDataFetching}/>
                <DashboardActionCards isLoading={verificationDataLoading || verificationDataFetching}/>
              </>
            :
              verificationData.map((item, index) => (
                <DashboardActionCards
                  key={index}
                  title={item.title}
                  count={item.count}
                  description={item.description}
                  onClick={item.action}
                  isLoading={verificationDataLoading || verificationDataFetching}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
