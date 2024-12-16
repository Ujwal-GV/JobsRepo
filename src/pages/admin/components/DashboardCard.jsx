import { Progress } from 'antd'
import React from 'react'

export default function DashboardCard({title, count, icon}) {
  return (
    <div className="bg-[#0c1a32e9]  shadow-lg text-white rounded-lg px-4 py-3 flex items-center justify-between transition hover:scale-105 hover:cursor-pointer ">
         <Progress
          percent={60}
          strokeColor="#00a8e8" // Red for the filled portion
          trailColor="#FFFFFF" // White for the unfilled portion
          type="dashboard"
          className='custom-progress'
          format={()=><span className='text-white'>{formatCountToText(count)}</span>}
          strokeWidth={10}
        />
        <div>
            <h2 className="flex gap-4 text-md lg:text-lg md:text-lg font-semibold">
              {title}
              <span className='text-white mt-0 lg:mt-1 md:mt-1 text-md'>{icon}</span>
            </h2>
            <p className="text-xl  lg:text-xl md:text-xl font-[300]">{formatCountToText(count)}</p>
        </div>
    </div>
  )
}


const formatCountToText = (count) => {
  let suffix = "";

  if (count >= 1000000) {
    suffix = "M";
    count = (count / 1000000).toFixed(1); 
  } else if (count >= 10000) {
    suffix = "k";
    count = (count / 1000).toFixed(1);
  }

  return count + suffix;
};

