import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Spin, Dropdown } from 'antd';
import { axiosInstance } from '../../utils/axiosInstance';
import CustomLineChart from './components/CustomLineChart';
import CustomPieChart from './components/CustomPieChart';
import CustomSingleBarChart from './components/CustomSingleBarChart';
import CustomMultiBarChart from './components/CustomMultiBarChart';
import { MdRefresh } from 'react-icons/md';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FaCalendar, FaDownload } from 'react-icons/fa';
import { IoHourglassOutline } from 'react-icons/io5';

export default function AdminStatisticsPage() {
  const [days, setDays] = useState(7);
  const [activeData, setActiveData] = useState([]);
  const [registrationDays, setRegistrationDays] = useState([]);
  const [allDataCount, setAllDataCount] = useState([]);
  const [allDataBarCount, setAllDataBarCount] = useState([]);
  const [selectLabel, setSelectLabel] = useState("Select Time Range");

  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries();
    }, 300000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const items = [
    { label: 'Today', key: '1' },
    { label: 'Yesterday', key: '2' },
    { label: 'Past Week', key: '7' },
    { label: 'Past 10 Days', key: '10' },
    { label: 'Past Month', key: '30' },
  ];

  const handleMenuClick = ({ key, domEvent }) => {
    setDays(Number(key));
    setSelectLabel(domEvent.target.innerText);
  };

    const handleActiveUsersCount = async() => {
    try {
        const res = await axiosInstance.get("/admin/satistics/active-user", {
        params: { days },
        });        

        const activeData = res.data.map(day => ({
            date: day.Date,
            Users: day.counts.activeUsersCount,
            Providers: day.counts.activeProviderCount,
            Freelancers: day.counts.activeFreelancerCount,
        }));
                
        setActiveData(activeData);
        return activeData.reverse();
    } catch (err) {
        setActiveData([]);
        throw new Error(err);
    }
};

    const { 
        data: activeUsersCount, 
        isLoading: activeUsersCountLoading, 
        isFetching: activeUsersCountFetching,
        refetch: refreshActiveUsersCount,
    } = useQuery({
    queryKey: ['active-users-count', days],
    queryFn: handleActiveUsersCount,
    staleTime: 300000,
    cacheTime: 300000,
    });

  // Line Graph Data
  const fetchRegistrationStats = async () => {
    try {
        const res = await axiosInstance.get('/admin/satistics/registration', {
            params: { days },
        });    
    
        const registrationDays = res.data.map(day => ({
            date: day.Date,
            Users: day.counts.registeredUsersCount,
            Providers: day.counts.registeredProviderCount,
            Freelancers: day.counts.registeredFreelancerCount,
            Posts: day.counts.registeredPostCount,
            Projects: day.counts.registeredProjectCount,
        }));

        console.log(registrationDays);
        
        setRegistrationDays(registrationDays.reverse());
        return registrationDays;
    } catch (err) {
        setRegistrationDays([]);
        throw new Error(err);
    }
  };

  const { 
    data: registrationStats,
    isLoading: registrationStatsLoading,
    isFetching: registrationStatsFetching,
    refetch: refreshRegistrationStats,
  } = useQuery({
    queryKey: ['registration-stats', days],
    queryFn: fetchRegistrationStats,
    staleTime: 300000,
    cacheTime: 300000,
  });

  // Pie Chart Data
  const fetchPieChartData = async () => {
    try {
        const res = await axiosInstance.get('/admin/all-data-counts', {
            params: { days },
        });
      
        const allDataCount = [
            { title: 'Seekers', data: res.data.totalSeekers, blocked: res.data.totalBlockedSeekers, current: res.data.totalSeekers - res.data.totalBlockedSeekers },
            { title: 'Providers', data: res.data.totalProviders, blocked: res.data.totalBlockedProviders, current: res.data.totalProviders - res.data.totalBlockedProviders },
            { title: 'Freelancers', data: res.data.totalFreelancers, blocked: res.data.totalBlockedFreelancers, current: res.data.totalFreelancers - res.data.totalBlockedFreelancers },
        ];
    
        setAllDataCount(allDataCount);
        return allDataCount;
    } catch (err) {
        setAllDataCount([]);
        throw new Error(err);
    }
  };

  const { 
    data: pieChartData, 
    isLoading: pieChartLoading,
    isFetching: pieChartFetching,
    refetch: refreshPieChartData,
  } = useQuery({
    queryKey: ['pie-chart-data', days],
    queryFn: fetchPieChartData,
    staleTime: 300000,
    cacheTime: 300000,
  });

  // Bar Chart Data
  const fetchUserCounts = async () => {
    try {
        const res = await axiosInstance.get('/admin/all-data-counts', {
            params: { days },
          });
          
        const allDataBarCount = [
        {
            name: 'Seekers',
            total: res.data.totalSeekers,
            // active: res.data.totalSeekers - res.data.totalBlockedSeekers,
        },
        {
            name: 'Providers',
            total: res.data.totalProviders,
            // active: res.data.totalProviders - res.data.totalBlockedProviders,
        },
        {
            name: 'Freelancers',
            total: res.data.totalFreelancers,
            // active: res.data.totalFreelancers - res.data.totalBlockedFreelancers,
        },
        {
            name: 'Jobs',
            total: res.data.totalJobPost,
        },
        {
            name: 'Projects',
            total: res.data.totalProjectPost,
        },
        ];
    
        setAllDataBarCount(allDataBarCount);
        return allDataBarCount;
    } catch (err) {
        setAllDataBarCount([]);
        throw new Error(err);
    }
  };

  const { 
    data: userCounts, 
    isLoading: userCountsLoading,
    isFetching: userCountsFetching,
    refetch: refreshUsersCount,
  } = useQuery({
    queryKey: ['user-counts', days],
    queryFn: fetchUserCounts,
    staleTime: 300000,
    cacheTime: 300000,
  });

  const handleRefreshData = () => {
    refreshActiveUsersCount(),
    refreshUsersCount();
    refreshPieChartData();
    refreshRegistrationStats();
  };  

    // Download CSVActiveUserCounts as CSV
    const downloadCSVActiveUserCounts = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Users,Providers,Freelancers\n"; // Headers
        
        activeUsersCount.forEach(item => {
            csvContent += `${item.date},${item.Users},${item.Providers},${item.Freelancers}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "active_stats.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  // Download RegistrationStats as CSV
  const downloadCSVRegistrationStats = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Users,Providers,Freelancers,Posts,Projects\n"; // Headers
  
    registrationStats.forEach(item => {
      csvContent += `${item.date},${item.users},${item.providers},${item.freelancers},${item.posts},${item.projects}\n`;
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registration_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download CSVPieChartData as CSV
  const downloadCSVPieChartData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Total,Blocked,Current\n"; // Headers
  
    pieChartData.forEach(item => {
      csvContent += `${item.title},${item.data},${item.blocked},${item.current}\n`;
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pie_chart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    // Download CSVUserCounts as CSV
  const downloadCSVUserCounts = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Total\n"; // Headers
  
    userCounts.forEach(item => {
      csvContent += `${item.name},${item.total}\n`;
    });
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_counts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  // Download as Image
  const downloadAsImage = (id, filename) => {
    const element = document.getElementById(id);
    toPng(element)
      .then((dataUrl) => {
        saveAs(dataUrl, filename);
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0080A2"];

  return (
    <div className="h-screen overflow-y-auto p-4">
      <h1 className="text-2xl font-bold text-center underline uppercase text-white">Admin Dashboard</h1>

      <div className="flex gap-4 justify-end mb-4">
        <Dropdown 
          menu={{ 
            items, 
            onClick: handleMenuClick,
            className: 'custom-dropdown-menu'
           }} 
          className= 'custom-dropdown-menu-color'
          trigger={['click']}
          >
          <button className="bg-gray-700 bg-opacity-50 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500">
            <span className="flex gap-2">
                <FaCalendar />{selectLabel}
            </span>
          </button>
        </Dropdown>
        {/* <button
            onClick={downloadCSVRegistrationStats}
            className="py-2 px-4 bg-[#0c1a32e9] text-white rounded-lg shadow hover:bg-gray-500"
        >
            Download Registration Stats CSV
        </button> */}

        {/* <button
            onClick={downloadCSVPieChartData}
            className="py-2 px-4 bg-[#0c1a32e9] text-white rounded-lg shadow hover:bg-gray-500"
        >
            Download Pie Chart Data CSV
        </button>

        <button
            onClick={downloadCSVUserCounts}
            className="py-2 px-4 bg-[#0c1a32e9] text-white rounded-lg shadow hover:bg-gray-500"
        >
            Download User Counts CSV
        </button> */}

        <button
          onClick={() => downloadAsImage("charts-container", "statistics.png")}
          className="py-2 px-4 bg-gray-700 bg-opacity-50 text-white rounded-lg shadow hover:bg-gray-500"
        >
          <span className="flex gap-2">
            <FaDownload />Download Image
          </span>
        </button>
        <button
          onClick={handleRefreshData}
          title='Refresh'
          className="py-2 px-2 bg-gray-700 bg-opacity-50 text-white hover:bg-gray-500 rounded-full transition-all"
        >
          <MdRefresh className="text-xl" />
        </button>
      </div>

      <div id="charts-container">

      <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg p-6">
        <div className='flex items-center justify-between mt-3  rounded-lg text-white uppercase mb-4'>
            <h2 className="text-xl mt-3 ml-4 text-white uppercase">Active Users</h2>
            <button
                onClick={downloadCSVActiveUserCounts}
                className="py-2 px-4 mr-4 bg-gray-700 bg-opacity-50 text-white rounded-lg shadow hover:bg-gray-800 text-[0.8rem]"
            >
                <span className="flex gap-2">
                    <FaDownload />Download Active Users Stats CSV
                </span>
            </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 ">
            <div className="shadow-md p-10 rounded-lg min-h-[20rem]">
              <h3 className="text-center font-medium text-white">Active Users Breakdown</h3>
              {activeUsersCountLoading || activeUsersCountFetching ? (
                <div className='flex align-center items-center justify-center p-10 min-h-[16rem] w-full'>
                    <IoHourglassOutline className='animate-spin-slow text-[2rem] text-white' />
                </div>               
                ) : (
                <CustomMultiBarChart
                  data={activeUsersCount}
                  xAxisKey="date"
                  barKeys={['Users', 'Providers', 'Freelancers']}
                  colors={['#1284d8', '#ffc658', '#82eb0d']}
                />
              )}
            </div>
          </div>
        </div>


        {/* Bar Graph Section for Registered Users */}
        <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg p-6 mb-6 relative mt-4">
        <div className='flex items-center justify-between mt-3  rounded-lg text-white uppercase mb-4'>
            <h2 className="text-xl mt-3 ml-4 text-white uppercase">Registration Line Graphs</h2>
            <button
                onClick={downloadCSVRegistrationStats}
                className="py-2 px-4 mr-4 bg-gray-700 bg-opacity-50 rounded-lg shadow hover:bg-gray-800 text-white text-[0.8rem]"
            >
                <span className='flex gap-2'>
                    <FaDownload />Download Registration Stats CSV
                </span>
            </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
            {['Users', 'Providers', 'Freelancers', 'Posts', 'Projects'].map((key, index) => (
                <div key={index} className="shadow-md p-4 rounded-lg bg-gray-800 border border-gray-700 bg-opacity-50">
                <h3 className="text-center font-thin capitalize text-gray-200">{key}</h3>
                {registrationStatsLoading || registrationStatsFetching ? (
                    <div className='flex align-center items-center justify-center p-10 min-h-[25rem] w-full'>
                    <IoHourglassOutline className='animate-spin-slow text-[1rem] text-white' />
                    </div>
                ) : (
                    <CustomSingleBarChart 
                        data={registrationStats} 
                        xAxisKey="date" 
                        barKey={key} 
                        barColor={COLORS[index % COLORS.length]} 
                    />
                )}
                </div>
            ))}
            </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg p-6 mb-6">
        <div className='flex items-center justify-between mt-3  rounded-lg text-white uppercase mb-4'>
            <h2 className="text-xl mt-3 ml-4 text-white uppercase">Pie Chart Statistics</h2>
            <button
                onClick={downloadCSVPieChartData}
                className="py-2 px-4 mr-4  rounded-lg shadow hover:bg-gray-800 text-white bg-gray-700 bg-opacity-50 text-[0.8rem]"
            >
                <span className='flex gap-2'>
                    <FaDownload />Download User Stats CSV
                </span>
            </button>
        </div>          
        <div className={`grid gap-6 ${pieChartLoading || pieChartFetching ? "grid-cols-1" : "grid-cols-3"}`}>
            {pieChartLoading || pieChartFetching ? (
                <div className='flex align-center items-center justify-center p-10 min-h-[22.5rem] w-full'>
                    <IoHourglassOutline className='animate-spin-slow text-[1rem] text-white' />
                </div>             
                ) : (
              pieChartData.map((item, index) => (
                <div key={index} className="shadow-md p-4 rounded-lg">
                  <h3 className="text-center font-thin text-white">{item.title}</h3>
                  <CustomPieChart
                    data={[
                      { name: 'Total', value: item.data },
                      { name: 'Blocked', value: item.blocked },
                      { name: 'Current', value: item.current },
                    ]}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="bg-slate-800 bg-opacity-50 shadow-lg rounded-lg p-6">
        <div className='flex items-center justify-between mt-3  rounded-lg text-white uppercase mb-4'>
            <h2 className="text-xl mt-3 ml-4 text-white uppercase">Bar Chart Statistics</h2>
            <button
                onClick={downloadCSVUserCounts}
                className="py-2 px-4 mr-4 bg-gray-100 rounded-lg shadow hover:bg-gray-800 text-white bg-gray-700 bg-opacity-50 text-[0.8rem]"
            >
                <span className="flex gap-2">
                    <FaDownload />Download Distribution Stats CSV
                </span>
            </button>
        </div>          
        <div className="grid grid-cols-2 gap-6">
            <div className="shadow-md p-4 rounded-lg bg-gray-800 border border-gray-700 bg-opacity-50">
              <h3 className="text-center font-thin text-gray-200">User Distribution</h3>
              {userCountsLoading || userCountsFetching ? (
                <div className='flex align-center items-center justify-center p-10 min-h-[15rem] w-full'>
                   <IoHourglassOutline className='animate-spin-slow text-[1rem] text-white' />
                </div>               
                ) : (
                <CustomSingleBarChart data={userCounts} xAxisKey="name" barKey="total" barColor={["#FF8042"]} />
              )}
            </div>

            <div className="shadow-md p-4 rounded-lg bg-gray-800 border border-gray-700 bg-opacity-50">
              <h3 className="text-center font-thin text-gray-200">Registration Breakdown</h3>
              {registrationStatsLoading || registrationStatsFetching ? (
                <div className='flex align-center items-center justify-center p-10 min-h-[16rem] w-full'>
                    <IoHourglassOutline className='animate-spin-slow text-[1rem] text-white' />
                </div>               
                ) : (
                <CustomMultiBarChart
                  data={registrationStats}
                  xAxisKey="date"
                  barKeys={['Users', 'Providers', 'Freelancers']}
                  colors={['#8884d8', '#82ca9d', '#ffc658']}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
