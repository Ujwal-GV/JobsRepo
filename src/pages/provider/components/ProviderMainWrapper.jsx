import React, { useContext, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ProviderNavbar from './ProviderNavbar'
import { useGetProviderProfileData } from '../../../pages/provider/queries/ProviderProfileQuery';

const ProviderMainWrapper = () => {

    useGetProviderProfileData();

     const location = useLocation();

     useEffect(()=>{
         sessionStorage.setItem("location" ,location.pathname)
     },[location])

  return (
    <div className='w-full relative max-w-[1800px] mx-auto'>
      <ProviderNavbar/>
      <Outlet/>
    </div>
  )
}

export default ProviderMainWrapper

