import React, { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavbarFreelancer from './NavbarFreelancer'
import { useGetFreelancerProfileData } from '../../../pages/freelancer/queries/FreelancerProfileQuery';

const FreelancerMainWrapper = () => {

    useGetFreelancerProfileData();

     const location = useLocation();

     useEffect(()=>{
         sessionStorage.setItem("location" ,location.pathname)
     },[location])

  return (
    <div className='w-full relative max-w-[1800px] mx-auto'>
      <NavbarFreelancer/>
      <Outlet/>
    </div>
  )
}

export default FreelancerMainWrapper

