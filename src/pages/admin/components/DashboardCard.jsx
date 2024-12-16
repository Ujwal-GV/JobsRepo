import { Progress } from 'antd';
import React from 'react';

export default function DashboardCard({ title, count, icon }) {
  return (
    <div className="bg-[#0c1a32e9] shadow-lg text-white rounded-lg px-4 py-3 flex items-center justify-between gap-4 transition hover:scale-105 hover:cursor-pointer">
      {/* Progress Circle */}
      <div className="flex-shrink-0">
        <Progress
          percent={60}
          size={75}
          strokeColor="#00a8e8" // Blue for the filled portion
          trailColor="#FFFFFF" // White for the unfilled portion
          type="dashboard"
          className="custom-progress"
          format={() => <span className="text-white">{formatCountToText(count)}</span>}
          strokeWidth={10}
        />
      </div>

      {/* Title and Count Section */}
      <div className="flex-1 flex flex-col items-start justify-center">
        <h2 className="flex items-center gap-2 text-md lg:text-lg md:text-lg font-semibold">
          <span>{icon}</span>
          {title}
        </h2>
        <p className="text-xl lg:text-xl md:text-xl font-light">{formatCountToText(count)}</p>
      </div>
    </div>
  );
}

const formatCountToText = (count) => {
  let suffix = "";

  if (count >= 1000000) {
    suffix = "M";
    count = (count / 1000000).toFixed(1); 
  } else if (count >= 1000) {
    suffix = "k";
    count = (count / 1000).toFixed(1);
  }

  return count + suffix;
};
