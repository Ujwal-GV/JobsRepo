import React from 'react'
import { FaSearch } from "react-icons/fa";
const SeachInput = (props) => {
  return (
    <div className='bg-white p-2 flex items-center  justify-between rounded-full shadow-sm shadow-black'>
       <input type="text" className='w-full me-2' placeholder={props.placeholder}/>
       <div className='h-7 w-7 center rounded-full bg-orange-500'><FaSearch className='cursor-pointer hover:text-white '/></div>
    </div>
  )
}

export default SeachInput
