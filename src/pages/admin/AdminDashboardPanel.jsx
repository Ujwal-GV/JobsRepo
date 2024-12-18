import React, { useEffect, useState } from 'react';
import { FaUser, FaProjectDiagram, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { CiWarning } from "react-icons/ci";
import DashboardCard from './components/DashboardCard';
import DashboardActionCards from './components/DashboardActionCards';
import { dashboardData, actionsData } from '../../../assets/dummyDatas/Data';
import LineChart from './components/LineChart';
import CustomLineChart from './components/CustomLineChart';
import { axiosInstance } from '../../utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { LuLoader2 } from "react-icons/lu";
import { MdRefresh, MdWork } from 'react-icons/md';
import PieChart from './components/PieChart';
import { Dropdown, Spin } from 'antd';
import { useDomEvent } from 'framer-motion';
import CustomPieChart from './components/CustomPieChart';
import CustomSingleBarChart from './components/CustomSingleBarChart';
import CustomMultiBarChart from './components/CustomMultiBarChart';
import { IoHourglassOutline } from 'react-icons/io5';

export default function AdminDashboardPanel() {
const [updatedData, setUpdatedData] = useState([]);
const [registrationData, setRegistrationData] = useState([]);
const [activeData, setActiveData] = useState([]);
const [days, setDays] = useState(7);
const [selectLabel, setSelectLabel] = useState("Select Time Range");
const [RegistrationDays, setRegistrationDays] = useState(7);
const [label, setLabel] = useState("Select Time Range");




  const handleUsersCount = async() => {
    try {
      const res = await axiosInstance.get("/admin/satistics/all-users");

      const updatedData = [
          { title: 'Job Seekers', icon: FaUser, count: res.data.UsersCount ,color:"#6366F1",percentage:90 },
          { title: 'Job Providers', icon: FaBuildingUser, count: res.data.ProviderCount,color:"885CF6",percentage:70 },
          { title: 'Freelancers', icon: FaUserTie, count: res.data.FreelancerCount,color:"#EC4899",percentage:50 },
          { title: 'Posts', icon: MdWork, count: res.data.PostCount,color:"#10B981",percentage:40 },
          { title: 'Projects', icon: FaProjectDiagram, count: res.data.ProjectCount,color:"red",percentage:30 },
      ];

      setUpdatedData(updatedData);
      return updatedData;
    } catch (err) {
      setUpdatedData([]);
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
    
    // const handleActiveUsersCount = async() => {
    //   try {
    //     const res = await axiosInstance.get("/admin/satistics/active-user", {
    //       params: { days },
    //     });

    //     const activeData = res.data.map(day => ({
    //       date: day.Date,
    //       active: day.count,
    //     }));
        
    //     setActiveData(activeData);
    //     return activeData.reverse();
    //   } catch (err) {
    //     setActiveData([]);
    //     throw new Error(err);
    //   }
    // };

    // const { 
    //   data: activeUsersCount, 
    //   isLoading: activeUsersCountLoading, 
    //   isFetching: activeUsersCountFetching,
    //   refetch: refreshActiveUsersCount,
    // } = useQuery({
    //   queryKey: ['active-users-count', days],
    //   queryFn: handleActiveUsersCount,
    //   staleTime: 300000,
    //   cacheTime: 300000,
    // });

    // const handleUserRegistrationCount = async() => {
    //   try {
    //     const res = await axiosInstance.get("/admin/satistics/registration", {
    //       params: {days: RegistrationDays}
    //     });
                
    //     const registrationData = res.data.map(day => ({
    //       date: day.Date,
    //       users: day.counts.registeredUsersCount,
    //       providers: day.counts.registeredProviderCount,
    //       freelancers: day.counts.registeredFreelancerCount,
    //       jobs: day.counts.registeredPostCount,
    //       projects: day.counts.registeredProjectCount
    //     }));
        
    //     setRegistrationData(registrationData);
    //     return registrationData.reverse();
    //   } catch (err) {
    //     console.error("Error fetching registration data:", err);
    //     setRegistrationData([]);
    //   }
    // };
    
    // const { 
    //   data: registrationCount, 
    //   isLoading: registrationCountLoading, 
    //   isFetching: registrationCountFetching,
    //   refetch: refreshRegistrationCount,
    // } = useQuery({
    //   queryKey: ['users-register-count', RegistrationDays],
    //   queryFn: handleUserRegistrationCount,
    //   staleTime: 300000,
    //   cacheTime: 300000,
    // });
    
    // const handleTotalUsers = async () => {
    //   try {
    //     const res = await axiosInstance.get("/admin/all-data-counts");
    
    //     const totalUsersData = [
    //       {
    //         chartTitle: "Seekers",
    //         data: [
    //           { name: "Total Seekers", value: res.data.totalSeekers },
    //           { name: "Blocked Seekers", value: res.data.totalBlockedSeekers },
    //           { name: "Active Seekers", value: res.data.totalSeekers - res.data.totalBlockedSeekers },
    //         ],
    //       },
    //       {
    //         chartTitle: "Providers",
    //         data: [
    //           { name: "Total Providers", value: res.data.totalProviders },
    //           { name: "Blocked Providers", value: res.data.totalBlockedProviders },
    //           { name: "Active Providers", value: res.data.totalProviders - res.data.totalBlockedProviders },
    //         ],
    //       },
    //       {
    //         chartTitle: "Freelancers",
    //         data: [
    //           { name: "Total Freelancers", value: res.data.totalFreelancers },
    //           { name: "Blocked Freelancers", value: res.data.totalBlockedFreelancers },
    //           { name: "Active Freelancers", value: res.data.totalFreelancers - res.data.totalBlockedFreelancers },
    //         ],
    //       },
    //     ];
    
    //     return totalUsersData;
    //   } catch (err) {
    //     console.error("Error fetching total users data:", err);
    //     throw err;
    //   }
    // };
    
    // const { 
    //   data: totalUsersData, 
    //   isLoading: totalUsersLoading, 
    //   isFetching: totalUsersFetching,
    //   refetch: refreshTotalUsersData,
    // } = useQuery({
    //   queryKey: ['total-users-data'],
    //   queryFn: handleTotalUsers,
    //   staleTime: 300000,
    //   cacheTime: 300000,
    // });    

    const handleRefreshCount = () => {
      refreshUsersCount();
    };

    // const handleActiveRefreshCount = () => {
    //   refreshActiveUsersCount();
    // };

    // const handleRegistrationRefreshCount = () => {
    //   refreshRegistrationCount();
    //   refreshTotalUsersData();
    // }

    const items = [
      {
        label: "Today",
        key: "1"
      },
      {
        label:"Yesterday",
        key: "2"
      },
      {
        label: "Past Week",
        key: "7"
      },
      {
        label: "Past 10 days",
        key: "10"
      },
      {
        label: "Past Month",
        key: "30"
      },
    ];

  return (
    <div className='h-screen overflow-y-auto'>
      <h1 className="p-4 my-4 mx-4 text-white underline center font-black text-[1.8rem] rounded-lg uppercase  shadow-lg">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-4">
        

        {/* Statistics Section */}
        <div className="bg-transparent rounded-lg  p-2 lg:p-4 md:p-4 relative  ">
          <h2 className="text-2xl justify-start font-semibold text-white">Statistics</h2>
          <button
            onClick={handleRefreshCount}
            className="absolute top-4 py-2 px-2 justify-end right-6 rounded-full transition-all bg-gray-700 bg-opacity-50 text-white hover:bg-gray-500"
          >
            <MdRefresh className="text-xl" />
          </button>
          <div className={`grid ${usersCountLoading || usersDataIsFetching ? "grid-cols-1" : "grid-cols-4" } gap-6`}>

            {usersCountLoading || usersDataIsFetching ? 
              <div className='flex align-center justify-center items-center mx-auto min-h-[20.3rem]'>
                <IoHourglassOutline className='animate-spin-slow text-[2rem] text-white' />
              </div>
              : 
              usersCount.length > 0 ?
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
                : 
                <p className='flex justify-center align-center mx-auto'>Loading data.....</p>
              }
          </div>
        </div>
      </div>
      
      {/* <div className="p-4">
        <div className="grid grid-cols-2 bg-white rounded-lg shadow-lg mt-6 p-4">
        <div className="w-[600px] shadow-md shadow-gray-400 rounded-lg relative">
           <h5 className='p-3'>Active Users</h5>
           <Dropdown
              className='absolute bg-gray-200 mb-1 top-[1.1rem] py-2 px-2 right-[3.5rem] rounded-lg border-1 border-black'
              menu={{
                  items,
                  onClick: handleSetDays,
                }}
                trigger={["click"]}
              >
                <a
                  className="cursor-pointer text-[0.9rem]"
                >
                  {selectLabel}
                </a>
            </Dropdown>
           <button
            onClick={handleActiveRefreshCount}
              className="absolute top-4 py-2 px-2 justify-end right-4 text-gray-800 rounded-full hover:bg-gray-200 transition-all"
            >
              <MdRefresh className="text-xl" />
            </button>
            {activeUsersCountLoading || activeUsersCountFetching ? (
              <div className="flex align-center items-center justify-center mx-auto gap-1 p-10 min-h-[25rem] w-full">
                <Spin size='large' className='animate-spin-slow' />
              </div>
            ) : activeUsersCount && activeUsersCount.length > 0 ? (
              <CustomLineChart data={activeUsersCount} xAxis="date" yAxis="active" />
            ) : (
              <div className="text-center text-gray-500">
                No data available for the selected time range.
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* <div className="p-4 relative">
        <h2 className='center text-xl bg-[#0c1a32e9] p-3 rounded-lg text-white uppercase'>Registration Statistics</h2>
        <Dropdown
          className='absolute bg-gray-200 mb-1 top-[1.6rem] py-2 px-2 right-[4rem] rounded-lg'
          menu={{
              items,
              onClick: handleSetRegistrationDate,
            }}
            trigger={["click"]}
          >
            <a
              className="cursor-pointer text-[0.9rem]"
            >
              {label}
            </a>
        </Dropdown>
        <button
          onClick={handleRegistrationRefreshCount}
          className="absolute top-6 right-6 py-2 px-2 justify-end text-gray-800 bg-white rounded-full hover:bg-gray-200 transition-all"
        >
          <MdRefresh className="text-xl" />
        </button>
        <div className="grid grid-cols-2 gap-6 p-4 bg-white rounded-lg shadow-lg mt-6 p-4">


          <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
            <h5 className='p-3 text-center'>User Registrations</h5>
            {registrationCountLoading || registrationCountFetching ? 
              <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                <Spin size='large' className='animate-spin-slow' />
              </div> 
              :
              <CustomLineChart
                data={registrationCount}
                xAxis="date"
                yAxis="users"
              />
            }
          </div>


          <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
            <h5 className='p-3 text-center'>Provider Registrations</h5>
            {registrationCountLoading || registrationCountFetching ? 
              <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                <Spin size='large' className='animate-spin-slow' />
              </div> 
              :
              <CustomLineChart
                data={registrationCount}
                yAxis="providers"
                xAxis="date"
              />
            }
          </div>



            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Freelancer Registrations</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                  <Spin size='large' className='animate-spin-slow' />
                </div> 
                :
                <CustomLineChart
                  data={registrationCount}
                  yAxis="freelancers"
                  xAxis="date"
                />
              }
            </div>



            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Jobs Posted</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                  <Spin size='large' className='animate-spin-slow' />
                </div> 
                :
                <CustomLineChart
                  data={registrationCount}
                  yAxis="jobs"
                  xAxis="date"
                />
              }
            </div>



            <div className="w-full shadow-md shadow-gray-400 rounded-lg relative">
              <h5 className='p-3 text-center'>Projects Posted</h5>
              {registrationCountLoading || registrationCountFetching ? 
                <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                  <Spin size='large' className='animate-spin-slow' />
                </div> 
                :
                <CustomLineChart
                  data={registrationCount}
                  yAxis="projects"
                  xAxis="date"
                />
              }
            </div>



            <div className={`grid ${totalUsersLoading || totalUsersFetching ? "grid-rows-1 grid-cols-1" : "grid-rows-2 grid-cols-2"} gap-y-4 w-full shadow-md shadow-gray-400 rounded-lg relative`}>
              {totalUsersLoading || totalUsersFetching ? (
                <div className="flex align-center items-center justify-center p-10 min-h-[10rem] w-full">
                  <Spin size="large" className="animate-spin-slow" />
                </div>
              ) : (
                totalUsersData.map((chart, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 2
                        ? "row-start-2 col-span-2 flex justify-center"
                        : index === 0
                        ? "row-start-1 col-start-1 flex justify-end"
                        : "row-start-1 col-start-2 flex justify-start"
                    }`}
                  >
                    <div className="w-4/5">
                      <h5 className="p-3 text-center">{chart.chartTitle}</h5>
                      <CustomPieChart data={chart.data} />
                    </div>
                  </div>
                ))
              )}
            </div>



          <div className="p-4 relative">
            <h2 className="center text-xl bg-[#0c1a32e9] p-3 rounded-lg text-white uppercase">Bar Chart Statistics</h2>



            <div className="w-full shadow-md shadow-gray-400 rounded-lg p-4 mt-6">
              <h5 className="p-3 text-center">User Types Overview</h5>
              {usersCountLoading || usersDataIsFetching ? (
                <div className="flex align-center items-center justify-center p-10 min-h-[25rem] w-full">
                  <Spin size="large" className="animate-spin-slow" />
                </div>
              ) : (
                <CustomSingleBarChart
                  data={usersCount.map((item) => ({ name: item.title, value: item.count }))}
                  xAxisKey="name"
                  barKey="value"
                  barColor="#82ca9d"
                />
              )}
            </div>



            <div className="w-full shadow-md shadow-gray-400 rounded-lg p-4 mt-6">
              <h5 className="p-3 text-center">Registration Breakdown</h5>
              {registrationCountLoading || registrationCountFetching ? (
                <div className="flex align-center items-center justify-center p-10 min-h-[25rem] w-full">
                  <Spin size="large" className="animate-spin-slow" />
                </div>
              ) : (
                <CustomMultiBarChart
                  data={registrationCount}
                  xAxisKey="date"
                  barKeys={['users', 'providers', 'freelancers']}
                  colors={['#8884d8', '#82ca9d', '#ffc658']}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              {totalUsersLoading || totalUsersFetching ? (
                <div className="flex align-center items-center justify-center col-span-2">
                  <Spin size="large" className="animate-spin-slow" />
                </div>
              ) : (
                totalUsersData.map((chart, index) => (
                  <div key={index} className="shadow-md shadow-gray-400 rounded-lg p-4">
                    <h5 className="p-3 text-center">{chart.chartTitle} Breakdown</h5>
                    <CustomMultiBarChart
                      data={chart.data}
                      xAxisKey="name"
                      barKeys={['value']}
                      colors={['#00C49F']}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div> */}

       {/* Pending Actions Section */}
       <div className="p-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg mt-6 p-2 md:p-4 lg:p-5">
          <h2 className="text-2xl mt-2 font-semibold text-center mb-6 text-gray-200">Pending Actions</h2>
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
