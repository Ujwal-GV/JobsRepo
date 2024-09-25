import React from 'react'

const MainContext = ({children}) => {
  return (
    <div className='w-full max-w-[1600px] mx-auto'>
      {
        children
      }
    </div>
  )
}

export default MainContext
