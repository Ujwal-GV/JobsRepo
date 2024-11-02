import React, {  useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useGetProfileData } from '../pages/seeker/queries/ProfileQuery'

const MainWrapper = () => {

     if(localStorage.getItem("authToken"))
     {
      useGetProfileData()
     }
     const location = useLocation();
     useEffect(()=>{
         sessionStorage.setItem("location" ,location.pathname)
     },[location])


  return (
    <div className='w-full relative max-w-[1800px] mx-auto'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default MainWrapper

