import React, { useEffect, useState } from 'react';
import { FaUser, FaProjectDiagram, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { CiWarning } from "react-icons/ci";
import DashboardCard from './components/DashboardCard';
import DashboardActionCards from './components/DashboardActionCards';
import { dashboardData, actionsData } from '../../../assets/dummyDatas/Data';
import LineChart from './components/LineChart';
import { axiosInstance } from '../../utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { LuLoader2 } from "react-icons/lu";
import { MdRefresh, MdWork } from 'react-icons/md';
import PieChart from './components/PieChart';

export default function AdminDashboardPanel() {
const [registrationData, setRegistrationData] = useState([]);

const piedata = [
  { type: '1', value: 27 },
  { type: '2', value: 25 },
  { type: '3', value: 18 },
  { type: '4', value: 15 },
  { type: '5', value: 10 },
  { type: '6', value: 5 },
];

  const handleUsersCount = async() => {
    try {
      const res = await axiosInstance.get("/admin/satistics/all-users");

      const updatedData = [
          { title: 'Job Seekers', icon: FaUser, count: res.data.UsersCount },
          { title: 'Job Providers', icon: FaBuildingUser, count: res.data.ProviderCount },
          { title: 'Freelancers', icon: FaUserTie, count: res.data.FreelancerCount },
          { title: 'Posts', icon: MdWork, count: res.data.PostCount },
          { title: 'Projects', icon: FaProjectDiagram, count: res.data.ProjectCount },
      ];
      return updatedData;
    } catch (err) {
      throw new Error(err);
    }
  };

    const { 
      data: usersCount, 
      isLoading: usersCountLoading, 
      isFetching: usersDataIsFetching,
      refetch: refreshUsersCount,
    } = useQuery({
      queryKey: ['users-count'],
      queryFn: handleUsersCount,
      staleTime: 300000,
      cacheTime: 300000,
    });
    
    const handleActiveUsersCount = async() => {
      try {
        const res = await axiosInstance.get("/admin/satistics/active-user");

        const activeData = res.data.map(day => ({
          date: day.Date,
          active: day.count,
        }));
        
        return activeData;
      } catch (err) {
        throw new Error(err);
      }
    };

    const { 
      data: activeUsersCount, 
      isLoading: activeUsersCountLoading, 
      isFetching: activeUsersCountFetching,
      refetch: refreshActiveUsersCount,
    } = useQuery({
      queryKey: ['active-users-count'],
      queryFn: handleActiveUsersCount,
      staleTime: 300000,
      cacheTime: 300000,
    });

    const handleUserRegistrationCount = async() => {
      try {
        const res = await axiosInstance.get("/admin/satistics/registration");
                
        const registrationData = res.data.map(day => ({
          date: day.Date,
          users: day.counts.registeredUsersCount,
          providers: day.counts.registeredProviderCount,
          freelancers: day.counts.registeredFreelancerCount,
          jobs: day.counts.registeredPostCount,
          projects: day.counts.registeredProjectCount
        }));        
    
        setRegistrationData(registrationData);
        return registrationData;
      } catch (err) {
        console.error("Error fetching registration data:", err);
        // setRegistrationData([]);
      }
    };
    
    const { 
      data: registrationCount, 
      isLoading: registrationCountLoading, 
      isFetching: registrationCountFetching,
      refetch: refreshRegistrationCount,
    } = useQuery({
      queryKey: ['users-register-count'],
      queryFn: handleUserRegistrationCount,
      staleTime: 300000,
      cacheTime: 300000,
    });    

    const handleRefreshCount = () => {
      refreshUsersCount();
    };

    const handleActiveRefreshCount = () => {
      refreshActiveUsersCount();
    };

    const handleRegistrationRefreshCount = () => {
      refreshRegistrationCount();
    }

  return (
    <div className='h-screen overflow-y-auto'>
      <h1 className="p-4 my-4 mx-4 text-black underline center font-black text-lg lg:text-[1.8rem] rounded-lg uppercase  shadow-lg">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-4">
        {/* Admin Profile */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <img 
            src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
            alt="Admin Avatar"
            className="rounded-full w-24 h-24 mx-auto"
          />
          <h3 className="text-lg font-semibold mt-4">Admin Name</h3>
          <p className="text-md text-gray-500">Administrator</p>
          <p className="text-sm text-red-500">Last login: 2 days ago</p>
        </div> */}

        {/* Statistics Section */}
        <div className="bg-transparent rounded-lg shadow-lg p-2 lg:p-4 md:p-4 relative">
          <h2 className="text-2xl justify-start font-semibold text-black">Statistics</h2>
          <button
            onClick={handleRefreshCount}
            className="absolute top-4 py-2 px-2 justify-end right-6 text-gray-800 rounded-full hover:bg-gray-200 transition-all"
          >
            <MdRefresh className="text-xl" />
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {usersCountLoading || usersDataIsFetching ? 
              <p className='flex items-center gap-1'>Loading statistics<LuLoader2 className='animate-spin-slow' /></p>
              :
              usersCount.length > 0 ?
                usersCount.map((item, index) => (
                  <DashboardCard key={index} title={item.title} icon={React.createElement(item.icon)} count={item.count} />
                )) 
                : 
                <p className='flex justify-center align-center mx-auto'>Loading data.....</p>
              }

          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 bg-white rounded-lg shadow-lg mt-6 p-4">
        
        <div className="w-[600px] shadow-md shadow-gray-400 rounded-lg relative">
           <h5 className='p-3'>Active Users</h5>
           <button
            onClick={handleActiveRefreshCount}
              className="absolute top-4 py-2 px-2 justify-end right-4 text-gray-800 rounded-full hover:bg-gray-200 transition-all"
            >
              <MdRefresh className="text-xl" />
            </button>
           {activeUsersCountLoading || activeUsersCountFetching ? 
            <div className='flex align-center items-center justify-center mx-auto gap-1 p-10 min-h-[30rem] w-[600px]'>
              Loading statistics<LuLoader2 className='animate-spin-slow' />
            </div> 
            :
            <LineChart data={activeUsersCount} xAxis='date' yAxis='active'/> 
          }
          </div>
        </div>
      </div>

      <div className="p-4 relative">
        <h2 className='center text-xl bg-[#0c1a32e9] p-3 rounded-lg text-white uppercase'>Registration Statistics</h2>
        <button
          onClick={handleRegistrationRefreshCount}
          className="absolute top-6 right-6 py-2 px-2 justify-end text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-all"
        >
          <MdRefresh className="text-xl" />
        </button>
        <div className="grid grid-cols-2 gap-6 p-4 bg-white rounded-lg shadow-lg mt-6 p-4">
          {/* User Registration Chart */}
          <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
            <h5 className='p-3 text-center'>User Registrations</h5>
            {registrationCountLoading || registrationCountFetching ? 
              <div className='flex align-center items-center justify-center p-10 min-h-[30rem] w-full'>
                Loading statistics<LuLoader2 className='animate-spin-slow' />
              </div> 
              :
              <LineChart
                data={registrationCount}
                xAxis="date"
                yAxis="users"
              />
            }
          </div>

          {/* Provider Registration Chart */}
          <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
            <h5 className='p-3 text-center'>Provider Registrations</h5>
            {registrationCountLoading || registrationCountFetching ? 
              <div className='flex align-center items-center justify-center p-10 min-h-[30rem] w-full'>
                Loading statistics<LuLoader2 className='animate-spin-slow' />
              </div> 
              :
              <LineChart
                data={registrationCount}
                yAxis="providers"
                xAxis="date"
              />
            }
          </div>

          {/* Freelancer Registration Chart */}
            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Freelancer Registrations</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[30rem] w-full'>
                  Loading statistics<LuLoader2 className='animate-spin-slow' />
                </div> 
                :
                <LineChart
                  data={registrationCount}
                  yAxis="freelancers"
                  xAxis="date"
                />
              }
            </div>

            {/* Job Application Post Chart */}
            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Freelancer Registrations</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[30rem] w-full'>
                  Loading statistics<LuLoader2 className='animate-spin-slow' />
                </div> 
                :
                <LineChart
                  data={registrationCount}
                  yAxis="jobs"
                  xAxis="date"
                />
              }
            </div>

            {/* Project Registration Chart */}
            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Freelancer Registrations</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[30rem] w-full'>
                  Loading statistics<LuLoader2 className='animate-spin-slow' />
                </div> 
                :
                <LineChart
                  data={registrationCount}
                  yAxis="projects"
                  xAxis="date"
                />
              }
            </div>

            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
            <h5 className='p-3 text-center'>Blocked Users</h5>
            {activeUsersCountLoading || activeUsersCountFetching ? 
              <div className='flex align-center items-center justify-center  p-10 min-h-[30rem] w-full'>
                Loading statistics<LuLoader2 className='animate-spin-slow' />
              </div> 
              :
              
              <PieChart data={registrationCount} /> 
            }
            </div>
        </div>
      </div>

       {/* Pending Actions Section */}
       <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg mt-6 p-2 lg:p-4 md:p-4 lg:p-5">
          <h2 className="text-2xl mt-2 font-semibold text-center mb-6 text-black">Pending Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionsData.map((item, index) => (
              <DashboardActionCards
                key={index}
                title={item.title}
                count={item.count}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
