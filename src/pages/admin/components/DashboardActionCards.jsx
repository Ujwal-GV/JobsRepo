import React from 'react'

export default function DashboardActionCards({title, count, description}) {
  const handleClick = () => {
    alert("Request will be precessed!!");
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg px-4 py-3 transition hover:scale-105 hover:cursor-pointer">
        <h3 className="text-md lg:text-lg md:text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{count}{description} </p>
        <button 
          className="mt-1 bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1 lg:px-4 lg:py-2 lg:text-md rounded-lg"
          onClick={handleClick}
        >
          View Requests
        </button>
    </div>
  )
}
