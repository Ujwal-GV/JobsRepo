import React from 'react';
import { IoHourglass } from 'react-icons/io5';
import { LuLoader2 } from 'react-icons/lu';

export default function DashboardActionCards({ title, count, description, onClick, isLoading }) {
  return (
    <div
      className={`bg-gray-800 bg-opacity-50 border border-gray-700 shadow-lg rounded-lg px-4 py-3 transition hover:scale-105 hover:cursor-pointer text-white ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      <h3 className="text-md lg:text-lg md:text-lg font-semibold">{title}</h3>
      <p className="text-white text-sm font-thin flex items-center">
        {isLoading ? (
          <>
            <IoHourglass className="animate-spin-slow mr-2" />
          </>
        ) : (
          <>
            {count}
            {description}
          </>
        )}
      </p>
      <button
        className={`mt-1 ${
          isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-900 hover:bg-orange-700'
        } text-white text-xs px-2 py-1 lg:px-4 lg:py-2 lg:text-md rounded-lg`}
        onClick={onClick}
        disabled={isLoading}
      >
        View Requests
      </button>
    </div>
  );
}
