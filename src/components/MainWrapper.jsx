import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthContext } from '../contexts/AuthContext'

const MainWrapper = () => {

  const {userRole} = useContext(AuthContext)

  useEffect(()=>{},[userRole])

  return (
    <div className='w-full relative max-w-[1800px] mx-auto'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default MainWrapper
