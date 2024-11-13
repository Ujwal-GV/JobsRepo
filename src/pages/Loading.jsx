import React from 'react'
import { ImSpinner6 } from "react-icons/im";
const Loading = () => {
  return (
    <div className='w-full h-[calc(100vh-80px)] bg-white flex center flex-col'>
        <div className='relative '>
        <ImSpinner6 className='animate-spin-slow text-[2rem] sm:text-[3rem] md:text-[6rem] text-blue-700'>
        </ImSpinner6>
          <span className='absolute inset-0 flex items-center justify-center'>
            <ImSpinner6 className='animatespin-slow-reverse  text-[0.8rem] sm:text-[1rem] md:text-[2rem] text-blue-700'>
            </ImSpinner6>
          </span>
        </div>
        <h3 className='text-[0.8rem] sm:text-[0.9rem] md:text-2xl mt-3 text-orange-600'>Grabbing everything you need, please wait!</h3>
    </div>
  )
}

export default Loading
