import { Progress } from "antd";
import React from "react";
import { IoHourglass, IoHourglassOutline } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";

export default function DashboardCard({ title, count, icon ,percentage=60,color="#00a8e8", isLoading }) {
  return (
    <div className="bg-gray-700 border h-[150px] border-gray-700 bg-opacity-50 min-h-[70px] shadow-lg text-white rounded-lg px-4 py-3 flex items-center justify-between gap-4 transition hover:scale-105 hover:cursor-pointer">
      {/* Progress Circle */}
      <div className="flex-shrink-0">
        <Progress
          percent={percentage}
          size={85}
          strokeColor={color} 
          trailColor="#FFFFFF" 
          type="dashboard"
          className="custom-progress"
          format={() => (
            <span className="text-gray-200 center">{isLoading ? <IoHourglass className="animate-spin-slow" /> : formatCountToText(count)}</span>
          )}
          strokeWidth={13}
        />
      </div>

      {/* Title and Count Section */}
      <div className="flex-1 flex flex-col items-start justify-center">
        <h2 className="flex items-center gap-2 text-md lg:text-lg md:text-lg font-thin">
          <span>{icon}</span>
          {title}
        </h2>
        <p className="text-xl lg:text-xl md:text-xl font-light">
          {isLoading ? 
            <>{" "}</> :
            formatCountToText(count)
          }
        </p>
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
