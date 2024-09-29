import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const MainWrapper = () => {
  return (
    <div className='w-full relative max-w-[1800px] mx-auto'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default MainWrapper
