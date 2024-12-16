import React from 'react';
import { FaUser, FaToolbox, FaSearch } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import { CiWarning } from "react-icons/ci";
import DashboardCard from './components/DashboardCard';
import DashboardActionCards from './components/DashboardActionCards';
import { dashboardData, actionsData } from '../../../assets/dummyDatas/Data';
import LineChart from './components/LineChart';


export default function AdminDashboardPanel() {

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
  ];
  


  return (
    <div className='h-screen overflow-y-auto'>
      <h1 className="p-4 my-4 mx-4 text-black underline font-black  text-lg lg:text-[1.8rem] rounded-lg uppercase  shadow-lg">
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
        <div className="bg-transparent rounded-lg shadow-lg p-2 lg:p-4 md:p-4">
          <h2 className="text-2xl mt-2 font-semibold text-black  mb-6">Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {dashboardData.map((item, index) => (
              <DashboardCard key={index} title={item.title} icon={React.createElement(item.icon)} count={item.count} percentage={item.percentage}/>
            ))}
          </div>
        </div>
      </div>

     


      <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg mt-6 p-2 lg:p-4 md:p-4 ">
        
        <div className="w-[600px] shadow-md shadow-gray-400 rounded-lg">
           <h5>User Registered</h5>
           <LineChart data={data} xAxis='year' yAxis='value'/>
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
