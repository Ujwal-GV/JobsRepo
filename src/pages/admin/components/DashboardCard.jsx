import React from 'react'

export default function DashboardCard({title, count, icon}) {
  return (
    <div className="bg-white shadow-lg rounded-lg px-4 py-3 flex items-center justify-between transition hover:scale-105 hover:cursor-pointer">
        <div>
            <h2 className="flex gap-4 text-md lg:text-lg md:text-lg font-semibold">
              {title}
              <span className='text-orange-600 mt-0 lg:mt-1 md:mt-1 text-md'>{icon}</span>
            </h2>
            <p className="text-xl  lg:text-xl md:text-xl font-bold">{count}</p>
        </div>
    </div>
  )
}
