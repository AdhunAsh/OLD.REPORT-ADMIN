import React from 'react'
import logo from '../assets/logo.png'

const NavBar = ({setToken}) => {
  return (
    <div className='flex items-center px-[4%] py-2 justify-between'>
        <img className='w-[max(10%,8px)]' src= {logo}  alt="" />
        <button onClick={()=> setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default NavBar